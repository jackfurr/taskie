"use strict";
var UserDBModel = require('./user_model');

///////////////////////////////////////// TESTING CODE /////////////////////////////////
var mysql = require('mysql');
var config = {
	"host": "localhost",
	"user": "root",
	"password": "root",
	"database": "taskie"
}
var pool = mysql.createPool(config);
pool.getConnection(function(err, connection) {
	if (err) {
		process.exit(-1);
	}

	var uuid = require('uuid');
	var user_id = uuid.v4().toString();
	var User = new UserDBModel(connection, {user_id: user_id, email: uuid.v4().toString()+'@foo.com', password_sha: 'asdasdasd'});


	User.insert(function(err, result, details) {
		if (err) {
			console.log(err);
		} else {
			console.log('user inserted');
			//var User2 = new UserDBModel(connection);
			User.updateByPrimaryKey({password_sha: 'updated password_sha'}, user_id, function(err, row) {
				if (err) {
					console.log(err);
				} else {
					console.log('user updated');
				}

				process.exit(0);

			});
		}
	});

});


// 	var User2 = new UserModelDB(pool);
// 	User2.findByPrimaryKey(user_id, function(err, row) {
// 		if (err) {
// 			console.log(err);
// 		} else {

// 			var User3 = new UserModelDB(pool);
// 			User3.updateByPrimaryKey({password_sha: 'updated password_sha'}, user_id, function(err, row) {
// 				if (err) {
// 					console.log(err);
// 				} else {
// 					console.log('user updated');
// 				}
// 			});

// 		}
// 	});


	// }
// });

