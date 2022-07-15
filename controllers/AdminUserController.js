"use strict";
const { dbObject } = require("../db/db");
const bcrypt = require("bcryptjs");
const isAdmin = 1;
let users = [];

//this method is used to get all users from the database and render the users page
exports.GetAllAdminUsers = async (req, res, next) => {
  try {
    users = await dbObject.GetAdminUsers();
    res.render("admin/admin-users", {
      users,
      isAdmin,
      pageTitle: "Admin User's",
      adminName: typeof req.user != "undefined" ? req.user.fullname : "",
    });
  } catch (error) {
    next(error);
  }
};

//get single admin admin user
exports.GetAdminUserByID = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const user = await dbObject.GetAdminUserById(id);

    if (user.length) {
      //admin user exists
      return res.status(200).json({ data: user });
    } else {
      //user not found
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
  } catch (error) {}
};

//create new admin user
exports.CreateNewAdminUser = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    const usernameExist = await dbObject.GetAdminUserByUsername(username);

    //2. check if the username already exists
    if (usernameExist.length > 0) {
      //..username already taken return error to the user
      return res
        .status(201)
        .json({ error: "admin with username already exist" });
    }

    //hash the users password for extra security
    const hashedPass = await bcrypt.hash(password, 10);
    //replace plain password with hashed password before saving to the database
    password = hashedPass;
    //insert users record into the database
    const CreatedUser = await dbObject.CreateNewAdminUser(username, password);

    //TODO log to the database

    //send a success response message back to the client
    res.status(200).json({ success: "Admin user saved successfully" });

    //4. insert into audit log that a new users has been created
    // await dbObject.InsertIntoSysLog(
    //   req.user.userId,
    //   `added a new user with id: ${CreatedUser.insertId}`
    // );

    // //set a successful flash message to display to the user
    // req.flash("success", "New user created Successfully");
    // //redirect the user back to the users page
    // res.redirect("/admin/users");
  } catch (error) {
    return next(error);
  }
};

//4. Update admin user
exports.UpdateAdminUser = async (req, res, next) => {
  try {
    console.log(req.body);
    let { userid, username, password } = req.body;

    const user = await dbObject.GetAdminUserById(userid);

    if (user.length) {
      //update users new values
      const updated = await dbObject.UpdateAdminUserById(
        userid,
        username,
        password
      );

      //TODO log to the database

      //send response to the client
      return res
        .status(200)
        .json({ success: "Admin user updated successfully" });
    } else {
      //..send a 404 error, user not found
    }
  } catch (error) {}
};

//5. Delete User
exports.DeleteAdminUser = async (req, res, next) => {
  try {
    const userid = parseInt(req.params.id);

    const user = await dbObject.GetAdminUserById(userid);

    if (user.length) {
      //user exist, delete from the database
      const DeletedUser = await dbObject.DeleteAdminUserById(userid);

      //TODO log to the database

      return res
        .status(200)
        .json({ success: "Admin user deleted successfully" });
    } else {
      //user not found, send 404 response to the client
      return res.status(404).json({ error: "USER NOT FOUND" });
    }

    // if (isNaN(id)) {
    //   res.redirect("/admin/users");
    //   req.flash("err_msg", "Error deleting user");
    // } else {
    //   await dbObject.InsertIntoSysLog(
    //     req.user.userId,
    //     `Deleted User with ID: ${id}`
    //   );
    //   req.flash("success", "User Deleted Successfully");
    //   res.redirect("/admin/users");
    // }
  } catch (err) {}
};
