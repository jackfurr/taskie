"use strict";
var BaseDBModel = require('./db_model');

/*
CREATE TABLE `tasks` (
  `task_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realm_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `action_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `depends_on_task_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `task_id` (`task_id`),
  KEY `fk:tasks:user_id` (`user_id`),
  KEY `fk:tasks:realm_id` (`realm_id`),
  KEY `fk:tasks:action_id` (`action_id`),
  KEY `fk:tasks:project_id` (`project_id`),
  CONSTRAINT `fk:tasks:action_id` FOREIGN KEY (`action_id`) REFERENCES `actions` (`action_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:tasks:project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:tasks:realm_id` FOREIGN KEY (`realm_id`) REFERENCES `realms` (`realm_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:tasks:user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

+--------------------+--------------+------+-----+-------------------+-----------------------------+
| Field              | Type         | Null | Key | Default           | Extra                       |
+--------------------+--------------+------+-----+-------------------+-----------------------------+
| task_id            | varchar(36)  | NO   | MUL | NULL              |                             |
| user_id            | varchar(36)  | NO   | MUL | NULL              |                             |
| name               | varchar(255) | NO   |     | NULL              |                             |
| realm_id           | varchar(36)  | YES  | MUL | NULL              |                             |
| action_id          | varchar(36)  | NO   | MUL | NULL              |                             |
| project_id         | varchar(36)  | YES  | MUL | NULL              |                             |
| depends_on_task_id | varchar(36)  | YES  |     | NULL              |                             |
| created_at         | timestamp    | NO   |     | CURRENT_TIMESTAMP |                             |
| updated_at         | timestamp    | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
+--------------------+--------------+------+-----+-------------------+-----------------------------+
*/
module.exports = function TaskDBModel(connection, data) {

	// Call the parent constructor, making sure (using call)
	// that "this" is set correctly during the call
	BaseDBModel.call(this, connection, 'tasks', 'task_id', data);

	// Create a TaskDBModel.prototype object that inherits from BaseDBModel.prototype.
	// Note: A common error here is to use "new BaseDBModel()" to create the
	// TaskDBModel.prototype. That's incorrect for several reasons, The correct
	// place to call BaseDBModel is above, where we call it from TaskDBModel.
	this.prototype = Object.create(BaseDBModel.prototype); // See note below

	// Set the "constructor" property to refer to TaskDBModel
	this.prototype.constructor = TaskDBModel;
};

