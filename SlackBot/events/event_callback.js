module.exports = function(body) {
	var slackref = process.globals.slackbot;
	console.log("Triggered event_callback event");

	//add some chat filtering ...
	var channel = body.event.channel;
	var user = body.event.user;
	var msg = body.event.text;
	var eventid = body.event_id;
	var ts = body.event.ts;
	console.log(body);
	if(body.event.type == "message") {
		//see if message is in a priviledged channel ...
		if(process.globals.privilegedChannels.includes(channel)) {
			if(process.globals.privilegedList.includes(user)) {
				console.log("got message in protected channel, but from OK user");
				return "OK, message fine";
			} else {
				console.log("message should be deleted! non-auth'd user in auth-required channel");
				slackref.callMethod('chat.delete', {channel: channel, ts: ts});
				slackref.callMethod('chat.postEphemeral', {attachments: [], channel: channel, user: user, text: "Hi there! Messages are unfortunately not allowed in this channel. Instead, give a reaction! If you have a question, try #general. Thanks!"});
				return "OK, will delete!";
			}
		}
	}
	return "i don't care about this event!";
};
