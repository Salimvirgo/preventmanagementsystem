CREATE TABLE `vehiclerequest`.`rejectedRequests` (
  `rejectId` INT NOT NULL AUTO_INCREMENT,
  `requestId` int(11) NOT NULL,
  `rejectedBy` int(11) not null,
  `rejectDate` datetime not null default current_timestamp,
  CONSTRAINT PK_RejectID PRIMARY KEY (`rejectId`),
  constraint FK_Reject_RequestID foreign key (requestId) references vehicleRequests(requestId) on delete cascade on update cascade,
  CONSTRAINT FK_Reject_UserId FOREIGN KEY (rejectedBy) references `vehiclerequest`.`users`(userId) on delete cascade on update cascade
  );
  
  



