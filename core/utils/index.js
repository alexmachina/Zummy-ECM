var fs = require('fs');
var path = require('path');


//TODO:: Move method to Utils lib
function Utils() {

     this.mkpath = function mkpath(dirpath, mode, callback) {
        dirpath = path.resolve(dirpath);

        if (typeof mode === 'function' || typeof mode === 'undefined') {
            callback = mode;
            mode = 0777 & (~process.umask());
        }

        if (!callback) {
            callback = function () {};
        }

        fs.stat(dirpath, function (err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    mkpath(path.dirname(dirpath), mode, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            fs.mkdir(dirpath, mode, function (err) {
                                if (!err || err.code == 'EEXIST') {
                                    callback(null);
                                } else {
                                    callback(err);
                                }
                            });
                        }
                    });
                } else {
                    callback(err);
                }
            } else if (stats.isDirectory()) {
                callback(null);
            } else {
                callback(new Error(dirpath + ' exists and is not a directory'));
            }
        });
    };
    //:: Move method to an Utils lib
    this.getAppDir = function () {
        return path.dirname(require.main.filename);
    };

    //TODO:: Make method read from a config file
    this.getContentDir = function () {
        return path.join(this.getAppDir(), "content", "images");
    };

	/*               Function Description                    */
	/* - This method takes two objects as parameters.       *
	 * - It merges the objects in a third one, and return it*
	 * - In a case of same property with same value, it uses* 
	 * the value of the first parametr object.              */

	this.resolveObjects= function(options1, options2) {
		var options3 = {};
		for(var attr1 in options1){
			for(var attr2 in options2){
				if(attr1 === attr2) {
					options3[attr1] = options1[attr1];
				}

				if(!options3[attr2]) { 
					options3[attr2] = options2[attr2];
				}
			}

			if(!options3[attr1]) {
				options3[attr1] = options1[attr1];
			}


		}

		return options3;


	};
}

module.exports = new Utils();
