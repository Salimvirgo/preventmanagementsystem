CREATE TABLE `vehiclerequest`.`departments` (
  `deptId` INT NOT NULL AUTO_INCREMENT,
  `deptname` VARCHAR(50) NOT NULL,
  `datecreated` TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  CONSTRAINT PK_DepartmentID PRIMARY KEY (`deptId`),
  UNIQUE INDEX `deptname_UNIQUE` (`deptname` ASC)
  );
