/*jslint node: true */
/*jslint todo: true */


var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var utils = require('../../utils/');


function Scan() {

	var defaultOptions = {

		format: "tiff",
		fileName: new Date().getTime(),
		fileDir: (utils.getContentDir()),
		device: "",
		getFilePath: function() {
			return this.fileDir + "/" + this.fileName + "." + this.format;
		}
		

	};


	/* buildSaneCommand Function Description
	 * - This method builds a sane(scanimage) command
	 *   based on the options object received as parameter */
	var buildSaneCommand = function(options, callback){
		var command = "";


		command += 'scanimage ';
		//Device
		if (options.device) {
			command += '-d ';
			command += options.device;
		}

		//Format
		if (options.format) {
			command += ' --format=' + options.format;
		}

		//Output
		command += ' > ';
		command += options.fileDir + "/" + options.fileName + '.' + options.format;

		callback(command);
	};

	/*execSaneCommand function description
	 * This function executes the sane(scanimage) command 
	 * and return it's output(if any)
	 */
	var execSaneCommand = function (command, callback) {
		exec(command, {timeout: 100000}, function(err, stdout, stderr) {
			if (stdout) {
				return callback(null, stdout);
			} else if(stderr){
				return callback(stderr);
			} else if(err) {
				return callback(err);
			} else {
				callback();
			}
		});


	};

	/* Method: parseScannersList 
	 * Description: 
	 	Parses the string that comes from the
		scanimage's list's output to an array of obj-
		ects containing the data about avaiable scanners

		Behavior:
			It splits the string by || to get an array of
			strings containing single scanner's data
			then splits each element from this array by |
			to get individual scanner data.
			then organizes everything into an object array,
			wich is returned, 
			with each object representing a scanner info.
	 * */
	var parseScannersString = function (scannersStr, callback) {
		var scannerObjArr = [];
		console.log(scannersStr);


		var scannersStrArr = scannersStr.split('||');
		for (var i in scannersStrArr) {
			var scannerStrArr = scannersStrArr[i].split('|');
			var scannerObj = {};

			scannerObj.device = scannerStrArr[0];
			scannerObj.type = scannerStrArr[1];
			scannerObj.pId = scannerStrArr[2];
			scannerObj.manufacturer = scannerStrArr[3];

			//Discards parses that comes with no device
			if (scannerObj.device) {

				scannerObjArr.push(scannerObj);
			}

		}

		callback(scannerObjArr);
	};

	/* Method: listScanners
	 * Description: Return a list of objects containing
	 * data about avaiable scanners
	 *
	 * Behavior: It executes the scanimage -f command, then
	 * parses it's results to a list of objects, thel executes
	 * the callback
	 * 	
	 * */

	this.listScanners = function(callback) {
		execSaneCommand('scanimage -f "||%d|%t|%m|%v|"', function (err, scannersStr, stderr) {
			parseScannersString(scannersStr, function (err, scannersObjList) {
				if (err) {
					callback(err);
				} else {
					callback(null, scannersStr);
				}
			});
		});

	};

	this.process = function (options, callback) {

		//Parse parameters
		if (typeof options === 'function' || !options) {
			callback = options;
			options = defaultOptions;
		}


		options = utils.resolveOptions(options, defaultOptions);

		//Make sure the path is created	
		utils.mkpath(path.resolve(options.fileDir), function(err) {

			console.log("Building sane command");
			buildSaneCommand(options, function (command) { 
				console.log("Executing sane command: " + command);
				console.log("...");
				execSaneCommand(command, function() {
					callback(options.getFilePath());

				});

			});
		});




	};
}


module.exports = new Scan();
