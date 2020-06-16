const crypto = require('crypto');

module.exports = function(body, ...param) {
	var slackref = process.globals.slackbot;
	var invitationID = process.globals.pendingInvites[param[0]];
	var thisUser = process.globals.userInfo[body.user_id];
	if(thisUser.team) {
		var team = process.globals.teamChannels[thisUser.team];
		if(team.leader != body.user_id || team.members.length == 1) {
			//ok, leave team ...
			if(team.members.length > 1) {
				slackref.callMethod('chat.postMessage', {channel: channelID, text: "<@"+body.user_id+"> left the team."});
			}
			slackref.callMethod('conversations.kick', {channel: channelID, user: body.user_id});
			var channelID = thisUser.team;
			thisUser.team = false;
			team.members.splice(team.members.indexOf(body.user_id), 1);
			return "You've successfully left your team.";
		}
		return "You can't leave your team since you're the owner -- delegate the role (`/p setowner @[name]`) first.";
	}
	return "You aren't in a team!";
};
