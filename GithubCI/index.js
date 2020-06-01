const autoBind = require('auto-bind');
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
		var secret = body.payload.hook.config.secret;
		console.log(body);
		if(secret == this.secret) {
			console.log("secret ok!");
			req.send("OK");
			return;
		}
		next();
	}
}
module.exports = GithubCI;
