const { containsPortillos } = require("../utils/removePortillos");
const addMessage = require('./addMessage');
const pollService = require('../api/poll/services/pollService');

const webSockets = new Map(); // userID: webSocket
const lectures = new Map(); // lectureId: [ userId ]
const ownerMap = new Map();

const handleRequest = (webSocket, req) => {
  const len = req.url.length
  const roles = req.session.user_roles
  const url = new URLSearchParams(req.url.substring(2, len));
  const userId = Number(req.session.userid)
  const lectureId = Number(url.get('lectureId'));
  const courseId = Number(url.get('courseId'));
  if (!userId || !lectureId || !courseId) {
    webSocket.send("Missing Parameters");
    webSocket.close();
  }
  if (roles.filter((role) => (role.course_id === courseId) && (role.role === 'PROFESSOR'))) {
    if (!ownerMap.has(lectureId)) {
      ownerMap.set(lectureId, new Set());
      ownerMap.get(lectureId).add(userId);
    } else {
      const set = ownerMap.get(lectureId);
      set.add(userId);
      ownerMap.set(lectureId, set);
    }
  }
  webSockets.set(userId, webSocket);
  if (!lectures.has(lectureId)) {
    lectures.set(lectureId, new Set());
    lectures.get(lectureId).add(userId);
  } else {
    const set = lectures.get(lectureId);
    set.add(userId);
    lectures.set(lectureId, set);
  }
  console.log('connected user: ' + userId + ' to lecture: ' + lectureId);

  webSocket.on('message', async (message) => {
    const messageObj = JSON.parse(message)
    if (containsPortillos(JSON.stringify(messageObj))) {
      return;
    }
    if (messageObj.type === 'message') {
      const {
        body,
        is_anonymous: isAnonymous,
        parent_id: parentId } = messageObj.payload;
      const insertId = await addMessage(
        req.session.userid,
        body,
        isAnonymous,
        lectureId,
        parentId
      );
      messageObj.payload.message_id = insertId
      messageObj.payload.timestamp = new Date().toISOString()
    } else if (messageObj.type === 'poll') {
      const {
        question_text: questionText,
        poll_choices: pollChoices
      } = messageObj.payload
      const pollInfo = await pollService.addPoll(
        req.session.userid,
        lectureId,
        questionText,
        pollChoices
      )
      messageObj.payload.pollInfo = pollInfo
      messageObj.payload.timestamp = new Date().toISOString()
      messageObj.payload.poll_choices = messageObj.payload.poll_choices.map((choice) => ({ choice_text: choice.choice_text }))
    } else if (messageObj.type === 'question') {
      const {
        body,
        is_anonymous,
      } = messageObj.payload;

      const owner = ownerMap.get(lectureId)
      const toUserWebSocket = webSockets.get(owner);
      if (toUserWebSocket) {
        toUserWebSocket.send(JSON.stringify({
          userId,
          body,
          is_anonymous,
          lecture_id: lectureId
        }))
      } else {
        const user = webSockets.get(userId);
        user.send(JSON.stringify({ msg: "Course Owner is not online." }))
      }
      return;
    } else {
      return;
    }
    const users = lectures.get(lectureId);
    users.forEach((user) => {
      const toUserWebSocket = webSockets.get(user);
      if (toUserWebSocket) {
        toUserWebSocket.send(JSON.stringify(messageObj))
      }
    })
  })

  webSocket.on('close', () => {
    webSockets.delete(userId);
    lectures.get(lectureId).delete(userId);
    if(ownerMap.get(lectureId) === userId){
      ownerMap.get(lectureId).delete(userId);
      if(ownerMap.get(lectureId).size === 0) {
        ownerMap.delete(lectureId);
      }
    }
    if (lectures.get(lectureId).size === 0) {
      lectures.delete(lectureId);
      console.log('deleted lecture: ' + lectureId)
    }
    console.log('disconnected user: ' + userId)
  })
}

module.exports = {
  handleRequest,
  lectures,
}