var scan = require('./core/scan/gnu-linux/scanSane');
var exec = require('child_process').exec;

	var displayImage = function(imagePath, callback){
		console.log("Displaying the image");
		var command = "";
		command += 'display ';
		command += imagePath;

		exec(command, function(err, stdout, stderr) {
			callback();
		});
	};
	var options = {
		device: 'epson2:libusb:001:010'
	};

scan.listScanners(function(scanList){
	for (var i in scanList) {
		for (var j in scanList[i]) {
			console.log(j + ":" + scanList[i][j]);
		}
	}
});
/*
	scan.process(options, function(filePath){
		displayImage(filePath, function(){
			return console.log("End");
		});
		
    });
	*/
