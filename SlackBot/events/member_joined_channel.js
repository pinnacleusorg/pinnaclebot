module.exports = function(body) {
	console.log("Triggered member_joined_channel event");
	console.log(body);
	var thisUser = process.globals.userInfo[body.event.user];
	var slackref = process.globals.slackbot;
	if(!thisUser || !thisUser.team || body.event.channel != thisUser.team) {
		console.log(thisUser);
		slackref.callMethod('chat.postEphemeral', {channel: body.event.channel, user: body.event.user, text: "Welcome in to the channel! You will need to be officially invited to be registered onto this team. Tell the owner to `/yeti invite` you!"});
		return "doesn't have team OR this isn't their team ..."
	}
	return "this is ok (?)"
};
