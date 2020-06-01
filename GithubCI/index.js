const autoBind = require('auto-bind');
const crypto = require('crypto');
const updateProcess = require("./exec_process.js");
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
				updateProcess.result("git pull origin", function(err, response){
				    if(!err) {
				        console.log(response);
				    } else {
				        console.log(err);
				    }
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
