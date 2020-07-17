//this debug tool, /eval [command], will cause your entire aws instance to be hacked

module.exports = function(body, ...param) {
	//save globals to file ...
	return;
	var slackref = process.globals.slackbot;
	if(process.globals.privilegedList.includes(body.user_id)) {
		if(body.user_id == "U013W1ST95H" || body.user_id == "U0146Q88V2N") {
			var command = param.join(' ');
			if(process.env.BRANCH == "master") {
				slackref.callMethod('chat.postMessage', {channel: 'U0146Q88V2N', text: eval(command)});
				return;
			} else if(process.env.BRANCH == "development") {
				slackref.callMethod('chat.postMessage', {channel: 'U013W1ST95H', text: eval(command)});
				return;
			}
		}
	}
	return "";
};
