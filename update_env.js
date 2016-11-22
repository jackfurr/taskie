var fs = require('fs');

module.exports = function(default_path, envPath) {
	var module = {};
	var env_default;
	var example_path = default_path;
	var env = [];
	var env_path = envPath;

	function recursive_obj(obj1, obj2, head) {
		for (var prop in obj1) {
			if (obj1.hasOwnProperty(prop)) {
				isObject = typeof obj1[prop];
				if (isObject == 'object') {
					head = prop;
					recursive_obj(obj1[prop], obj2[prop], head);
				} else {
					if (obj2.hasOwnProperty(prop)) {
						obj2[prop] = obj1[prop];
					}
				}
			}
		}
	}

	module.update_config = function(callback) {
		fs.readFile(example_path, 'utf8', function(err, data) {
			if (err) {
				console.log(example_path + " : file doesn't exists");
				throw err;
			} else {
				env_default = JSON.parse(data);
				fs.readFile(env_path, 'utf8', function(err, data) {
					if (err) {
						env = env_default;
					} else {
						env = JSON.parse(data);
						recursive_obj(env, env_default, '');
						global.envConfig = env_default;
						return callback(null, env_default);
					}
				});
			}
		});
	};

	return module;
};