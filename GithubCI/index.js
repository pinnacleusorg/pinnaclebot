const autoBind = require('auto-bind');
const crypto = require('crypto');
const spawn = require("child_process").spawn;
"use strict";
class GithubCI {
	constructor(secret) {
		var thisMap = this;
		this.secret = secret;
		autoBind(this);
	}

	parse(req, res, next) {
		//verify secret ...
		var body = req.body;
		var sig = req.rawBody.toString();
		body = JSON.parse(body.payload);
		var fullSig = "sha1=" + crypto.createHmac('sha1', this.secret).update(sig).digest('hex');
		if(crypto.timingSafeEqual(Buffer.from(fullSig), Buffer.from(req.header("X-Hub-Signature")))) {
			var branch = body.ref.replace('refs/heads/', '');
			if(branch == process.env.BRANCH) {
				//update!!
				console.log("got new update! should fetch");
				var update = spawn('git', ['pull', 'origin']);
				update.stdout.on('data', function (data) {
					console.log(data);
				});
				update.stderr.on('data', function (data) {
					console.log(data);
				});
				update.on('exit', function (code) {
					console.log(code);
				});
			} else {
				console.log("update not for this branch -- ignoring ...")
			}
			res.send("OK");
			return;
		}
		next();
	}
}
module.exports = GithubCI;
