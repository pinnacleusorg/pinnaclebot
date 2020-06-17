const express = require('express');
const fs = require('fs');
const SlackBot = require('./SlackBot');
const GithubCI = require('./GithubCI');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express()
const port = process.env.PORT

var thisParser = new SlackBot(process.env.SLACK_TOKEN, process.env.SLACK_OAUTH, process.env.SLACK_ADMIN);
// var thisGithub = new GithubCI(process.env.GITHUB_SECRET);

//Define Globals
process.globals = {};

//yetirocess.globals.privilegedList = ['U013W1ST95H'];
process.globals.privilegedList = [];
process.globals.privilegedChannels = ['C015ABQTKRQ'];
process.globals.welcomeChannel = 'C0148E1BQGZ';
process.globals.userInfo = {};
process.globals.teamChannels = {};

process.globals.preCheckin_list = ["kendall@pinnacle.us.org", "kendall+test@pinnacle.us.org"];
//yetirocess.globals.preCheckin = {};
process.globals.pendingInvites = {};

process.globals.nodropin = [];
process.globals.lfgList = [];
process.globals.slackbot = thisParser;

function loadGlobals() {
	if(!fs.existsSync('globals.json'))
		return;
	process.globals = JSON.parse(fs.readFileSync('globals.json'));
	process.globals.slackbot = thisParser;
	console.log("loaded globals!", Object.keys(process.globals.userInfo).length);
}
loadGlobals();

setInterval(function() {
	//save globals to file ...
	console.log("Doing save ...");
	var data = JSON.stringify(process.globals, null, 2);
	fs.writeFile('globals.json', data, (err) => {
	    console.log("Performed save ... len:"+data.length);
	});
}, 30 * 1000);

function exitHandler(options, exitCode) {
    if (options.cleanup) {
		console.log("Going down, saving ...");
		fs.writeFileSync('globals.json', JSON.stringify(process.globals, null, 2));
	}
    if (exitCode || exitCode === 0) {
		console.log("Going down "+exitCode);
	}
    if (options.exit) process.exit();
}
function exitHandler() {
	console.log("Going down, saving ...");
	fs.writeFileSync('globals.json', JSON.stringify(process.globals, null, 2));
	process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


app.use('/handle', bodyParser.urlencoded({ extended: true, verify: (req, res, buf) => {
	req.rawBody = buf;
} }));

app.use('/event', bodyParser.json({ verify: (req, res, buf) => {
	req.rawBody = buf;
} }));



app.use('/handle', thisParser.parse);
app.use('/event', thisParser.eventParse);
// app.use('/git', thisGithub.parse);

app.get('/', (req, res) => res.sendStatus(404))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
