const express = require("express");
const router = express.Router();
const path = require("path");
const { dbObject } = require("../db/db");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const moment = require("moment");
const { ensureAuthenticated } = require("../auth/authenticate");
const UserController = require("../controllers/UsersController");
const VehicleController = require("../controllers/VehiclesController");
const DriversController = require("../controllers/DriversController");
const DepartmentsController = require("../controllers/DepartmentsController");
const AdminUserController = require("../controllers/AdminUserController");
const RequestController = require("../controllers/RequestsController");
const MailHelper = require("../Helper/MailHelper");
const FeedbackController = require("../controllers/FeedbackController");
const {
  saveUserValidationRules,
  updateUserValidationRules,
  saveVehcileValidationRules,
  saveDepartmentValidationRules,
  assignHeadOfDepartmentValidationRules,
  validate,
  saveDriverValidationRules,
} = require("../validations/validation");

const isAdmin = 1;
let adminName = "";
let depts,
  levels,
  allRequests,
  allFeedbacks,
  allDepartmentalRequests,
  vehicles,
  availableVehicles,
  newRequests,
  drivers,
  users = [];

router.use(async (req, res, next) => {
  adminName = typeof req.user != "undefined" ? req.user.fullname : "";
  depts = await dbObject.GetAllDepartments();
  levels = await dbObject.GetAllLevels();
  users = await dbObject.GetUsersAndDepartments();
  allRequests = await dbObject.getAllRequests();
  allDepartmentalRequests = await dbObject.getAllDepartmentalRequests();
  allFeedbacks = await dbObject.getAllFeedback();
  newRequests = await dbObject.getNewRequests();
  allDepartmentalRequests = allDepartmentalRequests.map((request) => {
    return {
      requestId: requests.requestId,
      fullname: request.fullname,
      deptname: request.deptname,
      requestDate: moment(request.requestDate).format("DD/MM/YYYY"),
      requestTime: moment(request.requestDate).format("HH:mm A"),
      eventTitle: request.eventTitle,
      eventDate: request.eventDate,
      eventType: request.eventType,
      eventVenue: request.eventvenue,
      mediaType: request.mediaType,
      eventBudget: request.eventBudget,
      numberOfMedia: request.numberOfMediaPersonnel,
      requestStatus: request.requestStatus,
    };
  });
  allRequests = allRequests.map((request) => {
    return {
      requestId: request.requestId,
      fullname: request.fullname,
      deptname: request.deptname,
      requestDate: moment(request.requestDate).format("DD/MM/YYYY"),
      requestTime: moment(request.requestDate).format("HH:mm A"),
      eventTitle: request.eventTitle,
      eventDate: request.eventDate,
      eventType: request.eventType,
      eventVenue: request.eventvenue,
      mediaType: request.mediaType,
      eventBudget: request.eventBudget,
      numberOfPrint: request.numberOfPrint,
      numberOfRadio: request.numberOfRadio,
      numberOfT: request.numberOfT,
      requestStatus: request.requestStatus,
    };
  });
  allFeedbacks = allFeedbacks.map((feedback) => {
    return {
      feedbackId: feedback.feedbackId,
      fullname: feedback.fullname,
      deptname: feedback.deptname,
      feedbackDate: moment(feedback.feedbackDate).format("DD/MM/YYYY"),
      feedbackTime: moment(feedback.feedbackDate).format("HH:mm A"),
      userFeedback: feedback.userFeedback,
    };
  });
  next();
});


router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  try {
    res.render("admin/admin-dashboard", {
      isAdmin,
      requests: allRequests,
      pageTitle: "Dashboard",
      adminName,
      numberOfUser: users.length,
      numberOfReq: allRequests.length,
      numberOfDepartment: depts.length,
      numberOfFeedback: allFeedbacks.length,
    });
    // if (req.user.userLevel == 1) {

    //   return;
    // } else {
    //   res.redirect("/post-request");
    // }
  } catch (error) {
    next(error);
  }
});

router.get("/emergency-request", ensureAuthenticated, (req, res) => {
  res.render("admin/emergency-request", {
    isAdmin,
    pageTitle: "Emergency Requests",
    adminName,
  });
});

//route for getting all users
router.get("/users", ensureAuthenticated, UserController.GetAllUser);

//get user by ID
router.get("/users/:id", ensureAuthenticated, UserController.GetUserByID);

//add new user
router.post(
  "/users",
  ensureAuthenticated,
  saveUserValidationRules(),
  validate,
  UserController.AddNewUser
);

//delete user by ID
router.delete("/users/:id", ensureAuthenticated, UserController.DeleteUserById);

//update user by ID
router.put(
  "/users/:id",
  ensureAuthenticated,
  updateUserValidationRules(),
  validate,
  UserController.UpdateUser
);

//get all drivers
router.get("/drivers", DriversController.GetDrivers);

//save new driver
router.post(
  "/drivers",
  saveDriverValidationRules(),
  validate,
  DriversController.AddNewDriver
);

//get driver by ID
router.get("/driver/:id", DriversController.GetDriverByID);

//update driver by ID
router.put(
  "/driver/:id",
  saveDepartmentValidationRules(),
  validate,
  DriversController.UpdateDriver
);

//delete driver by ID
router.delete("/driver/:id", DriversController.DeleteDriver);

//get all departments
router.get("/departments", DepartmentsController.GetAllDepartments);

//get single department
router.get("/departments/:id", DepartmentsController.GetDepartmentById);
//save department
router.post(
  "/departments",
  saveDepartmentValidationRules(),
  validate,
  DepartmentsController.AddNewDepartment
);

//update department
router.put("/departments/:id", DepartmentsController.UpdateDepartmentById);

//delete a department by ID
router.delete("/departments/:id", DepartmentsController.DeleteDepartmentById);

//assign head of department
router.post(
  "/assign-hod",
  assignHeadOfDepartmentValidationRules(),
  validate,
  DepartmentsController.AssignHeadOfDepartment
);

//route for getting all Vehicles
// router.get("/vehicles", VehicleController.GetVehicles);

//route for getting all new requests
router.get("/new-vehicle-request", (req, res, next) => {
  (async () => {
    try {
      res.render("admin/new-vehicle-request", {
        isAdmin,
        requests: newRequests,
        pageTitle: "New Vehicle Requests",
        adminName,
      });
    } catch (error) {
      next(error);
    }
  })();
});

//Viewing a single request
router.get("/request-single/:id", async (req, res) => {
  const id = req.params.id;
  // const request = await dbObject.getRequestById(id);
  const request = await dbObject.GetSingleDepartmentRequestByRequestIDHodApproved(id);
  const r = request.map((request) => {
    return {
      requestId: request.requestId,
      fullname: request.fullname,
      deptname: request.deptname,
      requestDate: moment(request.requestDate).format("DD-MMMM-YYYY"),
      requestTime: moment(request.requestDate).format("HH:mm A"),
      eventTitle: request.eventTitle,
      eventDate: request.eventDate,
      eventType: request.eventType,
      eventVenue: request.eventvenue,
      mediaType: request.mediaType,
      eventBudget: request.eventBudget,
      numberOfMedia: request.numberOfMediaPersonnel,
      requestStatus: request.requestStatus,
    };
  })[0];
  res.render("admin/request-single", {
    isAdmin,
    adminName,
    pageTitle: "Single Request View",
    r,
    availableVehicles,
  });
});

//route for acceting a request
router.post("/accept/request", RequestController.ApproveRequest);

router.get("/test", RequestController.Test);

//route for rejecting a request
router.post("/reject/request/:requestId", async (req, res, next) => {
  //1. Check if the request has been accepted

  //2. IF yes, then delete from accepted table
  //3. Reject the request and set vehicle to available
  //4. Update the request status to REJECTED

  try {
    const { requestId } = req.params;
    const { userId } = req.user;
    const STATUS = "REJECTED";
    const { rejectReason } = req.body;

    const wasAccepted = await dbObject
      .getApprovedRequestByID(requestId)
      .catch((err) => {
        console.log(err);
      });

    if (wasAccepted.length > 0) {
      console.log(wasAccepted);
      const { vehicleAssigned: vehicleID } = wasAccepted[0];
      console.log(vehicleID);
      const deletedRequest = await dbObject
        .deleteApprovedRequestByID(requestId)
        .catch((err) => {
          console.log(err);
        });

      if (deletedRequest) {
        console.log(deletedRequest);
        const rejectedRequest = await dbObject
          .RejectRequest(requestId, userId, rejectReason)
          .catch((err) => {
            console.log(err);
          });

        const updatedRequest = await dbObject.UpdateRequestStatus(
          requestId,
          STATUS
        );
        if (updatedRequest) {
          await dbObject
            .UpdateVehicleAvailability(true, parseInt(vehicleID))
            .catch((err) => {
              throw err;
            });
          const request = await dbObject.getRequestById(requestId);
          const { email, fullname } = request[0];
          MailHelper.SendRequestRejectionEmail(email, fullname, rejectReason);
          req.flash("err_msg", "Request has been rejected");
          res.redirect("/admin/dashboard");
        }
      } else {
      }
    } else {
      const rejectedRequest = await dbObject.RejectRequest(
        requestId,
        userId,
        rejectReason
      );

      //TODO:: SEND EMAIL TO USER THAT REQUEST WAS REJECTED
      const updatedRequest = await dbObject.UpdateRequestStatus(
        requestId,
        STATUS
      );
      const request = await dbObject.getRequestById(requestId);
      const { email, fullname } = request[0];
      MailHelper.SendRequestRejectionEmail(email, fullname, rejectReason);
      req.flash("err_msg", "Request has been rejected");
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    next(error);
  }
});
//re-assign request vehicle
router.post("/update/request/:requestId", async (req, res, next) => {
  const { requestId } = req.params;
  const newVehicleID = req.body.vehicleId;
  const request = await dbObject.getApprovedRequestByID(requestId);
  //1. Update request vehicle

  const { vehicleAssigned: vehicleId } = request[0];

  const requestVehicleUpdated = await dbObject
    .updateApprovedRequestVehicle(requestId, newVehicleID)
    .catch((err) => console.log(err));

  if (requestVehicleUpdated) {
    console.log(requestVehicleUpdated);

    const vehicleUpdated = await dbObject
      .UpdateVehicleAvailability(true, vehicleId)
      .catch((err) => console.log(err));

    if (vehicleUpdated) {
      const updatedNewVehicleStatus = await dbObject
        .UpdateVehicleAvailability(false, newVehicleID)
        .catch((err) => console.log(err));

      req.flash("success", "Vehicle Successfuly re-assigned");
      res.redirect(`/admin/request-single/${requestId}`);
    }
  }
});

router.get("/admin-feedback", ensureAuthenticated, (req, res, next) => {
  try {
    feedbacks = allFeedbacks.map((feedback) => {
      return {
        feedbackId: feedback.feedbackId,
        fullname: feedback.fullname,
        deptname: feedback.deptname,
        feedbackDate: feedback.feedbackDate,
        feedbackTime: feedback.feedbackTime,
        userFeedback: feedback.userFeedback,
      };
    });
    // console.log(feedbacks);
    // return;
    //return res.status(200).json({ data: feedbacks });
    res.render("admin/admin-feedback", {
      isAdmin,
      allFeedbacks: allFeedbacks,
      pageTitle: "Feedbacks",
      adminName,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/report", async (req, res) => {
  if (Object.keys(req.query).length) {
    const { filterStartDate, filterEndDate, filterPurpose, filterStatus } =
      req.query;

    let result = await dbObject.getAllRequests(
      filterStartDate,
      filterEndDate
    );
    console.log(result);
    result = result.map((request) => {
      return {
        requestId: request.requestId,
        fullname: request.fullname,
        deptname: request.deptname,
        requestDate: moment(request.requestDate).format("DD-MMMM-YYYY"),
        requestTime: moment(request.requestDate).format("HH:mm A"),
        departureDate: request.departureDate,
        departureTime: request.departureTime,
        returnDate: request.returnDate,
        returnTime: request.returnTime,
        tripPurpose: request.tripPurpose,
        numberOfPassengers: request.numberOfPassengers,
        requestStatus: request.requestStatus,
      };
    });
    return res.status(200).json({ data: result });
  } else {
    res.render("admin/admin-report", {
      isAdmin,
      requests: allRequests,
      pageTitle: "Reports",
      adminName,
    });
  }
});

module.exports = router;
