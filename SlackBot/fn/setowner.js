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
						if(body.user_id != getUser) {
							team.leader = getUser;

							return {response_type: 'in_channel', text: "<@"+getUser+"> has been set as the new room owner."};
						}
						return "You're already the owner! Do `/yeti setowner @[user]`";
					}
					return "That user isn't in your team.";
				}
				return "You didn't seem to tag someone! You have to tag them like `/yeti setowner @Yeti`.";
			}
			return "You need to be the channel owner in order to set your team owner.";
		}
		return "This isn't your channel -- use this command in your team room!";
	}
	return "You can't setowner since you're not on a team currently!";
};
