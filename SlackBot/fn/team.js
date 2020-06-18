//https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
function stringToBoolean(value) {
    switch(value.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        default: return false;
    }
}
//https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}


module.exports = async function(body, ...param) {
	var thisUser = process.globals.userInfo[body.user_id];
	if(thisUser && thisUser.team) {
		if(body.channel_id == thisUser.team) {
			var team = process.globals.teamChannels[thisUser.team];
			var setting = param.shift()
			if(setting == undefined || setting.trim() == "") {

				var card = process.globals.slackref.generateTeamCard(team);

				return "You must specify a setting -- `/yeti team [setting] [value]`";
			}
			setting.toLowerCase();
			var value = param.join(' ').trim();
			var valueRaw = value;
			value = value.replace(/\W/g, '');
			var keysToSet = Object.keys(team);

			if(value == "") {
				//just report out ...
				return {text: "Current value for `"+setting+"` is `"+team[setting]+"`." };
			} else {
				switch(setting) {
					case "title":
						var oldValue = team[setting];
						team[setting] = value.substring(0, 30); //char cap
						return {response_type: 'in_channel', text: "<@"+body.user_id+">: Updated value for `"+setting+"` from `"+oldValue+"` to `"+value+"`." };

					break;

					case "description":
					case "tech":
						var oldValue = team[setting];
						team[setting] = value.substring(0, 200);
						return {response_type: 'in_channel', text: "<@"+body.user_id+">: Updated value for `"+setting+"` from `"+oldValue+"` to `"+value+"`." };

					case "lfg":
						var booleanValue = stringToBoolean(""+setting);
						if(booleanValue != team[setting]) {
							//UPDATE!
							if(booleanValue) {
								process.globals.lfgList.push(thisUser.team);
							} else {
								process.globals.lfgList.splice(process.globals.lfgList.indexOf(thisUser.team), 1);
							}
							team[setting] = booleanValue;
							return {response_type: 'in_channel', text: "<@"+body.user_id+">: Updated value for `"+setting+"` from `"+oldValue+"` to `"+booleanValue+"`." };
						}
					break;

					case "dropin":
						if(!booleanValue) {
							process.globals.nodropin.push(thisUser.team);
						} else {
							process.globals.nodropin.splice(process.globals.nodropin.indexOf(thisUser.team), 1);
						}
						team[setting] = booleanValue;
						return {response_type: 'in_channel', text: "<@"+body.user_id+">: Updated value for `"+setting+"` from `"+oldValue+"` to `"+booleanValue+"`." };
					break;

					case "devpost":
						var value = valueRaw.split(' ')[0];
						if(validateUrl(value)) {
							if(value.indexOf("https://pinnacle.devpost.com") == 0) { //TODO: validate this better?
								team[setting] = value;
								return {response_type: 'in_channel', text: "<@"+body.user_id+">: Updated value for `"+setting+"` from `"+oldValue+"` to `"+value+"`." };
							}
						}
						return "That is not a valid URL!";
					break;

					default:
						return "The setting `"+setting+"` does not exist!";
					break;
				}


			}

		}
		return "This isn't your channel -- use this command in your team room!";
	}
	return "You don't seem to have a team -- try `/yeti create` first!";

};
