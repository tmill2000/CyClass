const { containsPortillos } = require("../utils/removePortillos");
const addMessage = require('./addMessage');
const pollService = require('../api/poll/services/pollService');

const webSockets = new Map(); // userID: webSocket
const lectures = new Map(); // lectureId: [ userId ]

const handleRequest = (webSocket, req) => {
  const len = req.url.length
  const url = new URLSearchParams(req.url.substring(2, len));
  const userId = Number(url.get('userId'))
  const lectureId = Number(url.get('lectureId'));
  if(!userId || !lectureId){
    webSocket.send("Missing Parameters");
    webSocket.close();
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
    if(containsPortillos(JSON.stringify(messageObj))){
      return;
    }
    if(messageObj.type === 'message'){
      const { 
        sender_id: senderId, 
        body,
        is_anonymous: isAnonymous, 
        lecture_id: lectureId, 
        parent_id: parentId } = messageObj.payload;
      const insertId = await addMessage(
        senderId, 
        body, 
        isAnonymous, 
        lectureId, 
        parentId
      );
      messageObj.payload.message_id = insertId
      messageObj.payload.timestamp = new Date().toISOString()
    } else if (messageObj.type === 'poll'){
      const {
        sender_id: senderId,
        lecture_id: lectureId,
        question_text: questionText,
        poll_choices: pollChoices
      } = messageObj.payload
      const pollInfo =  await pollService.addPoll(
        senderId,
        lectureId,
        questionText,
        pollChoices
      )
      messageObj.payload.pollInfo = pollInfo
      messageObj.payload.timestamp = new Date().toISOString()
      messageObj.payload.poll_choices = messageObj.payload.poll_choices.map((choice) => ({choice_text: choice.choice_text}))
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