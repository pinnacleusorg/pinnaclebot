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
		//register handlers ...
		var normalizedPath = require("path").join(__dirname, "fn");
		fs.readdirSync(normalizedPath).forEach(function(file) {
  			var thisFn = require("./fn/" + file);
 			//register
			thisMap.addHandler(file.split('.')[0], thisFn);
		});
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

	addHandler(fn, method) {
		this.handlers[fn] = method;
	}
	addEvent(fn, method) {
		this.eventHandlers[fn] = method;
	}
	//when he realizes that he needs to handle another endpoint and adds some incredibly DRY code
	async callHandler(pr_acc, pr_rej, body, fn, ...param) {
		param.unshift(body);
		fn = fn.toLowerCase();
		if(fn in this.handlers) {
			if(this.handlers[fn].constructor.name == "AsyncFunction") {
				console.log("Calling async ...!");
				pr_acc(await this.handlers[fn].apply(this, param));
			} else
				pr_acc(this.handlers[fn].apply(this, param));
		} else {
			pr_rej("no handler registered");
		}
	}

	callEvent(pr_acc, pr_rej, body, fn) {
		fn = fn.toLowerCase();
		if(fn in this.eventHandlers) {
			pr_acc(this.eventHandlers[fn].apply(this, [body]));
		} else {
			pr_rej("no event handler registered");
		}
	}

	callMethod(methodName, parameters, resolve = "") {
		//make a query with the Slack API ...
		console.log("Calling "+methodName+" with parameters", parameters);
		var sudoCmds = ['chat.delete'];
		var token = this.oauth;
		if(sudoCmds.includes(methodName)) {
			token = this.oauth_admin;
		}
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
				res.status(200).json(result);
			}).catch(function(err) {
				console.log(err);
				res.status(200).send("Sorry, I didn't recognize that command! Try `/p help` to get a list of commands.");
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

			var commandline = body.type;
			var accept, reject;
			var promise = new Promise(function(acc, rej) {
				accept = acc;
				reject = rej;
			});
			// this.callEvent.apply(this, [accept, reject, body, commandline]);

			this.callEvent(accept, reject, body, commandline);

			promise.then(function(result) {
				//success!
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

}
module.exports = SlackBot;
