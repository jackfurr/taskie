"use strict";
var BaseDBModel = require('./db_model');

/*
CREATE TABLE `realms` (
  `realm_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique:realms:name:user_id` (`name`,`user_id`),
  KEY `realm_id` (`realm_id`),
  KEY `fk:realms:user_id` (`user_id`),
  CONSTRAINT `fk:realms:user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

+------------+--------------+------+-----+-------------------+-----------------------------+
| Field      | Type         | Null | Key | Default           | Extra                       |
+------------+--------------+------+-----+-------------------+-----------------------------+
| realm_id   | varchar(36)  | NO   | MUL | NULL              |                             |
| user_id    | varchar(36)  | NO   | PRI | NULL              |                             |
| name       | varchar(255) | NO   | PRI | NULL              |                             |
| created_at | timestamp    | NO   |     | CURRENT_TIMESTAMP |                             |
| updated_at | timestamp    | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
+------------+--------------+------+-----+-------------------+-----------------------------+
*/
module.exports = function RealmDBModel(connection, data) {

	// Call the parent constructor, making sure (using call)
	// that "this" is set correctly during the call
	BaseDBModel.call(this, connection, 'realms', 'realm_id', data);

	// Create a RealmDBModel.prototype object that inherits from BaseDBModel.prototype.
	// Note: A common error here is to use "new BaseDBModel()" to create the
	// RealmDBModel.prototype. That's incorrect for several reasons, The correct
	// place to call BaseDBModel is above, where we call it from RealmDBModel.
	this.prototype = Object.create(BaseDBModel.prototype); // See note below

	// Set the "constructor" property to refer to RealmDBModel
	this.prototype.constructor = RealmDBModel;
};

