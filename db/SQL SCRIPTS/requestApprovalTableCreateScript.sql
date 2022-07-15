CREATE TABLE `vehiclerequest`.`approvedRequests` (
  `approvalId` INT NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `vehicleAssigned` int not null,
  `approvedBy` int not null,
  `approvedDate` datetime not null default current_timestamp,
  CONSTRAINT PK_ApprovalID PRIMARY KEY (`approvalId`),
  CONSTRAINT FK_Approval_RequestID foreign key(requestId) references vehicleRequests(requestId) on delete cascade on update cascade,
  CONSTRAINT FK_Approval_VehcileID FOREIGN KEY (vehicleAssigned) references vehicles(vehicleId) on delete cascade on update cascade,
  CONSTRAINT FK_Approval_UserId FOREIGN KEY (approvedBy) references `vehiclerequest`.`users`(userId) on delete cascade on update cascade
  );
  
select * from approvedRequests


