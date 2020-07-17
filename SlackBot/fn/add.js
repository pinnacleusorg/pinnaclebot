//This function, /add [@user], will allow a staff member to join a team room by force. 
module.exports = async function(body, ...param) {
	var slackref = process.globals.slackbot;
	var team = process.globals.teamChannels[param[0]];
	var thisUser = process.globals.userInfo[body.user_id];
	if(process.globals.privilegedList.includes(body.user_id)) {
		if(team) {
			//invitation isn't invalid, team isn't full. we should be able to add this user.
			var waitForInvite = new Promise(function(resolve, rej) {
				slackref.callMethod('conversations.invite', {channel: param[0], users: body.user_id }, resolve);
			});
			await waitForInvite;
			slackref.callMethod('chat.postMessage', {channel: param[0], text: "<!channel>: <@"+body.user_id+"> has joined the channel (Staff Drop-in)!" });

			return "OK, I've added you into the team room - happy hacking!";
		}
	}
	return "No access to this command!";
};
