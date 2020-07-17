const fs = require('fs');
const crypto = require('crypto');
const autoBind = require('auto-bind');
const axios = require('axios');

axios.defaults.baseURL = 'https://slack.com/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

"use strict";
class SlackBot {
	constructor(token, oauth, oauth_admin) {
		var thisMap = this;
		this.token = token;
		this.oauth = oauth;
		this.oauth_admin = oauth_admin;

		//Register all handlers from /fn/
		var normalizedPath = require("path").join(__dirname, "fn");
		fs.readdirSync(normalizedPath).forEach(function(file) {
  			var thisFn = require("./fn/" + file);
 			//register
			thisMap.addHandler(file.split('.')[0], thisFn);
		});

		//Register all events from /events/
		normalizedPath = require("path").join(__dirname, "events");
		fs.readdirSync(normalizedPath).forEach(function(file) {
  			var thisFn = require("./events/" + file);
 			//register
			thisMap.addEvent(file.split('.')[0], thisFn);
		});
		autoBind(this);
	}

	handlers = {};
	eventHandlers = {};
	masterOpen = false; // for disabling bot until a certain time

	addHandler(fn, method) {
		this.handlers[fn] = method;
	}
	addEvent(fn, method) {
		this.eventHandlers[fn] = method;
	}

	//process these async if necessary ...
	async callHandler(pr_acc, pr_rej, body, fn, ...param) {
		param.unshift(body);
		fn = fn.toLowerCase();
		if(fn in this.handlers) {
			console.log("Calling "+fn);
			if(this.handlers[fn].constructor.name == "AsyncFunction") {
				pr_acc(await this.handlers[fn].apply(this, param));
			} else
				pr_acc(this.handlers[fn].apply(this, param));
		} else {
			pr_rej("no handler registered");
		}
	}

	//these could be async if necessary? but their responses don't matter so.. you can return early from the requests
	callEvent(pr_acc, pr_rej, body, fn) {
		fn = fn.toLowerCase();
		if(fn in this.eventHandlers) {
			pr_acc(this.eventHandlers[fn].apply(this, [body]));
		} else {
			pr_rej("no event handler registered for "+fn);
		}
	}

	//call specific API method in slack api
	callMethod(methodName, parameters, resolve = "") {
		//make a query with the Slack API ...
		console.log("Calling "+methodName+" with parameters", parameters);
		var sudoCmds = ['chat.delete']; //commands that are performed with the admin OAuth token
		var stupidCmds = ['users.info']; //commands that decide to be stupid and require URL encoded parameters even though everything else is json required
		var token = this.oauth;
		if(sudoCmds.includes(methodName)) {
			token = this.oauth_admin;
		}
		if(stupidCmds.includes(methodName)) {
			//use x-www-form-urlencoded for this method
			console.log("Fallback, using url encoded for "+methodName);
			parameters.token = token;
			var data = Object.entries(parameters)
			  .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
			  .join('&');
			axios({
				method: 'post',
				url: methodName,
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				console.log(res.data);
				if(typeof resolve === "function") {
					resolve(res.data);
				}
			});
		} else {
			axios({
				method: 'post',
				url: methodName,
				data: parameters,
				headers: {
					Authorization: 'Bearer '+token
				}
			}).then(function(res) {
				console.log(res.data);
				if(typeof resolve === "function") {
					resolve(res.data);
				}
			});
		}
	}

	//handle all slash commands
	parse(req, res, next) {
		//verify token ...
		var body = req.body;
		var raw = req.rawBody.toString();
		var time = req.header("X-Slack-Request-Timestamp");
		if(Math.abs(new Date().getTime()/1000 - time) > 60 * 5) { res.sendStatus(404); return; }
		var sig = "v0:" + time + ":" + raw;
		var fullSig = "v0=" + crypto.createHmac('sha256', this.token).update(sig).digest('hex');
		if(crypto.timingSafeEqual(Buffer.from(fullSig), Buffer.from(req.header("X-Slack-Signature")))) {
			//determine appropriate handler ...
			if(process.env.BRANCH == "master" && !this.masterOpen) {
				var dateDelta = new Date() - new Date('2020-06-20'); // TODO: break out into env? adjust so it's valid
				if(dateDelta > 0)
					this.masterOpen = true;
				else {
					if(!process.globals.privilegedList.includes(body.user_id)) {
						res.send("Hello! Unfortunately, I cannot accept commands right now, until Everest begins. Everest will open at 5PM PDT on 6/19.")
						return;
					}
				}
			}

			var commandline = body.text;
			var split = commandline.split(' ');
			var accept, reject;
			var promise = new Promise(function(acc, rej) {
				accept = acc;
				reject = rej;
			});
			split.unshift(body)
			split.unshift(reject)
			split.unshift(accept);
			this.callHandler.apply(this, split);

			promise.then(function(result) {
				//success!
				if(typeof result === 'string') {
					result = {text: result };
				}
				res.status(200).json(result);
			}).catch(function(err) {
				console.log(err);
				res.status(200).send("Sorry, I didn't recognize that command! Try `/yeti help` to get a list of commands.");
				return;
			});
			return;
		} else {
			console.log("ERR!! Invalid Signature! possible breach attempt ...");
			res.sendStatus(404);
			return;
		}
		next();
	}
	//incredible code reuse. as above but for handling events ...
	eventParse(req, res, next) {
		//verify token ...
		var body = req.body;
		var raw = req.rawBody.toString();
		var time = req.header("X-Slack-Request-Timestamp");
		if(Math.abs(new Date().getTime()/1000 - time) > 60 * 5) { res.sendStatus(404); return; }
		var sig = "v0:" + time + ":" + raw;
		var fullSig = "v0=" + crypto.createHmac('sha256', this.token).update(sig).digest('hex');
		if(crypto.timingSafeEqual(Buffer.from(fullSig), Buffer.from(req.header("X-Slack-Signature")))) {
			//determine appropriate handler ...

			if(body.type == "url_verification") { //when first verifying your event handler, this is required
				res.send(body.challenge);
				return;
			}
			if(process.env.BRANCH == "master" && !this.masterOpen) {
				res.status(200);
				return;
			}
			var commandline = body.type;
			var accept, reject;
			var promise = new Promise(function(acc, rej) {
				accept = acc;
				reject = rej;
			});
			this.callEvent(accept, reject, body, body.event.type);

			promise.then(function(result) {
				res.status(200).json(result);
			}).catch(function(err) {
				console.log(err);
				res.status(404);
				return;
			});
			return;
		} else {
			console.log("ERR!! Invalid Signature! possible breach attempt ...");
			res.sendStatus(404);
			return;
		}
		next();
	}

	//generate the team info card styling
	generateTeamCard(team) {
		//get member list
		var membersList = "";
		var numMembers = team.members.length;
		for(var i = 0; i < numMembers; i++) {
			membersList += "<@"+team.members[i]+">";
			if(numMembers - 1 != i)
				membersList += ", ";
		}
		var lfg = (team.lfg) ? "Enabled" : "Disabled";
		var dropin = (team.dropin) ? "Enabled" : "Disabled";
		var devpost = "<"+team.devpost+"|Link>";
		if(!team.devpost || team.devpost.trim().length == 0)
			devpost = "Not yet submitted";
		var data = {
			"blocks": [
				{
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": "*"+team.title+"* - "+team.description
					}
				},
				{
					"type": "section",
					"fields": [
						{
							"type": "mrkdwn",
							"text": "*Technologies:*\n"+team.tech
						},
						{
							"type": "mrkdwn",
							"text": "*Looking-for-Group*:\n"+lfg
						},
						{
							"type": "mrkdwn",
							"text": "*Staff Drop-in*:\n"+dropin
		                },
						{
							"type": "mrkdwn",
							"text": "*Devpost*\n"+devpost
		                }
					]
				},
				{
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": "*Members*: "+membersList+" ("+numMembers+"/4)"
					}
				}
			]
		}
		return data;

	}
}
module.exports = SlackBot;
