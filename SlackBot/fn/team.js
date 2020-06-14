module.exports = async function(body, ...param) {
	console.log("Make sure we're in this user's team channel ...");
	var thisUser = process.globals.userInfo[body.user_id];
	if(thisUser.team) {
		if(body.channel_id == thisUser.team) {
			var team = process.globals.teamChannels[thisUser.team];
			var setting = param.shift().toLowerCase();
			var value = param.join(' ').trim();
			var keysToSet = Object.keys(team);
			
			//remove the keys we don't want to change / use internally
			keysToSet.splice(keysToSet.indexOf('leader'), 1);
			keysToSet.splice(keysToSet.indexOf('members'), 1);
			keysToSet.splice(keysToSet.indexOf('pending'), 1);

			if(keysToSet.indexOf(setting) == -1) {
				return "The setting `"+setting+"` does not exist!";
			}
			if(value == "") {
				//just report out ...
				return {text: "Current value for `"+setting+"`: `"+team[setting]+"`." };
			} else {
				//set the value ... (parse??) TODO: sanitize
				var oldValue = team[setting];
				team[setting] = value;
				return {response_type: 'in_channel', text: "<@"+body.user_id+">: Updated value for `"+setting+"` from `"+oldValue+"` to `"+value+"`." };
			}

		}
		return "This isn't your channel -- use this command in your team room!";
	}
	return "You don't seem to have a team -- try `/p create` first!";

};
