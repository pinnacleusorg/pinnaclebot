const express = require('express')
const SlackBot = require('./SlackBot');
const GithubCI = require('./GithubCI');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express()
const port = 8001

var thisParser = new SlackBot(process.env.SLACK_TOKEN);
var thisGithub = new GithubCI(process.env.GITHUB_SECRET);

app.use(bodyParser.urlencoded({ extended: true, verify: (req, res, buf) => {
	req.rawBody = buf;
} }));

app.use('/handle', thisParser.parse);
app.use('/git', thisGithub.parse);

app.get('/', (req, res) => res.sendStatus(404))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
