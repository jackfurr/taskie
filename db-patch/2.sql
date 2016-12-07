--
-- Create the supporting tables and insert some data.
--
-- REQUIRES MySQL 5.6.5
--
-- Changes in MySQL 5.6.5:
-- Previously, at most one TIMESTAMP column per table could be automatically
-- initialized or updated to the current date and time. This restriction has been
-- lifted. Any TIMESTAMP column definition can have any combination of
-- DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP clauses. In addition,
-- these clauses now can be used with DATETIME column definitions. For more information,
-- see Automatic Initialization and Updating for TIMESTAMP and DATETIME.

DROP TABLE IF EXISTS `users`;
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

INSERT INTO users (user_id, email, password_sha, created_at, updated_at) VALUES('2b62af43-cdc6-47a5-aeb9-d940779b744e', 'asd@asd.com', 'password', NOW(), NOW());


DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `action_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `action_id` (`action_id`),
  UNIQUE KEY `unique:actions:name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO actions (action_id, name, created_at) VALUES('1', 'Next', NOW());
INSERT INTO actions (action_id, name, created_at) VALUES('2', 'Waiting', NOW());
INSERT INTO actions (action_id, name, created_at) VALUES('3', 'Future', NOW());
INSERT INTO actions (action_id, name, created_at) VALUES('4', 'Done', NOW());


DROP TABLE IF EXISTS `contexts`;
CREATE TABLE `contexts` (
  `context_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `notes` TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `context_id` (`context_id`),
  UNIQUE KEY `unique:contexts:name:user_id` (`name`,`user_id`),
  CONSTRAINT `fk:contexts:_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO contexts (context_id, user_id, name, created_at, updated_at) VALUES('1', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Call', NOW(), NOW());
INSERT INTO contexts (context_id, user_id, name, created_at, updated_at) VALUES('2', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Email', NOW(), NOW());
INSERT INTO contexts (context_id, user_id, name, created_at, updated_at) VALUES('3', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Errand', NOW(), NOW());
INSERT INTO contexts (context_id, user_id, name, created_at, updated_at) VALUES('4', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Weekend', NOW(), NOW());


DROP TABLE IF EXISTS `realms`;
CREATE TABLE `realms` (
  `realm_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `realm_id` (`realm_id`),
  UNIQUE KEY `unique:realms:name:user_id` (`name`,`user_id`),
  CONSTRAINT `fk:realms:user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO realms (realm_id, user_id, name, created_at, updated_at) VALUES('1', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Home', NOW(), NOW());
INSERT INTO realms (realm_id, user_id, name, created_at, updated_at) VALUES('2', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Work', NOW(), NOW());


DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `project_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realm_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sub_project_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `project_id` (`project_id`),
  UNIQUE KEY `unique:projects:name:user_id` (`name`,`user_id`),
  CONSTRAINT `fk:projects:user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:projects:realm_id` FOREIGN KEY (`realm_id`) REFERENCES `realms` (`realm_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO projects (project_id, user_id, name, realm_id, created_at, updated_at) VALUES('1', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Sell Furniture', '1', NOW(), NOW());


DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `task_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realm_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `action_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `depends_on_task_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `task_id` (`task_id`),
  CONSTRAINT `fk:tasks:user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:tasks:realm_id` FOREIGN KEY (`realm_id`) REFERENCES `realms` (`realm_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:tasks:action_id` FOREIGN KEY (`action_id`) REFERENCES `actions` (`action_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:tasks:project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO tasks (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('1', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Couch', '1', '1','1', NOW(), NOW());
INSERT INTO tasks (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('2', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Glass coffee table', '1', '1', '1', NOW(), NOW());
INSERT INTO tasks (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('3', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Wooden coffee table', '1', '1', '1', NOW(), NOW());
INSERT INTO tasks (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('4', '2b62af43-cdc6-47a5-aeb9-d940779b744e', 'Nick-nack stand in master', '1', '1', '1', NOW(), NOW());

