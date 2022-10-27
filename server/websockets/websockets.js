const webSockets = new Map(); // userID: webSocket
const lectures = new Map(); // lectureId: [ userId ]

const handleRequest = (webSocket, req) => {
  const len = req.url.length
  const url = new URLSearchParams(req.url.substring(2, len));
  const userID = Number(url.get('userId'))
  const lectureId = Number(url.get('lectureId'));

  webSockets.set(userID, webSocket);
  if (!lectures.has(lectureId)) {
    lectures.set(lectureId, new Set());
    lectures.get(lectureId).add(userID);
  } else {
    const set = lectures.get(lectureId);
    set.add(userID);
    lectures.set(lectureId, set);
  }
  console.log('connected user: ' + userID + ' to lecture: ' + lectureId);

  webSocket.on('message', (message) => {
    console.log('received from ' + userID + ': ' + message)
    const messageObj = JSON.parse(message)
    const users = lectures.get(lectureId);
    users.forEach((user) => {
      if (user === userID) {
        return;
      }
      const toUserWebSocket = webSockets.get(user);
      if (toUserWebSocket) {
        console.log('sent to ' + user + ': ' + JSON.stringify(messageObj) + ' from ' + userID);

        toUserWebSocket.send(JSON.stringify(messageObj))
      }
    })
  })

  webSocket.on('close', () => {
    webSockets.delete(userID);
    lectures.get(lectureId).delete(userID);
    if (lectures.get(lectureId).size === 0) {
      lectures.delete(lectureId);
      console.log('deleted lecture: ' + lectureId)
    }
    console.log('deleted user: ' + userID)
  })
}

module.exports = {
  handleRequest
}