"use strict";
const { dbObject } = require("../db/db");
const { validationResult } = require("express-validator");
const isAdmin = 1;
let adminName = "";
let drivers,
  vehicles = [];

//get all drivers
exports.GetDrivers = async (req, res, next) => {
  try {
    drivers = await dbObject.GetAllDrivers();
    vehicles = await dbObject.GetAllVehicles();
    adminName = typeof req.user !== undefined ? req.user.fullname : "";

    return res.render("admin/drivers", {
      isAdmin,
      pageTitle: "Drivers",
      vehicles,
      adminName,
      drivers,
    });
  } catch (error) {
    next(error);
  }
};

//get driver by ID
exports.GetDriverByID = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const driver = await dbObject.GetDriverById(id);

    if (driver.length) {
      //driver exists
      console.log(driver);
    } else {
      //driver with given ID does not exist
      return res.status(404).json({ error: "DRIVER NOT FOUND" });
    }
  } catch (error) {
    next(error);
  }
};
//Adds a mew driver
exports.AddNewDriver = async (req, res, next) => {
  try {
    const {
      driverName,
      driverId,
      driverPhone,
      driverEmail,
      vehicleRegNumber,
      driverStatus,
    } = req.body;

    const driver = await dbObject.GetDriverById(driverId);
    if (driver.length) {
      //driver already exist
      return res.status(201).json({ error: "Driver ID already exist" });


    } else {
      //check if the vehicle has already been assigned to another driver
      const vehicleAssigned = await dbObject.GetDriverByVehicleID(
        vehicleRegNumber
      );
      if (vehicleAssigned.length) {
        //..vehicle has already been assigned to another driver
        return res
          .status(201)
          .json({ error: "Vehicle already assigned to another driver" });
        // req.flash("err_msg", "Vehicle Already assigned to a Driver");
        // return res.redirect("/admin/drivers");
      } else {
        //..add new driver to the database
        const CreatedDriver = await dbObject.CreateNewDriver({
          driverName,
          driverId,
          driverPhone,
          driverEmail,
          vehicleRegNumber,
          driverStatus,
          addedBy: req.user.userId,
        });

        await dbObject.InsertIntoSysLog(
          req.user.userId,
          `added a new driver with ID: ${CreatedDriver.insertId}`
        );

        return res.status(200).json({ success: "Driver added successfully" });
      }
    }
  } catch (error) {
    next(error);
  }
};

//Updates a Driver
exports.UpdateDriver = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    console.log(id);

    //TODO check if the driver with the given ID exists in the database

    //TODO update the driver record in the database with the new values

    //TODO remove old driver photo from the public folder and

    //TODO return response to the client
  } catch (error) {}
};

//Delete a driver
exports.DeleteDriver = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    console.log(id);

    //TODO check if the driver with the given ID exists in the database

    //TODO delete the driver if found and return a response to the client
  } catch (error) {}
};
