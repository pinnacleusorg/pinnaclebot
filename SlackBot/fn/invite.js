module.exports = async function(body, ...param) {
	console.log("Make sure we're in this user's team channel ...");
	var thisUser = process.globals.userInfo[body.user_id];
	if(thisUser.team) {
		if(body.channel_id == thisUser.team) {
			var team = process.globals.teamChannels[thisUser.team];
			if(team.leader == body.user_id) {
				//see if we're at capacity
				if(team.members.length < 4) {
					//make sure we're not spamming invites ...
					if(team.pending.length < 10) {
						var getUser = param[0]; //parse string ...
						if(getUser && getUser != "") {
							getUser = getUser.split('@').pop().split('|')[0].trim();
							console.log(getUser);
							console.log(body);
							if(!team.pending.includes(getUser)) {
								if(process.globals.userInfo[getUser]) {
									if(!process.globals.userInfo[getUser].team) {
										//ok, invite!


										return {response_type: 'in_channel', text: "<@"+body.user_id+">: Invited <@"+getUser+"> to join the team."};
									}
									return "<@"+getUser+"> is already in a team -- they have to leave before you can invite them.";
								}
								return "I don't know that user ... are they registered? They may need to do `/p checkin`";
							}
							return "You've already invited <@"+getUser+">";
						}
						return "You didn't seem to tag someone! You have to tag them like `/p invite @PinnacleBot`.";
					}
					return "You have a lot of invites pending right now ... please clear them to invite more." //TODO: secure this better
				}
				return "You're already at the team capacity (4) -- please remove a user to invite another!";
			}
			return "You aren't the leader of this channel ... ask <@"+team.leader+"> to invite a user!";
		}
		return "This isn't your channel -- use this command in your team room!";
	}
	return "You don't seem to have a team -- try `/p create` first!";
};
