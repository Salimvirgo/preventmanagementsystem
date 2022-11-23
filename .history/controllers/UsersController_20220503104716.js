"use strict";
const { dbObject } = require("../db/db");
const bcrypt = require("bcryptjs");
const Mailer = require("../Helper/MailHelper");

const isAdmin = 1;
let adminName = "";
let users,
  depts,
  levels = [];

//this method is used to get all users from the database and render the users page
exports.GetAllUser = async (req, res, next) => {
  try {
    users = await dbObject.GetAllUsers();
    depts = await dbObject.GetAllDepartments();
    levels = await dbObject.GetAllLevels();

    res.render("admin/users", {
      users,
      isAdmin,
      pageTitle: "Users",
      users,
      depts,
      levels,
      adminName: typeof req.user != "undefined" ? req.user.fullname : "",
    });
  } catch (error) {
    next(error);
  }
};

//this method is used to get a single user by ID
exports.GetUserByID = async (req, res, next) => {
  const id = parseInt(req.params.id);

  const user = await dbObject.GetUserById(id);

  if (user) {
    return res.status(200).json({ data: user });
  } else {
    return res.status(404).json({ error: "USER NOT FOUND" });
  }
};

//3. Add New Users
exports.AddNewUser = async (req, res, next) => {
  // users = await dbObject.GetUsersAndDepartments();
  // depts = await dbObject.GetAllDepartments();
  // levels = await dbObject.GetAllLevels();
  try {
    let { fullname, username, email, number, department, userLevel, password } =
      req.body;

    const emailExist = await dbObject.GetUserByEmail(email);
    const usernameExist = await dbObject.GetUserByUsername(username);

    //1. check if the email already exist in the database
    if (emailExist.length > 0) {
      //..email already exist send error to the user

      return res.status(210).json({ error: "Email already exist" });
    }

    //2. check if the username already exists
    if (usernameExist.length > 0) {
      //..username already taken return error to the user
      return res.status(210).json({ error: "username already exist" });
    }

    //3. Save the users info. if all validation is passed

    //hash the users password for extra security
    const hashedPass = await bcrypt.hash(password, 10);
    //replace plain password with hashed password before saving to the database
    password = hashedPass;
    //insert users record into the database
    const CreatedUser = {
      fullname,
      username,
      email,
      number,
      department,
      userLevel,
      password,
    };

    await dbObject.CreateNewUser(CreatedUser);

    // console.log(CreatedUser);
    // return;
    //send a success response message back to the client
    res.status(200).json({ success: "User saved successfully" });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

//4. Update User

exports.UpdateUser = async (req, res, next) => {
  try {
    let { fullname, username, email, number, department, userLevel } = req.body;
    const userid = parseInt(req.params.id);
    const user = await dbObject.GetUserById(userid);

    if (user.length) {
      //update users new values
      await dbObject.UpdateUserById(userid, {
        fullname,
        username,
        email,
        number,
        department,
        userLevel,
      });

      //return success response
      return res.status(201).json({ success: "User updated successfully" });
    } else {
      //..send a 404 error, user not found
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
  } catch (error) {
    next(error);
  }
};

//5. Delete User
exports.DeleteUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const user = await dbObject.GetUserById(id);

    if (user.length) {
      const deleted = await dbObject.DeleteUserById(id);

      console.log(deleted);

      return res.status(200).json({ success: "User deleted successfully" });
    } else {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
  } catch (err) {}
};

//6. forget password
exports.ForgetPassword = (req, res, next) => {
  //let Email = req.body.email;
  //const emailExist = await dbObject.GetUserByEmail(email);
  console.log(req.body);
  return;
};
