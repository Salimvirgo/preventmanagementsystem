CREATE TABLE `vehiclerequest`.`users` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `department` INT NOT NULL,
  `userLevel` INT NOT NULL,
  `datecreated` TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  CONSTRAINT PK_UserID PRIMARY KEY (`userId`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  CONSTRAINT FK_DepartmentID FOREIGN KEY (department) references `vehiclerequest`.`departments`(deptId),
  CONSTRAINT FK_UserLevelID FOREIGN KEY (userLevel) references `vehiclerequest`.`userLevels`(levelId)
  );
