function print_generalCommands(response) {
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*General Commands*"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p help`*\nPrints out this dialogue."
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p create`*\nCreates a brand new team, and invites you to the team room."
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p lfg`*\nDon't have a team yet? Opens the Looking-for-Group options."
		}
	});
}
function print_supportCommands(response) {
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*Support Commands*"
		}
	});
	response.blocks.push({
		"type": "divider"
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p ticket`*\nNeed to get in touch with staff? Opens the support ticket options."
		}
	});
}
function print_teamCommands(response) {
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*Team Room Commands* (can only be used in your team channel)"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p invite [@name]`*\nInvite a team member by @Tagging them!"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p team project [name]`*\nSet the name of your team's project."
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p team lfg [0/1]`*\nTurn on \"Looking-for-group\" mode. This lets other people find your team and join in!"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p team description [...]`*\nWrite a short description for your team's project"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p team technologies [javascript, python, tensor, ...]`*\nWhat technologies does your project incorporate?"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p team technologies [javascript, python, tensor, ...]`*\nWhat technologies does your project incorporate?"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/p team devpost [https:// ...]`*\nLink to your devpost submission"
		}
	});
}
function print_divider(response) {
	response.blocks.push({
		"type": "divider"
	});
}
module.exports = function(body, ...param) {
	//TODO: maybe listen to /p help ... params to finetune help result
	var response = {'blocks': []};
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "plain_text",
			"emoji": true,
			"text": "Hi! Welcome to the Pinnacle Slack! Here are some commands to get you started"
		}
	});
	print_divider(response);
	print_generalCommands(response);
	print_divider(response);
	var messageChannel = body.channel_id;
	if(Object.keys(process.globals.teamChannels).includes(messageChannel)) {
		print_teamCommands();
		print_divider(response);
	}
	print_supportCommands(response);
	return response;
};
