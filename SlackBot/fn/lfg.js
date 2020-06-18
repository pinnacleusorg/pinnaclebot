function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = async function(body, ...param) {
	//get ten teams, sorted least players to most players + with title as non-null, otherwise random
	var lfgTeams = [...process.globals.lfgList];
	//filter out ones with no name ...
	var teamList = [];
	for(var i = 0; i < lfgTeams.length; i++) {
		var teamID = lfgTeams[i];
		var team = process.globals.teamChannels[teamID];
		if(team.title != "Untitled" && team.lfg && team.members.length > 0) {
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
					"text": ":mag: Here's a random collection of teams open for Looking-for-Group drop-ins. You can freely join any team and chat with the members to see if you're a good fit."
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
				"text": "Sorry, no teams are currently allowing drop-in team members."
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
				"text": (i+1)+". *"+teamName+"* - "+truncatedDesc+"\nJoin: `/yeti join "+teamList[i]+"`` ("+num+"/4)"
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
				"text": "To see more open teams, just do `/yeti lfg` again."
			}
	});

	return result;
};
