module.exports = function(body, ...param) {
	var slackref = process.globals.slackbot;
	if(process.globals.privilegedList.includes(body.user_id)) {
		var getUser = param[0].trim();
		var url = getUser.split('<').pop().split('|')[0].trim().replace('>', '').replace('mailto:', '');
		if(getUser && getUser != "") {
			//pre-reg
			process.globals.preCheckin_list.push(url);
			return "I've added "+getUser+" to the pre-register list. They should be able to checkin now.";
		}
		return "You need to write an email to pre-register, like `/yeti prereg kendall@pinnacle.us.org`.";
	}
	return "Nice try, sucker!";
};
