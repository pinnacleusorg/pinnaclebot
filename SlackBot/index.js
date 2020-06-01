const fs = require('fs');
const crypto = require('crypto');
const autoBind = require('auto-bind');
"use strict";
class SlackBot {
	constructor(token) {
		var thisMap = this;
		this.token = token;
		//register handlers ...
		var normalizedPath = require("path").join(__dirname, "fn");
		fs.readdirSync(normalizedPath).forEach(function(file) {
  			var thisFn = require("./fn/" + file);
 			//register
			thisMap.addHandler(file.split('.')[0], thisFn);
		});
		autoBind(this);
	}

	handlers = {};

	addHandler(fn, method) {
		this.handlers[fn] = method;
	}

	callHandler(pr_acc, pr_rej, body, fn, ...param) {
		param.unshift(body);
		fn = fn.toLowerCase();
		if(fn in this.handlers) {
			pr_acc(this.handlers[fn].apply(this, param));
		} else {
			pr_rej("no handler registered");
		}
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
}
module.exports = SlackBot;
