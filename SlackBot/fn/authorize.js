module.exports = function(body, ...param) {
	operation = param[0];
	userid = param[1];
	if(operation == 'add') {
		process.globals.privilegedList.push(userid);
		return "Added "+userid;
	} else if(operation == 'remove') {
		process.globals.privilegedList.pop(userid);
		return "Removed "+userid;
	}
};
