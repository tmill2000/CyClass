const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./api/routes');
const websockets = require('./websockets/websockets');
const port = process.env.PORT || 2000;

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
app.use('/',express.static('../www'));


const webSocketServer = new (require('ws')).Server({ noServer: true });
webSocketServer.on('connection', websockets.handleRequest)

const server = app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

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