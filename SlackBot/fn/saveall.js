module.exports = function(body, ...param) {
	console.log(fs.existsSync('globals_'+process.env.BRANCH+'.json'));
	console.log(fs.existsSync('../globals_'+process.env.BRANCH+'.json'));
	console.log(fs.existsSync('../../globals_'+process.env.BRANCH+'.json'));
	console.log(fs.existsSync('../../../globals_'+process.env.BRANCH+'.json'));
	return "";
};
