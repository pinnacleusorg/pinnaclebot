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
						thisUser.team = param[0];
						team.members.push(body.user_id);
						if(team.pending.indexOf(body.user_id) != -1)
							team.pending.splice(team.pending.indexOf(body.user_id), 1);

						var waitForInvite = new Promise(function(resolve, rej) {
							slackref.callMethod('conversations.invite', {channel: param[0], users: body.user_id }, resolve);
						});
						await waitForInvite;
						slackref.callMethod('chat.postMessage', {channel: param[0], text: "<!channel>: <@"+body.user_id+"> has joined the team (drop-in)!" });

						return "OK, I've added you into the team room - happy hacking!";
					}
					//make sure they're not in LFG if they're full ...
					if(process.globals.lfgList.indexOf(param[0]) != -1) {
						team.lfg = false;
						process.globals.lfgList.splice(process.globals.lfgList.indexOf(param[0]), 1);
					}

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
