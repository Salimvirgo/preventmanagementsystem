CREATE TABLE `vehiclerequest`.`vehicleRequests` (
  `requestId` INT NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `requestDate` datetime not null default current_timestamp,
  `departureDate` varchar(10) not null,
  `departureTime` varchar(10) not null,
  `returnDate` varchar(20) not null,
  `returnTime` varchar(10) not null,
  `tripPurpose` VARCHAR(15) NOT NULL,
  `numberOfPassengers` INT NOT NULL,
  `requestStatus` varchar(20) not null default "PENDING",
  `datecreated` TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  CONSTRAINT PK_REQUESTId PRIMARY KEY (`requestId`),
  CONSTRAINT FK_Request_UserId FOREIGN KEY (userId) references `vehiclerequest`.`users`(userId)
  );





-- run this script--
alter table vehicleRequests modify requestDate datetime default now();

describe vehicleRequests;

--  run this one also --
alter table vehicleRequests drop foreign key FK_Request_UserId;
alter table vehicleRequests add foreign key FK_Request_UserId (userId) references `vehiclerequest`.`users`(userId) on delete cascade on update cascade;

--  run this script
update users set email = "comroland85@gmail.com" where userId=3;


-- run this script 
alter table departments add column hod int;
alter table departments add constraint FK_dept_userId foreign key (hod) references users(userId) on delete cascade on update cascade;

select * from vehicleRequests order by requestDate asc where requestDate = date(now())

-- create table if not exists HOD(
--    hodId int auto_increment,
--    userId int not null,
--    deptId int not null,
--    constraint PK_HodID primary key(hodId),
--    constraint FK_HOD_UserId foreign key(userId) references users(userId) on delete cascade on update cascade,
--    constraint FK_HOD_DeptId foreign key(deptId) references department(deptId) on delete cascade on update cascade
-- );