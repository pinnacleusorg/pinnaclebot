// this command, /create, will generate a new team room for a user who is not currently in a team room.
const crypto = require('crypto');

module.exports = async function(body, ...param) {
	var slackref = process.globals.slackbot;
	var welcomeChannel = process.globals.welcomeChannel;
	//We're creating a new welcome channel ... check a couple of things ...
	var thisUser = process.globals.userInfo[body.user_id];
	if(!thisUser) {
		return "I don't seem to have you registered ... can you do `/yeti checkin`?";
	}
	if(thisUser.team) {
		return "You're already in a team -- you have to leave that first before creating a new one.";
	}

	//Generate a team for this user ...
	//Create a unique channel ID
	var teamid = "";
	var crypto = require('crypto')
	while(true) {
		teamid = crypto.createHash('sha1').update(""+Math.random()).digest('hex').substring(0, 8);
		//double check this isn't a collision -- we probably won't need this but just in case ...
		if(!Object.keys(process.globals.teamChannels).includes(teamid))
			break; //teamid is unique!
	}
	var channelCreation;
	var teamName = "team-"+teamid;
	var callingUser = body.user_id
	//TODO: danger! if we go to slow this will be sad -- we need to finish this call before it times out
	var promise = new Promise(function(resolve, reject) {
		slackref.callMethod('conversations.create', {name: teamName, is_private: true, user_ids:callingUser}, resolve); //bug? apparently it doesn't matter who we invite here because it Doesn't Work. Nice.
	}).then(function(data) {
		channelCreation = data;
	});
	await promise;
	var channelID = channelCreation.channel.id;
	var waitForInvite = new Promise(function(resolve, rej) {
		slackref.callMethod('conversations.invite', {channel: channelID, users: callingUser }, resolve);
	});
	await waitForInvite;
	slackref.callMethod('chat.postMessage', {channel: channelID, text: "Welcome to your team channel! Use `/yeti help` to get started here. To invite your team members, do `/yeti invite @name`."});
	slackref.callMethod('conversations.setTopic', {channel: channelID, topic: "Team Room - Get started setting up your room with `/yeti team [setting] [value]`. See `/yeti help` for more information. For video calling, you can call in here: https://meet.jit.si/pinnacle2020-"+channelID});
	//Store metadata ...
	thisUser.team = channelID;
	process.globals.teamChannels[channelID] = {
		"leader": body.user_id,
		"title": "Untitled",
		"description": "No description yet ...",
		"tech": " ",
		"members": [body.user_id],
		"pending": [],
		"devpost": " ",
		"lfg": false,
		"dropin": true
	};

	console.log("Created team", channelCreation);
	return "I just made your team channel, <#"+channelID+"> -- go check it out!";


};
