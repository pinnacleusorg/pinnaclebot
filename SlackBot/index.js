const fs = require('fs');
"use strict";
class SlackBot {
	token = "";
	constructor(token) {
		this.token = token;
		//register handlers ...
		var normalizedPath = require("path").join(__dirname, "fn");
		fs.readdirSync(normalizedPath).forEach(function(file) {
  			var thisFn = require("./fn/" + file);
			//register
			addHandler(thisFn.fn, thisFn.method);
		});
	}

	handlers = {};
	
	addHandler(fn, method) {
		handlers[fn] = method;
	}
	
	callHandler(fn, ...param) {
		handlers[fn].apply(param);
	}

	parse(req, res, next) {
		console.log(req);
		if(req.originalUrl == '/handle') {
			
		}
		next();
	}
}
module.exports = SlackBot;
