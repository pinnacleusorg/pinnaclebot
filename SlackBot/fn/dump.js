module.exports = function(body, ...param) {
	console.log(body);
	//dumps body to console
	console.log(JSON.stringify(process.globals));
	return "... done!";
};
