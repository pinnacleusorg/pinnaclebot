const express = require('express')
const SlackBot = require('./SlackBot');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express()
const port = 8001

var thisParser = new SlackBot(process.env.SLACK_TOKEN);

app.use(bodyParser.urlencoded({ extended: true, verify: (req, res, buf) => {
	req.rawBody = buf;
} }));

app.use(thisParser.parse);

app.get('/', (req, res) => res.sendStatus(404))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
