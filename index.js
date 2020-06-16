const express = require('express');
const fs = require('fs');
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

process.globals.nodropin = [];
process.globals.lfgList = [];
function loadGlobals() {
	if(!fs.existsSync('globals.json'))
		return;
	process.globals = JSON.parse(fs.readFileSync('globals.json'));;
	console.log("loaded globals!", process.globals);
}
loadGlobals();
setInterval(function() {
	//save globals to file ...
	var data = JSON.stringify(student, null, 2);

	fs.writeFile('globals.json', data, (err) => {
	    console.log("Performed save ... len:"+data.length);
	});

}, 5 * 60 * 1000);

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
