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
			"text": "*`/yeti help`*\nPrints out this dialogue."
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti create`*\nCreates a brand new team, and invites you to the team room."
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti lfg`*\nDon't have a team yet? Opens the Looking-for-Group options."
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
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti ticket`*\nNeed to get in touch with staff? Opens the support ticket options."
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
			"text": "*`/yeti invite [@name]`*\nInvite a team member by @Tagging them!"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti team title [name]`*\nSet the name of your team's project."
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti team description [...]`*\nWrite a short description for your team's project"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti team tech [javascript, python, tensor, ...]`*\nWhat technologies does your project incorporate?"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti team lfg [0/1]`*\nTurn on \"Looking-for-group\" mode. This lets other people find your team and join in! (OFF by default)"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti team dropin [0/1]`*\nTurn on \"drop-in\" mode. This means that you're OK with Pinnacle staff coming into the channel to check-in with your group. (ON by default)"
		}
	});
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*`/yeti team devpost [https:// ...]`*\nLink to your devpost submission"
		}
	});
}
function print_divider(response) {
	response.blocks.push({
		"type": "divider"
	});
}
module.exports = function(body, ...param) {
	//TODO: maybe listen to /yeti help ... params to finetune help result
	var response = {'blocks': []};
	response.blocks.push({
		"type": "section",
		"text": {
			"type": "plain_text",
			"emoji": true,
			"text": "Hi! Welcome to the Pinnacle Slack! I'm Yeti, the managing bot for Pinnacle Summer Events. For more information, check out my <https://tinyurl.com/pinnaclebot|readme>! I'm still in beta, so be gentle with me! Here are some commands to get you started:"
		}
	});
	print_divider(response);
	print_generalCommands(response);
	print_divider(response);
	var messageChannel = body.channel_id;
	if(Object.keys(process.globals.teamChannels).includes(messageChannel)) {
		print_teamCommands(response);
		print_divider(response);
	}
	// print_supportCommands(response);
	return response;
};
