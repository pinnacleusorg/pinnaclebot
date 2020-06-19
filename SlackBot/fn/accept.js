const crypto = require('crypto');

module.exports = async function(body, ...param) {
	var slackref = process.globals.slackbot;
	var invitationID = process.globals.pendingInvites[param[0]];
	var thisUser = process.globals.userInfo[body.user_id];
	if(!thisUser.team) {
		if(invitationID) {
			if(invitationID.forUser == body.user_id) {
				var forChannel = invitationID.forChannel;
				var team = process.globals.teamChannels[forChannel];
				if(team.members.length < 4) {
					//invitation isn't invalid, team isn't full. we should be able to add this user.
					thisUser.team = forChannel;
					team.members.push(body.user_id);
					team.pending.splice(team.pending.indexOf(body.user_id), 1);

					var waitForInvite = new Promise(function(resolve, rej) {
						slackref.callMethod('conversations.invite', {channel: forChannel, users: body.user_id }, resolve);
					});
					await waitForInvite;
					slackref.callMethod('chat.postMessage', {channel: forChannel, text: "<!channel>: <@"+body.user_id+"> has joined the team!" });


					process.globals.pendingInvites[param[0]] = false;

					return "OK, I've added you into the team room - happy hacking!";
				}
				return "That team is full now, so your invite has expired."
			}
			return "I'm not sure what invitation you're talking about -- maybe it expired?";
		}
		return "I'm not sure what invitation you're talking about -- maybe it expired?";
	}
	return "You're already on a team. You'll need to leave that first before you can join another (`/yeti leaveteam`)";
};
