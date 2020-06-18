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
if(process.env.BRANCH == "master") {
	process.globals.privilegedList = [''];
	process.globals.privilegedList = [];
	process.globals.privilegedChannels = [''];
	process.globals.welcomeChannel = '';
	process.globals.userInfo = {};
	process.globals.teamChannels = {};

	// process.globals.preCheckin_list;
	process.globals.pendingInvites = {};

	process.globals.nodropin = [];
	process.globals.lfgList = [];
} else if(process.env.BRANCH == "development") {
	process.globals.privilegedList = ['U013W1ST95H'];
	process.globals.privilegedList = [];
	process.globals.privilegedChannels = ['C015ABQTKRQ'];
	process.globals.welcomeChannel = 'C0148E1BQGZ';
	process.globals.userInfo = {};
	process.globals.teamChannels = {};

	process.globals.preCheckin_list = ["kendall@pinnacle.us.org", "kendall+test@pinnacle.us.org"];
	process.globals.pendingInvites = {};

	process.globals.nodropin = [];
	process.globals.lfgList = [];
}
process.globals.slackbot = thisParser;

function loadGlobals() {
	if(!fs.existsSync('globals_'+process.env.BRANCH+'.json'))
		return;
	process.globals = JSON.parse(fs.readFileSync('globals_'+process.env.BRANCH+'.json'));
	process.globals.slackbot = thisParser;
	console.log("loaded globals!", Object.keys(process.globals.userInfo).length);
}
loadGlobals();

setInterval(function() {
	//save globals to file ...
	console.log("Doing save ...");
	var data = JSON.stringify(process.globals, null, 2);
	fs.writeFile('globals_'+process.env.BRANCH+'.json', data, (err) => {
		if(err) {
			console.log("A save error occurred! Saving an emergency backup ...", err);
			fs.writeFileSync('globals_bak.json', data);
			console.log("Emergency backup saved!");
		}
	    console.log("Performed save ... len:"+data.length);
	});
}, 60 * 1000);

function exitHandler(options, exitCode) {
    if (options.cleanup) {
		console.log("Going down, saving ...");
		fs.writeFileSync('globals_'+process.env.BRANCH+'.json', JSON.stringify(process.globals, null, 2)); //HAS to be syncronous
	}
    if (exitCode || exitCode === 0) {
		console.log("Going down "+exitCode);
	}
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


//slack has a very cool api
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
