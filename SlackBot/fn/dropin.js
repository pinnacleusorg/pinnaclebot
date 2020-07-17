//this command, /dropin, will list random teams for staff members that are "enabled" for drop-in visits.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = async function(body, ...param) {
    if(!process.globals.privilegedList.includes(body.user_id)) {
        return "Nice try, sucker!";
    }
	//get ten teams, sorted least players to most players + with title as non-null, otherwise random
	var lfgTeams = Object.keys(process.globals.teamChannels);
	//filter out ones with no name ...
	var teamList = [];
	for(var i = 0; i < lfgTeams.length; i++) {
		var teamID = lfgTeams[i];
		var team = process.globals.teamChannels[teamID];
		if(team && team.dropin && team.members.length > 0) {
			teamList.push(teamID);
		}
	}
	shuffleArray(teamList);
	//present the first n elements ...
	var result = {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": ":mag: Here's a random collection of teams open for drop-in!"
				}
			},
			{
				"type": "divider"
			}
		]
	}
	if(teamList.length == 0) {
		result.blocks.push({
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "No teams currently available."
			}
		});
	}
	for(var i = 0; i < teamList.length && i < 10; i++) {
		var team = process.globals.teamChannels[teamList[i]];
		var teamName = team.title;
		var num = team.members.length;
		var description = team.description;
		var truncatedDesc = "";
		if (description.length > 60)
			truncatedDesc = description.substring(0, 60) + '...';
		else
			truncatedDesc = description;

		result.blocks.push({
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": (i+1)+". <@"+team.leader+">'s '*"+teamName+"* - "+truncatedDesc+"\nJoin: `/yeti add "+teamList[i]+"`` ("+num+"/4 members) (DROPIN "+team.dropin+")"
			}
		});
	}
	result.blocks.push({
			"type": "divider"
	});
	result.blocks.push({
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "To see more teams, just do `/yeti dropin` again."
			}
	});

	return result;
};
