'use strict';
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');

var log = require('../logger.js');
var default_path = '../config/env.default.json'
var env_path = '../config/env.json'
var update_env = require('../update_env.js')(default_path, env_path);
var logger = null;

var extFilter = '.sql';
var currentPatchVer = 0;

update_env.update_config(function(err, config) {
	if (err) {
		throw err
	} else {

		if (!log.startLogger(config.logger)) {
			process.exit(-1);
		}

		logger = log.getLogger();
		logger.debug('updatedb.js started with the following config:');
		logger.debug(config);

		// manually add support for multiple connections since the contents of
		// the patches usually contain more than one query command
		config.database.multipleStatements = true;

		var connection = mysql.createConnection(config.database);
		connection.connect(function(err) {
			if (err) {
				logger.error('error connecting: ' + err.stack);
				process.exit(-1);
			}

			// beginTransaction is probably pointless since most of the migration
			// sql contains statements that cause an implicit commit (create table, alter table...)
			// see: http://dev.mysql.com/doc/refman/5.5/en/implicit-commit.html
			connection.beginTransaction(function(err) {
				if (err) {
					logger.error('error beginTransaction: ' + err.stack);
					return process.exit(-1);
				}

				//logger.debug('connected as id ' + connection.threadId);
				getSchemaVersion(connection, function(err, schemaVersion) {
					if (err) {
						console.log(err);
						process.exit(-1);
					}

					currentPatchVer = schemaVersion;

					getPatchFileArray(function(err, list) {
						if (0 === list.length) {
							console.log('Nothing to do.');
							return process.exit(0);
						}

						let processedList = [];

						for (let i = 0; i < list.length; i++) {
							executePatch(connection, list[i], function(err, result, processedFile) {
								processedList.push(processedFile);

								if (err) {
									return connection.rollback(function() {
										throw err;
									});
								}

								if (processedList.length === list.length) {
									connection.commit(function(err) {
										if (err) {
											return connection.rollback(function() {
												throw err;
											});
										}

										connection.end(function(err) {
											// The connection is terminated now
											process.exit(0);
										});
									});
								} // if

							});

						} // for

					}); //getPatchFileArray

				});
			});
		});
	} // else
});

function getSchemaVersion(connection, callback) {
	connection.query('SELECT patch_level FROM schema_version', '', function(err, result) {
		if (err) {
			return callback((err.code === 'ER_NO_SUCH_TABLE' ? null : err), 0);
		}
		callback(err, (0 === result.length ? 0 : parseInt(result[0].patch_level)));
	});
}

function executePatch(connection, file, callback) {
	console.log('Execute patch: ' + file);
	let data = fs.readFileSync(file, 'utf8');
	let fileSchemaA = path.parse(file);
	let newSchemaVer = parseInt(fileSchemaA.name);

	// execute the contents
	connection.query(data, '', function(err, result) {
		if (err) {
			return callback(err, null);
		} else {
			// now update the schema_version's patch_level
			connection.query('UPDATE schema_version SET patch_level = ?', newSchemaVer, function(err, result) {
				return callback(err, result, file);
			});
		}
	});
}

function getPatchFileArray(callback) {
	const localPath = './';
	const fs = require('fs');
	let list = [];
	let files = fs.readdirSync(localPath);
	let count = 0;

	files = files.filter(isPatchFile);

	if (0 === files.length) {
		return callback(null, list);
	}

	files.forEach(function(file) {
		list.push(file);
		if (++count === files.length) {
			// the list needs to be ordered
			list.sort(compareFunction);
			callback(null, list);
		}
	});
}

function compareFunction(a, b) {
	let fileSchemaA = path.parse(a);
	let fileSchemaB = path.parse(b);
	return (parseInt(fileSchemaA.name) > parseInt(fileSchemaB.name));
}

function isPatchFile(element) {
	let fileSchema = path.parse(element);
	return (fileSchema.ext === extFilter && parseInt(fileSchema.name) > currentPatchVer);
};