const express = require('express');
const fs = require('fs');
const SlackBot = require('./SlackBot');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT

var thisParser = new SlackBot(process.env.SLACK_TOKEN, process.env.SLACK_OAUTH, process.env.SLACK_ADMIN);

//ideally, our globals would be on something that is thread-safe and not in-memory. TODO: fix!
if(fs.existsSync('globals_'+process.env.BRANCH+'.json')) {
	process.globals = JSON.parse(fs.readFileSync('globals_'+process.env.BRANCH+'.json'));
	process.globals.slackbot = thisParser;
	console.log("loaded globals from file!", Object.keys(process.globals.userInfo).length);
}
if(!process.globals) {
	process.globals = {};
	if(process.env.BRANCH == "master") {
		process.globals.privilegedList = ['U0146Q88V2N'];
		process.globals.privilegedChannels = [''];
		process.globals.welcomeChannel = '';
		process.globals.staffChannel = 'G015H8570E4';
		process.globals.userInfo = {};
		process.globals.teamChannels = {};

		process.globals.preCheckin_list = [];
		process.globals.pendingInvites = {};

		process.globals.nodropin = [];
		process.globals.lfgList = [];
	} else if(process.env.BRANCH == "development") {
		process.globals.privilegedList = ['U013W1ST95H'];
		process.globals.privilegedChannels = [];
		process.globals.welcomeChannel = '';
		process.globals.staffChannel = 'G015H8570E4';
		process.globals.userInfo = {};
		process.globals.teamChannels = {};

		process.globals.preCheckin_list = ["kendall@pinnacle.us.org", "kendall+test@pinnacle.us.org"];
		process.globals.pendingInvites = {};

		process.globals.nodropin = [];
		process.globals.lfgList = [];
	}
	process.globals.slackbot = thisParser;
}

//Regularly save our globals to file
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

//When we exit our script, make sure we perform a save.
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



// Handle for Slack slash commands -- these are URL Encoded
app.use('/handle', bodyParser.urlencoded({ extended: true, verify: (req, res, buf) => {
	req.rawBody = buf;
} }));

// Event for Slack reported events -- these are JSON encoded.
app.use('/event', bodyParser.json({ verify: (req, res, buf) => {
	req.rawBody = buf;
} }));



app.use('/handle', thisParser.parse);
app.use('/event', thisParser.eventParse);

//what index??? we don't exist.
app.get('/', (req, res) => res.sendStatus(404))

app.listen(port, () => console.log(`Listening at ${port}`))
