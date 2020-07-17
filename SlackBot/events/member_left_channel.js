//When leaving a channel that is your team, this event will trigger the /leave command steps.
module.exports = async function(body) {
	var slackref = process.globals.slackbot;
	console.log("Triggered member_left_channel event");
	console.log(body);
	var user = process.globals.userInfo[body.event.user];
	var channel = body.event.channel;
	if(user && user.team) {
		if(user.team == channel) {
			//this is ok, we can parse it as a leave ... but not if they're the leader!
			var team = process.globals.teamChannels[channel];
			if(team.leader != body.event.user || team.members.length == 1) { //last member ...
				if(team.members.length > 1)
					slackref.callMethod('chat.postMessage', {channel: channel, text: "<@"+body.event.user+"> left the team."});
				console.log("should leave team");
				user.team = false;
				team.members.splice(team.members.indexOf(body.event.user), 1);
				return "leaving team ...";
			}
			var waitForInvite = new Promise(function(resolve, rej) {
				slackref.callMethod('conversations.invite', {channel: channel, users: body.event.user}, resolve);
			});
			await waitForInvite
			slackref.callMethod('chat.postEphemeral', {channel: channel, user: body.event.user, text: "You can't leave this channel since you own the team."});

			return "team leader can't leave! readd them"

		}
		return "if the channel they left isn't their team, i don't care!";
	}
	return "i don't care if they're not in a team!";
};
