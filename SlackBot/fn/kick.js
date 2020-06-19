const crypto = require('crypto');

module.exports = async function(body, ...param) {
	var slackref = process.globals.slackbot;
	var thisUser = process.globals.userInfo[body.user_id];
	if(thisUser && thisUser.team) {
		if(body.channel_id == thisUser.team) {
			var team = process.globals.teamChannels[thisUser.team];
			if(team.leader == body.user_id) {
				var getUser = param[0];
				if(getUser && getUser != "") {
					getUser = getUser.split('@').pop().split('|')[0].trim();
					if(team.members.includes(getUser)) {
						if(body.user_id == getUser) {

							slackref.callMethod('chat.postMessage', {channel: channelID, text: "<@"+getUser+"> left the team."});
							slackref.callMethod('conversations.kick', {channel: channelID, user: getUser});
							kickedUser = process.globals.userInfo[getUser];

							kickedUser.team = false;
							team.members.splice(team.members.indexOf(getUser), 1);

							return {response_type: 'in_channel', text: "<@"+getUser+"> has been removed from the team."};
						}
						return "You can't kick yourself! Do `/yeti leaveteam`";
					}
					return "That user isn't in your team.";
				}
				return "You didn't seem to tag someone! You have to tag them like `/yeti kick @Yeti`.";
			}
			return "You need to be the channel owner in order to kick people.";
		}
		return "This isn't your channel -- use this command in your team room!";
	}
	return "You can't kick people since you're not on a team currently!";
};
