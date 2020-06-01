const autoBind = require('auto-bind');
const crypto = require('crypto');
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
		console.log(body);
		var fullSig = "sha1=" + crypto.createHmac('sha1', this.token).update(sig).digest('hex');
		if(crypto.timingSafeEqual(Buffer.from(fullSig), Buffer.from(req.header("X-Hub-Signature")))) {
			console.log("secret ok!");
			var branch = body.ref.replace('refs/heads/', '');
			if(branch == process.env.BRANCH) {
				//update!!
				console.log("got new update! should fetch");
			} else {
				console.log("update not for this branch -- ignoring ...")
			}
			req.send("OK");
			return;
		}
		next();
	}
}
module.exports = GithubCI;
