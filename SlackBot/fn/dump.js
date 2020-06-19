module.exports = function(body, ...param) {
	console.log(body);
	console.log(JSON.stringify(process.globals));
	return "... done!";
};
