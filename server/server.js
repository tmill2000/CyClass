const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const _expressWs = require('express-ws')(app);
const routes = require('./api/routes');
const port = process.env.PORT || 6000;

app.use(bodyParser.json());

app.use('/api', routes);

const server = app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server Closed');
    })
})