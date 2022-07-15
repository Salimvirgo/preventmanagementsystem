CREATE TABLE `vehiclerequest`.`userLevels` (
  `levelId` INT NOT NULL AUTO_INCREMENT,
  `levelName` VARCHAR(20) NOT NULL,
  `datecreated` TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  CONSTRAINT PK_LevelID PRIMARY KEY (`levelId`)
  );
