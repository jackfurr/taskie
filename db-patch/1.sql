--
-- Schema version table
--
DROP TABLE IF EXISTS `schema_version`;
CREATE TABLE `schema_version` (
  `patch_level` int NOT NULL
) ENGINE=INNODB;

--
-- set initital schema version so tat patch-0001.sql will execute next
--
INSERT INTO `schema_version` (`patch_level`) VALUES(0);