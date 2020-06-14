module.exports = async function(body, ...param) {
	//User is checking in. Let's verify a few things ...
	var thisUser = body.user_id;
	if(process.globals.userInfo.includes(thisUser)) {
		return "You're already good to go! Thanks for checking in!";
	}

	//get this user's email ...
	var userData;
	var promise = new Promise(function(resolve, reject) {
		slackref.callMethod('users.info', {user: thisUser}, resolve); //bug? apparently it doesn't matter who we invite here because it Doesn't Work. Nice.
	}).then(function(data) {
		userData = data;
	});
	await promise;

	//We only really care about the email here ...
	var userEmail = userData.user.email;
	if(process.globals.preCheckin_list.includes(userEmail)) {
		//ok, let's set them up:
		process.globals.userInfo[thisUser] = {
			name: userData.user.real_name_normalized,
			username: userData.user.display_name_normalized,
			email: userData.user.email,
			team: false
		};
		return "OK! Welcome in, I've gotten you all checked in.";
	}
	return "I can't find your account on our registration list. Please contact a staff member for help!";
};
