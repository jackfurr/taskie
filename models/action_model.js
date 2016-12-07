"use strict";
var BaseDBModel = require('./db_model');

/*
CREATE TABLE `actions` (
  `action_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique:actions:name` (`name`),
  KEY `action_id` (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

+------------+--------------+------+-----+-------------------+-------+
| Field      | Type         | Null | Key | Default           | Extra |
+------------+--------------+------+-----+-------------------+-------+
| action_id  | varchar(36)  | NO   | MUL | NULL              |       |
| name       | varchar(255) | NO   | PRI | NULL              |       |
| created_at | timestamp    | NO   |     | CURRENT_TIMESTAMP |       |
+------------+--------------+------+-----+-------------------+-------+
*/
module.exports = function ActionDBModel(connection, data) {

	// Call the parent constructor, making sure (using call)
	// that "this" is set correctly during the call
	BaseDBModel.call(this, connection, 'actions', 'action_id', data);

	// Create a ActionDBModel.prototype object that inherits from BaseDBModel.prototype.
	// Note: A common error here is to use "new BaseDBModel()" to create the
	// ActionDBModel.prototype. That's incorrect for several reasons, The correct
	// place to call BaseDBModel is above, where we call it from ActionDBModel.
	this.prototype = Object.create(BaseDBModel.prototype); // See note below

	// Set the "constructor" property to refer to ActionDBModel
	this.prototype.constructor = ActionDBModel;
};

