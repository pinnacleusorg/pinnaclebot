//this command, /card [@user], will allow an admin to generate a team card for any user's team, or any team id.
module.exports = function(body, ...param) {
	var slackref = process.globals.slackbot;
	if(process.globals.privilegedList.includes(body.user_id)) {
		var getUser = param[0]; //parse string ...
		if(getUser && getUser != "") {
			var userString = getUser.split('@').pop().split('|')[0].trim();
			var team = false;
			if(userString != "" && Object.keys(process.globals.userInfo).includes(userString)) {
				var user = process.globals.userInfo[userString];
				if(user.team)
					team = process.globals.teamChannels[user.team];
			}
			else if(process.globals.teamChannels.includes(getUser)) {
				team = process.globals.teamChannels[getUser];
			}
			if(team) {
				return slackref.generateTeamCard(team);
			}
			return "That team doesn't exist!";
		}
		return "You have to tag a user to get the card `/yeti card @Yeti` or `/yeti card [teamid]`";
	}
	return "Nice try, sucker!";
};
