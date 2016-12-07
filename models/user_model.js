"use strict";
var BaseDBModel = require('./db_model');

/*
CREATE TABLE `users` (
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_sha` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `user_id` (`user_id`),
  UNIQUE KEY `unique:users:user_id` (`user_id`),
  UNIQUE KEY `unique:users:email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

+--------------+--------------+------+-----+-------------------+-----------------------------+
| Field        | Type         | Null | Key | Default           | Extra                       |
+--------------+--------------+------+-----+-------------------+-----------------------------+
| user_id      | varchar(36)  | NO   | PRI | NULL              |                             |
| email        | varchar(255) | NO   | UNI | NULL              |                             |
| password_sha | varchar(255) | NO   |     | NULL              |                             |
| created_at   | timestamp    | NO   |     | CURRENT_TIMESTAMP |                             |
| updated_at   | timestamp    | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
+--------------+--------------+------+-----+-------------------+-----------------------------+
*/
module.exports = function UserDBModel(connection, data) {

	// Call the parent constructor, making sure (using call)
	// that "this" is set correctly during the call
	BaseDBModel.call(this, connection, 'users', 'user_id', data);

	// Create a UserDBModel.prototype object that inherits from BaseDBModel.prototype.
	// Note: A common error here is to use "new BaseDBModel()" to create the
	// UserDBModel.prototype. That's incorrect for several reasons, The correct
	// place to call BaseDBModel is above, where we call it from UserDBModel.
	this.prototype = Object.create(BaseDBModel.prototype); // See note below

	// Set the "constructor" property to refer to UserDBModel
	this.prototype.constructor = UserDBModel;

	// this.validateInsert = function(data, callback) {
	// 	console.log('UserDBModel::validateInsert: ', data);

	// 	callback(null);
	// }
};

