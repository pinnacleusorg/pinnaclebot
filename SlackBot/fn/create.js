const crypto = require('crypto');

module.exports = async function(body, ...param) {
	console.log("Make sure we're in the right channel ...");
	var slackref = process.globals.slackbot;
	var welcomeChannel = process.globals.welcomeChannel;
	if(body.channel_id == welcomeChannel) {
		//We're creating a new welcome channel ... check a couple of things ...
		var thisUser = process.globals.userInfo[body.user_id];
		if(!thisUser) {
			process.globals.userInfo[body.user_id] = {};
			thisUser = process.globals.userInfo[body.user_id];
		}
		if(thisUser.team) {
			return "You're already in a team -- you have to leave that first before creating a new one.";
		}

		//Generate a team for this user ...
		//Create a unique channel ID
		var teamid = "";
		var crypto = require('crypto')
		while(true) {
			teamid = crypto.createHash('sha1').update(Math.random()).digest('hex').substring(0, 8);
			//double check this isn't a collision -- we probably won't need this but just in case ...
			if(!Object.keys(process.globals.teamChannels).includes(teamid))
				break; //teamid is unique!
		}
		var channelCreation;
		var teamName = "team-"+teamid;
		var callingUser = body.user_id
		//TODO: danger! if we go to slow this will be sad
		var promise = new Promise(function(resolve, reject) {
			slackref.callMethod('conversations.create', {name: teamName, is_private: true, user_ids:callingUser}, resolve);
		}).then(function(data) {
			channelCreation = data;
		});
		await promise;
		console.log("Created channel", channelCreation);
		return "I just made your team channel, #"+teamName+" -- check it out!";
	}


};
