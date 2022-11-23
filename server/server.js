const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const https = require("https");
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./api/routes');
const websockets = require('./websockets/websockets');
const port = process.env.PORT || 443;
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());


 app.use(sessions({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
  resave: false
}))


app.use('/api', routes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../www/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});
app.get('/*', function(req, res) {
  const filePath = path.join(__dirname, '../www', req.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  } else {
    res.sendFile(path.join(__dirname, '../www/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  }
})


const webSocketServer = new (require('ws')).Server({ noServer: true });
webSocketServer.on('connection', websockets.handleRequest)

let server;
if (port == 443) {
  server = https
  .createServer(
    {
      key: fs.readFileSync("/home/vm-user/ssl/sdmay23-40.key"),
      cert: fs.readFileSync("/home/vm-user/ssl/sdmay23-40.crt"),
    },
    app
  )
  .listen(port, function () {
    console.log(`Server Listening on Port ${port}`);
  });
} else {
  server = app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`);
  });
}

server.on('upgrade', (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, socket => {
    webSocketServer.emit('connection', socket, request);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server Closed');
  })
})