//this debug tool, /lookup [@user / teamid], will allow an admin to get the JSON data blob for a team or player.
module.exports = function(body, ...param) {
	var slackref = process.globals.slackbot;
	if(process.globals.privilegedList.includes(body.user_id)) {
		var getUser = param[0]; //parse string ...
		if(getUser && getUser != "") {
			var userString = getUser.split('@').pop().split('|')[0].trim();
			if(userString != "" && Object.keys(process.globals.userInfo).includes(userString)) {
				return "```\n"+JSON.stringify(process.globals.userInfo[userString], null, 2)+"\n```";
			}
			//otherwise, assume team
			return "```\n"+JSON.stringify(process.globals.teamChannels[getUser], null, 2)+"\n```";
		}
		return "You have to tag a user to dump `/yeti lookup @Yeti` or `/yeti lookup [teamid]`";
	}
	return "Nice try, sucker!";
};
