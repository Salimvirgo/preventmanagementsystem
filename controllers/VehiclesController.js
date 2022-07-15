"use strict";
const { dbObject } = require("../db/db");
const { validationResult } = require("express-validator");

const isAdmin = 1;
let adminName = "";
let depts,
  vehicles = [];

exports.GetVehicles = async (req, res, next) => {
  try {
    depts = await dbObject.GetAllDepartments();
    vehicles = await dbObject.GetAllVehicles();
    adminName = typeof req.user != undefined ? req.user.fullname : "";
    return res.render("admin/vehicles", {
      isAdmin,
      pageTitle: "Vehicles",
      adminName,
      depts,
      vehicles,
    });
  } catch (error) {}
};

exports.AddNewVehicle = async (req, res, next) => {
  try {
    const { model, vehicleRegNumber, department } = req.body;

    const newVehicle = {
      model,
      vehicleRegNumber,
      isAvailable: true,
      department,
      addedBy: req.user.userId,
    };
    const VehicleExist = await dbObject.GetVehicleByRegNumber(vehicleRegNumber);

    if (VehicleExist.length) {
      return res
        .status(201)
        .json({ error: "A Vehicle with Registration Number Exists" });
    }

    const CreatedVehicle = await dbObject.CreateNewVehicle(newVehicle);
    await dbObject.InsertIntoSysLog(
      req.user.userId,
      `Created a new vehicle with ID: ${CreatedVehicle.insertId}`
    );
    return res.status(201).json({ success: "Vehicle saved successfully" });
  } catch (error) {
    next(error);
  }
};

exports.UpdateVehicleAvailability = async (req, res, next) => {
  const { vehicleId } = req.params;

  try {
    await dbObject.UpdateVehicleAvailability(true, vehicleId);

    return res
      .status(200)
      .json({ success: "Vehicle Successfully made available" });
  } catch (error) {
    console.log(error);
  }
};

//6. Delete Vehicles
exports.DeleteVehicleById = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    //check if vehicle exists
    const vehicle = await dbObject.GetVehicleByID(vehicleId);

    if (Object.keys(vehicle).length) {
      console.log("exists");
      //delete the vehicle
      await dbObject.DeleteVehicleById(vehicleId).catch((err) => {
        throw err;
      });
      await dbObject.InsertIntoSysLog(
        req.user.userId,
        `Deleted Vehicle with ID: ${vehicleId}`
      );
      return res.status(200).json({ success: "Vehicle Deleted Successfully" });
    }

    return res.status(404).json({ error: "Vehicle not found" });
  } catch (err) {
    console.log(err);
  }
};
