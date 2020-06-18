module.exports = async function(body, ...param) {
	var slackref = process.globals.slackbot;
	var team = process.globals.teamChannels[param[0]];
	var thisUser = process.globals.userInfo[body.user_id];
	if(thisUser) {
		if(!thisUser.team) {
			if(team) {
				if(team.lfg) {
					if(team.members.length < 4) {
						//invitation isn't invalid, team isn't full. we should be able to add this user.
						var waitForInvite = new Promise(function(resolve, rej) {
							slackref.callMethod('conversations.invite', {channel: forChannel, users: body.user_id }, resolve);
						});
						await waitForInvite;
						slackref.callMethod('chat.postMessage', {channel: forChannel, text: "<!channel>: <@"+body.user_id+"> has joined the team (drop-in)!" });

						thisUser.team = forChannel;
						team.members.push(body.user_id);
						if(team.pending.indexOf(body.user_id) != -1)
							team.pending.splice(team.pending.indexOf(body.user_id), 1);

						return "OK, I've added you into the team room - happy hacking!";
					}
					//make sure they're not in LFG if they're full ...
					
					team.lfg = false;
					process.globals.lfgList.splice(process.globals.lfgList.indexOf(thisUser.team), 1);

					return "Sorry, that team is full, so you can't drop in anymore."
				}
				return "That team isn't allowing drop-ins at this time.";
			}
			return "That team isn't allowing drop-ins at this time.";
		}
		return "You're already on a team. You'll need to leave that first before you can join another (`/yeti leaveteam`)";
	}
	return "You don't seem to be checked in ... can you do `/yeti checkin` first?";
};
