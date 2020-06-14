module.exports = async function(body, ...param) {
	console.log("Make sure we're in this user's team channel ...");

	if(thisUser.team) {
		if(body.channel_id == thisUser.team) {
			var team = process.globals.teamChannels[thisUser.team];
			var setting = param.pop().toLowerCase();
			var value = param.join(' ').trim();
			var keysToSet = Object.keys(team);
			keysToSet.splice(keysToSet.indexOf('leader'), 1);
			keysToSet.splice(keysToSet.indexOf('members'), 1);
			if(value == "") {
				//just report out ...
				return "Current value for `"+setting+"`: `"+team[setting]+"`.";
			} else {
				//set the value ... (parse??) TODO: sanitize
				var oldValue = team[setting];
				team[setting] = value;
				return "Updated value for `"+setting+"` from `"+oldValue+"` to `"+value+"`.";
			}

		}
		return "This isn't your channel -- use this command in your team room!";
	}
	return "You don't seem to have a team -- try `/p create` first!";

};
