const { containsPortillos } = require("../utils/removePortillos");

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

  webSocket.on('message', (message) => {
    const messageObj = JSON.parse(JSON.stringify(message))
    if(containsPortillos(JSON.stringify(messageObj))){
      return;
    }
    const users = lectures.get(lectureId);
    users.forEach((user) => {
      if (user === userId) {
        return;
      }
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
  handleRequest
}