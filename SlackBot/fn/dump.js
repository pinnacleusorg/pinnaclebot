//this debug tool, /dump, will log our entire database.
module.exports = function(body, ...param) {
	console.log(body); //TODO: should be gated on priviledge.
	console.log(JSON.stringify(process.globals));
	return "... done!";
};
