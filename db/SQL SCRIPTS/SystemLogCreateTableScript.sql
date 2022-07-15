
create table sys_log(
	logid int not null auto_increment,
    userId int not null,
    detail varchar(200) not null,
    log_time datetime not null default current_timestamp,
    constraint PK_LogId primary key (logid),
    constraint FK_User_Log foreign key(userId) references users(userId)
);
-- select fullname,detail, log_time from users inner join sys_log on users.userId = sys_log.userId

