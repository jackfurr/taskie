--
-- Create the supporting tables and insert some data.
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_sha` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  KEY `user_id` (`user_id`),
  UNIQUE KEY `unique:user:email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO user (user_id, email, password_sha, created_at, updated_at) VALUES('1', 'jackfurr@yahoo.com', 'password', NOW(), NOW());


DROP TABLE IF EXISTS `action`;
CREATE TABLE `action` (
  `action_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  KEY `action_id` (`action_id`),
  UNIQUE KEY `unique:action:name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO action (action_id, name, created_at) VALUES('1', 'Next', NOW());
INSERT INTO action (action_id, name, created_at) VALUES('2', 'Waiting', NOW());
INSERT INTO action (action_id, name, created_at) VALUES('3', 'Future', NOW());
INSERT INTO action (action_id, name, created_at) VALUES('4', 'Done', NOW());


DROP TABLE IF EXISTS `context`;
CREATE TABLE `context` (
  `context_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `notes` TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  KEY `context_id` (`context_id`),
  UNIQUE KEY `unique:context:name:user_id` (`name`,`user_id`),
  CONSTRAINT `fk:context:_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO context (context_id, user_id, name, created_at, updated_at) VALUES('1', '1', 'Call', NOW(), NOW());
INSERT INTO context (context_id, user_id, name, created_at, updated_at) VALUES('2', '1', 'Email', NOW(), NOW());
INSERT INTO context (context_id, user_id, name, created_at, updated_at) VALUES('3', '1', 'Errand', NOW(), NOW());
INSERT INTO context (context_id, user_id, name, created_at, updated_at) VALUES('4', '1', 'Weekend', NOW(), NOW());


DROP TABLE IF EXISTS `realm`;
CREATE TABLE `realm` (
  `realm_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  KEY `realm_id` (`realm_id`),
  UNIQUE KEY `unique:realm:name:user_id` (`name`,`user_id`),
  CONSTRAINT `fk:realm:user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO realm (realm_id, user_id, name, created_at, updated_at) VALUES('1', '1', 'Home', NOW(), NOW());
INSERT INTO realm (realm_id, user_id, name, created_at, updated_at) VALUES('2', '1', 'Work', NOW(), NOW());


DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `project_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realm_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sub_project_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  KEY `project_id` (`project_id`),
  UNIQUE KEY `unique:project:name:user_id` (`name`,`user_id`),
  CONSTRAINT `fk:project:user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:project:realm_id` FOREIGN KEY (`realm_id`) REFERENCES `realm` (`realm_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO project (project_id, user_id, name, realm_id, created_at, updated_at) VALUES('1', '1', 'Sell Furniture', '1', NOW(), NOW());


DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `task_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realm_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `action_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `depends_on_task_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  KEY `task_id` (`task_id`),
  CONSTRAINT `fk:task:user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:task:realm_id` FOREIGN KEY (`realm_id`) REFERENCES `realm` (`realm_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:task:action_id` FOREIGN KEY (`action_id`) REFERENCES `action` (`action_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk:task:project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO task (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('1', '1', 'Couch', '1', '1','1', NOW(), NOW());
INSERT INTO task (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('2', '1', 'Glass coffee table', '1', '1', '1', NOW(), NOW());
INSERT INTO task (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('3', '1', 'Wooden coffee table', '1', '1', '1', NOW(), NOW());
INSERT INTO task (task_id, user_id, name, realm_id, project_id, action_id, created_at, updated_at) VALUES('4', '1', 'Nick-nack stand in master', '1', '1', '1', NOW(), NOW());

