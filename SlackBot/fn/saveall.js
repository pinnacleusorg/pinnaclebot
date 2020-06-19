const fs = require('fs');
module.exports = function(body, ...param) {
	//save globals to file ...
	if(process.globals.privilegedList.includes(body.user_id)) {
		var data = JSON.stringify(process.globals, null, 2);
		fs.writeFile('globals_'+process.env.BRANCH+'.json', data, (err) => {
			if(err) {
				console.log("Manual save err ", err);
			}
			console.log("Saved ... len:"+data.length);
		});
		return "Saving ...";
	}
	return "Nice try, sucker!";
};
