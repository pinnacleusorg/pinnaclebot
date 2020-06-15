const express = require('express')
const SlackBot = require('./SlackBot');
const GithubCI = require('./GithubCI');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express()
const port = process.env.PORT

var thisParser = new SlackBot(process.env.SLACK_TOKEN, process.env.SLACK_OAUTH, process.env.SLACK_ADMIN);
var thisGithub = new GithubCI(process.env.GITHUB_SECRET);

//Define Globals
process.globals = {};

//process.globals.privilegedList = ['U013W1ST95H'];
process.globals.privilegedList = [];
process.globals.privilegedChannels = ['C015ABQTKRQ'];
process.globals.welcomeChannel = 'C0148E1BQGZ';
process.globals.userInfo = {};
process.globals.slackbot = thisParser;
process.globals.teamChannels = {};

process.globals.preCheckin_list = ["kendall@pinnacle.us.org", "kendall+test@pinnacle.us.org"];
//process.globals.preCheckin = {};
process.globals.pendingInvites = {};

app.use('/handle', bodyParser.urlencoded({ extended: true, verify: (req, res, buf) => {
	req.rawBody = buf;
} }));

app.use('/event', bodyParser.json({ verify: (req, res, buf) => {
	req.rawBody = buf;
} }));



app.use('/handle', thisParser.parse);
app.use('/event', thisParser.eventParse);
app.use('/git', thisGithub.parse);

app.get('/', (req, res) => res.sendStatus(404))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
