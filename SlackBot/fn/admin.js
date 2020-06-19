module.exports = function(body, ...param) {
	var slackref = process.globals.slackbot;
	if(process.globals.privilegedList.includes(body.user_id)) {
		//we are an admin using this command ... admin the target!
		var getUser = param[0]; //parse string ...
		if(getUser && getUser != "") {
			getUser = getUser.split('@').pop().split('|')[0].trim();
			if(process.globals.privilegedList.includes(getUser)) {
				process.globals.privilegedList.splice(process.globals.privilegedList.indexOf(getUser), 1);
				return "I have removed <@"+getUser+">'s admin status.";
			} else {
				process.globals.privilegedList.push(getUser);
				return "I have promoted <@"+getUser+"> to admin status.";
			}
		}
		return "You have to tag a user to promote `/yeti admin @Yeti`";
	}
	return "Nice try, sucker!";
};
