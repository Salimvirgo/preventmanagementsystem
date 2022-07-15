use vehiclerequest;

create table `vehiclerequest`.`vehicles`(
	`vehicleId` int not null auto_increment,
    `model` varchar(50) not null,
    `regNumber` varchar(20) not null,
    `departmentId` int,
    `addedBy` int not null,
    `dateAdded` datetime not null default current_timestamp,
    
    constraint PK_VehicleId primary key (`vehicleId`),
    constraint UQ_RegNumber unique (`regNumber`),
    constraint FK_Vehicle_Dept foreign key (`departmentId`) references departments(`deptId`)
)

SELECT * from vehiclerequest.vehicles;

SELECT * FROM vehiclerequest.departments;

SELECT vehicleId, model,regNumber, deptname from vehicles
inner join departments on vehicles.departmentId 
= departments.deptId



