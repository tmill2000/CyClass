const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log(process.env.DB_HOST)
}
console.log(process.env.PORT)
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const _expressWs = require('express-ws')(app);
const routes = require('./api/routes');
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());

app.use(sessions({
  secret: process.env.SESSION_SECRET || 'test',
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
  resave: false
}))

app.use('/api', routes);

const server = app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server Closed');
    })
})