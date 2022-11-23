const { request } = require("express");
const mysql = require("mysql2");

let connectionPool = {};
let options = {};
if (process.env.NODE_ENV === "development") {
  options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    connectionLimit: 10,
    port: 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  connectionPool = mysql.createPool(options);
} else {
  options = {
    host: process.env.DB_HOST_PROD,
    user: process.env.DB_USERNAME_PROD,
    password: process.env,
    database: process.env,
    clearExpired: true,
    checkExpirationInterval: 900000,
    createDatabaseTable: true,
    expiration: 86400000,
    endConnectionOnClose: true,
  };
  connectionPool = mysql.createPool(options);
}

const connection = connectionPool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  }
  return connection;
});

connectionPool.on("connection", (connection) => {
  console.log("Database Connected Successfully");

  connection.on("error", (err) => {
    console.log(err);
  });
});
const dbObject = {};

/*
This method gets all users in our database
*/
dbObject.GetAllUsers = () => {
  const sql =
    "SELECT userId,fullname, username,email, levelName, number, deptname FROM users INNER JOIN departments ON users.department = departments.deptId Inner Join userLevels ON users.userLevel = userLevels.levelId order by users.userLevel";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

/*
This method creates new users in our database
*/
dbObject.CreateNewUser = (user) => {
  const { fullname, username, email, number, password, department, userLevel } =
    user;
  const sql =
    "INSERT INTO users (fullname,username,email,number,password,department,userLevel) values (?,?,?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    connectionPool.query(
      sql,
      [fullname, username, email, number, password, department, userLevel],
      (err, result) => {
        if (err) return reject(err);
        console.log(user);
        return resolve(result);
      }
    );
  });
};
// This method is used to get user by ID
dbObject.GetUserById = (id) => {
  const sqlQuery =
    "SELECT userId,fullname,username,email,number,department,userLevel FROM users WHERE userId = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sqlQuery, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to get user by email
dbObject.GetUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `select * from users WHERE email = ?;`;
    connectionPool.query(sql, [email], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to get user by username
dbObject.GetUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = `select * from users WHERE username = ?;`;
    connectionPool.query(sql, [username], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to get user by username or Email
dbObject.GetUserByUsernameOrEmail = (username) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT userId, fullname, username, email,password, userLevel, number deptname FROM users inner join departments on users.department = departments.deptId WHERE username = ? or email = ?;";
    connectionPool.query(sql, [username, username], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};
//This method is used to get users and their departments
dbObject.GetUsersAndDepartments = () => {
  const query =
    "SELECT users.userId, fullname, username, userLevel,deptname, deptId FROM users INNER JOIN departments ON users.department = departments.deptId";

  return new Promise((resolve, reject) => {
    connectionPool.query(query, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to get user by their departmentID
dbObject.GetUserAndDepartmentById = (id) => {
  const query =
    "SELECT userId,fullname, username, email, userLevel,deptname FROM users INNER JOIN departments ON users.department = departments.deptId WHERE userId = ?";

  return new Promise((resolve, reject) => {
    connectionPool.query(query, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};
//This method is used to update a user by ID
dbObject.UpdateUserById = (id, user) => {
  const sql = `UPDATE users SET fullname = ?, username = ?, email = ? ,number = ?, department = ?, userlevel = ? WHERE userId = ?`;
  const { fullname, username, email, number, department, userLevel } = user;
  return new Promise((resolve, reject) => {
    connectionPool.query(
      sql,
      [fullname, username, email, number, department, userLevel, id],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};
//This method is used to delete a user by ID
dbObject.DeleteUserById = (id) => {
  const sqlQuery = "DELETE FROM users WHERE userId = ?";

  return new Promise((resolve, reject) => {
    connectionPool.query(sqlQuery, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};
//END OF USERS

//########
//Feedbacks
//########

//ADDS NEW FEEDBACK TO THE Database
dbObject.addNewFeedback = (newFeedback) => {
  const { userId, feedbackDate, userFeedback } = newFeedback;
  const sql =
    "INSERT INTO feedback (userID, feedbackDate, userFeedback) VALUES (?,?,?);";

  return new Promise((resolve, reject) => {
    connectionPool.query(
      sql,
      [userId, feedbackDate, userFeedback],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};

//GET ALL FEEDBACK FROM DATABASE
dbObject.getAllFeedback = () => {
  const sql =
    "SELECT feedbackId,fullname, deptname, feedbackDate,userFeedback from feedback inner join users ON feedback.userId = users.userId inner join departments ON users.department = departments.deptId order by feedbackDate asc;";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//########
//REQUESTS
//########

//ADDS A NEW REQUEST TO THE DATABASE
dbObject.addNewRequest = (request) => {
  const {
    userId,
    deptId,
    eventDate,
    eventTitle,
    eventType,
    eventVenue,
    numberOfPrint,
    numberOfRadio,
    numberOfTv,
    typeOfMedia,
    eventBudget,
  } = request;

  const sql =
    "INSERT INTO prrequests (userId,deptId, eventDate,eventTitle,eventType,eventvenue,numberOfPrint,numberOfRadio,numberOfTv,mediaType,eventBudget) VALUES (?,?,?,?,?,?,?,?,?,?,?);";

  return new Promise((resolve, reject) => {
    connectionPool.query(
      sql,
      [
        userId,
        deptId,
        eventDate,
        eventTitle,
        eventType,
        eventVenue,
        numberOfMedia,
        numberOfRadio,
        numberOfTv,
        typeOfMedia,
        eventBudget,
      ],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};

//GETS ALL REQUEST FROM THE DATABASE
dbObject.getAllRequests = () => {
  const sql =
    "SELECT requestId, fullname,deptname,eventDate,eventTitle,eventType,eventvenue,numberOfMedia,mediaType,eventBudget,requestStatus,isHODApproved from prrequests inner join users ON prrequests.userId = users.userId inner join departments ON users.department = departments.deptId where isHODApproved = 'Yes' order by requestDate asc;";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//GETS A SINGLE REQUEST BY ID
dbObject.getRequestById = (id) => {
  const sql =
    "SELECT requestId, fullname,deptname, eventDate,eventTitle,eventType,eventvenue,numberOfMedia,mediaType,eventBudget,requestStatus,isHODApproved from prrequests inner join users ON prrequests.userId = users.userId inner join departments ON users.department = departments.deptId where requestId = ?";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//UPDATES A REQUEST STATUS
dbObject.UpdateRequestStatus = (id, status, HODApproval) => {
  const sql =
    "update prrequests set requestStatus = ?, isHODApproved = ? where requestId = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [status, HODApproval, id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//GETS ALL NEW REQUEST
dbObject.getNewRequests = () => {
  const sql =
    "SELECT fullname,deptname, requestDate,eventDate,eventTitle,eventType,eventvenue,numberOfMedia,mediaType,eventBudget,requestStatus, isHODApproved from prrequests inner join users ON prrequests.userId = users.userId inner join departments ON users.department = departments.deptId where date(requestDate) between date(date_sub(curdate(), interval 3 day)) and curdate() and isHODApproved = 'NO';";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//GETS ALL REQUESTS BY DEPT
dbObject.getAllDepartmentalRequests = (department) => {
  const sql =
    "SELECT requestId, fullname,deptname,eventDate,eventTitle,eventType,eventvenue,numberOfMedia,mediaType,eventBudget,requestStatus,isHODApproved from prrequests inner join users ON prrequests.userId = users.userId inner join departments ON users.department = departments.deptId where department = ? order by requestDate asc;";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [department], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetNewRequestsByDept = (department) => {
  const sql =
    "SELECT requestId, fullname,deptname, requestDate,eventDate,eventTitle,eventType,eventvenue,numberOfMedia,mediaType,eventBudget,requestStatus, isHODApproved from prrequests inner join users ON prrequests.userId = users.userId inner join departments ON prrequests.deptId = departments.deptId where department = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [department], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetSingleDepartmentRequestByRequestID = (departmentId, requestId) => {
  const sql =
    "SELECT requestId, fullname,deptname, requestDate,eventDate,eventTitle,eventType,eventvenue,numberOfMediaPersonnel,mediaType,eventBudget,requestStatus, isHODApproved from prrequests inner join users ON prrequests.userId = users.userId inner join departments ON prrequests.deptId = departments.deptId where isHODApproved = 'NO' and department = ? and requestId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [departmentId, requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.AcceptRequest = (requestId, userId) => {
  const sql =
    "INSERT INTO approvedRequests(requestId, approvedBy) values (?,?);";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId, userId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.RejectRequest = (requestId, userId, reason) => {
  const sql =
    "INSERT INTO rejectedRequests(requestId,rejectedBy,reason) values (?,?,?);";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId, userId, reason], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.getRequestorsDetails = (requestId) => {
  const sql = "";
};

dbObject.GetUserRequests = (userId) => {
  const sql =
    "SELECT requestId,requestDate,eventDate,eventTitle,eventType,eventvenue,numberOfPrintPersonnel,numberOfRadioPersonnel,numberOfTvPersonnel,mediaType,funding,eventBudget,requestStatus,isHODApproved from prrequests WHERE userId = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [userId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.getUsersSingleRequest = (requestId) => {
  const sql =
    "select AR.requestId,fullname as 'Requestor',users.email,deptname,date(requestDate), eventDate,eventTitle,eventType,eventvenue,numberOfPrintPersonnel,numberOfRadioPersonnel,numberOfTvPersonnel,mediaType,funding,eventBudget,requestStatus, isHODApproved,regNumber,drivers.driverId,driverName,drivers.phoneNumber,drivers.email from approvedRequests as AR inner join prrequests on AR.requestId = prrequests.requestId inner join vehicles on AR.vehicleAssigned = vehicles.vehicleId inner join users on prrequests.userId = users.userId inner join departments on users.department = departments.deptId inner join drivers on AR.vehicleAssigned = drivGetUsersAndDepartmentsers.vehicleId where AR.requestId = ?";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.deleteRequestByID = (requestId) => {
  const sql = "delete from prrequests where requestId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.deleteRejectedRequestByID = (requestId) => {
  const sql = "delete from rejectedRequests where requestId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.deleteApprovedRequestByID = (requestId) => {
  const sql = "delete from approvedRequests where requestId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.getRejectedRequestByID = (requestId) => {
  const sql = "SELECT *  from rejectedRequests where requestId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.getApprovedRequestByID = (requestId) => {
  const sql =
    "select ar.approvalId, ar.requestId, usr.fullname,number from approvedRequests as ar inner join prrequests as pr on ar.requestId = pr.requestId inner join users usr on pr.userId = usr.userId where ar.requestId = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.updateApprovedRequestVehicle = (requestId, vehicleId) => {
  // const sql =
  //   "UPDATE approvedRequests set vehicleAssigned = ? WHERE requestId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [requestId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.getRequestByDate = (dateOne, dateTwo) => {
  const sql =
    "SELECT requestId,requestDate, fullname,deptname, requestDate,departureDate,departureTime,returnDate,returnTime,tripPurpose,numberOfPassengers,requestStatus, isHODApproved from vehicleRequests inner join users ON vehicleRequests.userId = users.userId inner join departments ON users.department = departments.deptId where requestDate between ? and ? order by requestDate;";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [dateOne, dateTwo], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

/**
 * END OF REQUESTS
 */

//Departments
dbObject.GetAllDepartments = () => {
  const sql = "select * from departments";
  // const sql =
  //   "SELECT deptId,deptname,fullname FROM departments inner join users on departments.hod = users.userId;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

//get department by name
dbObject.GetDepartmentByName = (name) => {
  const sql = "select * from departments WHERE deptname = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [name], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//get department by id
dbObject.GetDepartmentById = (id) => {
  const sql = "select * from departments WHERE deptId = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//get department by hod
dbObject.GetDepartmentByHODId = (id) => {
  const sql = "select * from departments WHERE hod = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//create a new department
dbObject.CreateNewDepartment = (departmentName) => {
  const sql = "INSERT INTO departments (deptname) values (?)";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [departmentName.toLowerCase()], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//assign head of department
dbObject.AssignDepartmentHead = (departmentId, hodId) => {
  const sql = "UPDATE departments SET hod = ? WHERE deptId = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [hodId, departmentId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//get HOD of a particular department
dbObject.getDeptartmentHead = (deptId) => {
  const sql =
    "select fullname,email, deptname from users inner join departments on departments.hod = users.userId where deptId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [deptId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//delete department by ID
dbObject.deleteDepartmentById = (deptId) => {
  const sql = "delete from departments where deptId = ?;";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [deptId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllHODs = (deptId) => {
  const sql =
    "SELECT deptId,userId,deptname,fullname,username FROM departments inner join users on departments.hod = users.userId";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [deptId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};
dbObject.DeleteDepartmentById = (deptId) => {
  const sql = "Delete from departments where deptId = ?;";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [deptId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetDepartmentByID = (deptId) => {
  const sql =
    "SELECT deptId,deptname,fullname FROM departments inner join users on departments.hod = users.userId where deptId = ?;";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [deptId], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.InsertIntoSysLog = (userId, logDetails) => {
  const sql = "INSERT INTO sys_log( userId, detail) VALUES (?, ?);";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [userId, logDetails], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllLevels = () => {
  const sql = "SELECT * FROM userLevels";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//ADMIN USERS

//get all admin users from the database
dbObject.GetAdminUsers = () => {
  const sql = "SELECT admin_username from admin_users";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//save new admin user to the database
dbObject.CreateNewAdminUser = (username, password) => {
  const sql = "INSERT INTO amdin_users(username,password) VALUES (?,?)";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [username, password], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//get single admin users from the database
dbObject.GetAdminUserById = (id) => {
  const sql = "SELECT admin_username from admin_users WHERE admin_id = ?";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//get single admin users by username from the database
dbObject.GetAdminUserByUsername = (username) => {
  const sql = "SELECT admin_id from admin_users WHERE username = ?";

  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//update admin user
dbObject.UpdateAdminUserById = (id, username, password) => {
  let sql = "";
  if (password) {
    sql =
      "UPDATE admin_users SET admin_username = ? and password = ? WHERE admin_id = ?";
    return new Promise((resolve, reject) => {
      connectionPool.query(sql, [username, password, id], (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      });
    });
  } else {
    sql = "UPDATE admin_users SET admin_username = ?  WHERE admin_id = ?";
    return new Promise((resolve, reject) => {
      connectionPool.query(sql, [username, id], (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      });
    });
  }
};

//delete admin user from the database
dbObject.DeleteAdminUserById = (id) => {
  const sql = "DELETE from admin_users WHERE admin_id = ?";
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

module.exports = { dbObject, connection, options };
