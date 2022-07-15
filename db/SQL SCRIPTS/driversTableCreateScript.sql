create table `vehiclerequest`.`drivers`(
	`id` int not null auto_increment,
    `driverName` varchar(60) not null,
    `driverId` varchar(10) not null,
    `phoneNumber` varchar(20) not null,
    `email` varchar(150), 
   `vehicleId` int not null,
    `imageUrl` varchar(100) not null,
    `addedBy` int not null,
    `dateAdded` datetime not null default current_timestamp,
    constraint PK_ID primary key (`id`),
	constraint FK_Driver_Vehicle foreign key(`vehicleId`) references vehicles(`vehicleId`),
    constraint FK_Driver_AddedBy foreign key (`addedBy`) references users(`userId`)
);
