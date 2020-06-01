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
		var raw = req.rawBody.toString();
		console.log(body);
		console.log(raw);
		next();
	}
}
module.exports = SlackBot;
