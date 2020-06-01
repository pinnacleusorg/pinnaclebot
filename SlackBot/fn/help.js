module.exports = function(body, ...param) {
	//TODO: maybe listen to /p help ... params to finetune help result
	var response = {
	    "blocks": [
	        {
	            "type": "section",
	            "text": {
	                "type": "plain_text",
	                "emoji": true,
	                "text": "Hi! Welcome to the Pinnacle Slack! Here are some commands to get you started "
	            }
	        },
	        {
	            "type": "divider"
	        },
	        {
	            "type": "section",
	            "text": {
	                "type": "mrkdwn",
	                "text": "*General Commands*"
	            }
	        },
	        {
	            "type": "section",
	            "text": {
	                "type": "mrkdwn",
	                "text": "*`/p help`*\nPrints out this dialogue."
	            }
	        },
	        {
	            "type": "section",
	            "text": {
	                "type": "mrkdwn",
	                "text": "*`/p create`*\nCreates a brand new team, and invites you to the team room."
	            }
	        },
	        {
	            "type": "section",
	            "text": {
	                "type": "mrkdwn",
	                "text": "*`/p lfg`*\nDon't have a team yet? Opens the Looking-for-Group options."
	            }
	        },
	        {
	            "type": "divider"
	        },
	        {
	            "type": "section",
	            "text": {
	                "type": "mrkdwn",
	                "text": "*Support Commands*"
	            }
	        },
	        {
	            "type": "section",
	            "text": {
	                "type": "mrkdwn",
	                "text": "*`/p ticket`*\nNeed to get in touch with staff? Opens the support ticket options."
	            }
	        }
	    ]
	};
	return response;
};
