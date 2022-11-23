const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const moment = require("moment");
const { ensureAuthenticated } = require("../auth/authenticate");
const { dbObject } = require("../db/db");
const smpp = require("../smpp/smpp");
const { sendHREmail, sendForgetPassEmail } = require("../Helper/MailHelper");
const {
  userLoginValidationRules,
  validate,
  saveNewFeedbackValidationRules,
  PRRequestValidationRules,
} = require("../validations/validation");
const RequestController = require("../controllers/RequestsController");
const FeedbackController = require("../controllers/FeedbackController");
const UserController = require("../controllers/UsersController");

const isLineManager = 2;
let linemanagerName = "";
let depts,
  deptId,
  levels,
  allRequests,
  allNewRequestsDept,
  allFeedbacks,
  vehicles,
  availableVehicles,
  newRequests,
  drivers,
  users = [];
usersDept = [];

router.use(async (req, res, next) => {
  linemanagerName = typeof req.user != "undefined" ? req.user.fullname : "";
  depts = await dbObject.GetAllDepartments();
  levels = await dbObject.GetAllLevels();
  users = await dbObject.GetUsersAndDepartments();
  // usersDept = await dbObject.GetUsersAndDepartments(deptId);
  allRequests = await dbObject.getAllRequests();
  allNewRequestsDept = await dbObject.GetNewRequestsByDept();
  allFeedbacks = await dbObject.getAllFeedback();
  newRequests = await dbObject.getNewRequests();
  allRequests = allRequests.map((request) => {
    return {
      requestId: request.requestId,
      fullname: request.fullname,
      deptname: request.deptname,
      eventDate: request.eventDate,
      eventTime: request.eventDate,
    };
  });
  allNewRequestsDept = allNewRequestsDept.map((request) => {
    return {
      requestId: request.requestId,
      fullname: request.fullname,
      deptname: request.deptname,
      requestDate: moment(request.requestDate).format("DD/MM/YYYY"),
      requestTime: moment(request.requestDate).format("HH:mm A"),
      departureDate: request.departureDate,
      departureTime: request.departureTime,
      returnDate: request.returnDate,
      returnTime: request.returnTime,
      tripPurpose: request.tripPurpose,
      numberOfMedia: request.numberOfMediaPersonnel,
      requestStatus: request.requestStatus,
    };
  });
  next();
});

router.get("/", (req, res) => {
  if (req.user !== undefined) {
    const { userLevel } = req.user;
    if (userLevel === 1) {
      res.redirect("/admin/dashboard");
    } else if (userLevel === 2) {
      res.redirect("line-approve");
    } else {
      res.redirect("/request/request-form");
    }
  } else {
    res.status(200).render("index");
  }
});

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

//router for logging users in to their account after validation
router.post(
  "/login",
  userLoginValidationRules(),

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const { email, password } = req.body;
    if (errors.length > 0) {
      console.log("There was an error ");
      return res.render("login", { errors, email, password });
    } else {
      const { userLevel } = req.user[0];
      if (userLevel === 1) {
        return res.redirect("/admin/dashboard");
      } else if (userLevel === 2) {
        res.redirect("line-approve");
      } else {
        return res.redirect("/post-request");
      }
    }
  }
);

router.get("/faqs", (req, res) => {
  res.render("faqs");
});

router.get("/forgetpass", (req, res) => {
  res.render("forgetpass");
});

// router.get("/line-approve", async (req, res) => {
//   try {
//   //   const level = req.user.userLevel;
//   //   if (level === 1) {
//   //     res.redirect("/admin/dashboard");
//   //   } else {
//       const department = req.user.deptId;
//       const reqdept = await dbObject.GetRequestsByDept(department);
//       const id = req.user.userId;
//       const user = await dbObject.GetUserAndDepartmentById(id);
//       const { userId, fullname, deptname, userLevel } = user[0];
//       console.log(reqdept);
//       res.render("line-approve", { fullname, deptname, userId, userLevel });

//   } catch (err) {
//     throw err;
//   }
// });
router.get("/line-approve", ensureAuthenticated, async (req, res, next) => {
  const { department: departmentID } = req.user;
  const newRequestsByDepartment = await dbObject.GetNewRequestsByDept(
    departmentID
  );

  try {
    allNewRequestsDept = newRequestsByDepartment.map((request) => {
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
        numberOfTv: request.numberOfTv,
        requestStatus: request.requestStatus,
      };
    });

    res.render("line-approve", {
      isLineManager,
      requests: allNewRequestsDept,
      pageTitle: "Dashboard",
      linemanagerName,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/lineapprovesingle/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const { department: departmentID } = req.user;

  const singleDepartmentRequest =
    await dbObject.GetSingleDepartmentRequestByRequestID(
      departmentID,
      requestId
    );
  let r = singleDepartmentRequest.map((request) => {
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
      numberOfTv: request.numberOfTv,
      requestStatus: request.requestStatus,
    };
  })[0];

  //console.log(r);

  return res.render("lineapprovesingle", {
    isLineManager,
    // request: singleReq[0],
    pageTitle: "Single Request View",
    r,
    linemanagerName,
  });
  // req.flash("success", "You've successfully aapproved a request");
});

router.post("/forgetpass", async (req, res) => {
  try {
    const email = req.body.email;
    const emailExist = await dbObject.GetUserByEmail(email);

    if (emailExist.length > 0) {
      //res.send("Send an email")
      const { email, fullname } = emailExist[0];
      const info = await sendForgetPassEmail(email, fullname);
      console.log(info);
      return res.status(200).json({
        success: "Request Link has been sent to the email address you provided",
      });
    } else {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
    //console.log(useremail);
    console.log(emailExist);
    //UserController.ForgetPassword
    res.render("forgetpass");
  } catch (error) {}
});

router.get("/resetpass", (req, res) => {
  res.render("resetpass");
});

router.get("/request/request-form", (req, res) => {
  res.render("post-request");
});

router.post("/resetpass", async (req, res) => {
  //1 fetch data from UI
  try {
    const { password, confirmPassword } = req.body;

    //2 Confirm password
    if (password === "") {
      req.flash("err_msg", "password is required");
      res.redirect("/resetpass");
    } else if (password.length < 8 || number.length > 50) {
      req.flash("err_msg", "password must be between 8 and 50 characters");
      res.redirect("/resetpass");
      //errors.push("");
    } else if (password.toLowerCase() === username.toLowerCase) {
      req.flash("err_msg", "password must not be the same as username");
      res.redirect("/resetpass");
      //errors.push("password must not be the same as username");
    } else if (confirmPassword === "") {
      req.flash("err_msg", "confirm password is required");
      res.redirect("/resetpass");
      // errors.push("confirm password is required");
    } else if (confirmPassword !== password) {
      req.flash("err_msg", "passwords don't match");
      res.redirect("/resetpass");
      //errors.push("passwords don't match");
    } else {
      res.send("Checkers passed");
    }
    // console.log(equalPassword);
    return;

    // if (emailExist.length > 0) {
    //res.send("Send an email")
    //   const { email, fullname } = emailExist[0];
    //   const info = await sendForgetPassEmail(email, fullname);
    //   console.log(info);
    //   return res.status(200).json({
    //     success: "Request Link has been sent to the email address you provided",
    //   });
    // } else {
    //   return res.status(404).json({ error: "USER NOT FOUND" });
    // }
    //console.log(useremail);
    // console.log(emailExist);
    //UserController.ForgetPassword
    // res.render("forgetpass");

    //2 confirm if passwords entered are the same
    //3 Logic
    // res.render("resetpass");
  } catch (error) {}
});

router.get("/view-logs", ensureAuthenticated, async (req, res) => {
  const { userId } = req.user;
  const requests = await dbObject.GetUserRequests(userId);
  const userRequests = requests.map((request) => {
    return {
      requestId: request.requestId,
      eventDate: request.eventDate,
      eventTitle: request.eventTitle,
      eventType: request.eventType,
      eventVenue: request.eventvenue,
      mediaType: request.mediaType,
      eventBudget: request.eventBudget,
      numberOfradio: request.numberOfRadioPersonnel,
      requestStatus: request.requestStatus,
    };
  });

  res.render("view-logs", { userId, userRequests });
});

router.get("/post-request", ensureAuthenticated, async (req, res) => {
  const { userId, userLevel } = req.user;
  if (userLevel === 1) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("post-request", { userId });
  }
});

router.get("/request/new", ensureAuthenticated, async (req, res) => {
  try {
    const level = req.user.userLevel;
    if (level === 1) {
      res.redirect("/admin/dashboard");
    } else {
      const id = req.user.userId;
      const user = await dbObject.GetUserAndDepartmentById(id);
      const { userId, email, username, fullname, deptname, userLevel } =
        user[0];
      res.render("request-form", {
        fullname,
        email,
        username,
        deptname,
        userId,
        userLevel,
      });
    }
  } catch (err) {
    throw err;
  }
});

router.get("/feedback", ensureAuthenticated, async (req, res) => {
  try {
    const level = req.user.userLevel;
    if (level === 1) {
      res.redirect("/admin/dashboard");
    } else {
      const id = req.user.userId;
      const user = await dbObject.GetUserAndDepartmentById(id);
      const { userId, fullname, deptname, userLevel } = user[0];
      res.render("feedback", { fullname, deptname, userId, userLevel });
    }
  } catch (err) {
    throw err;
  }
});

router.post(
  "/feedback",
  ensureAuthenticated,
  saveNewFeedbackValidationRules(),
  validate,
  FeedbackController.SaveNewFeedback
);

router.post(
  "/request/new",
  ensureAuthenticated,
  PRRequestValidationRules(),
  validate,
  RequestController.SaveNewRequest
);

router.get(
  "/request/single/:requestId",
  ensureAuthenticated,
  async (req, res, next) => {
    let {
      eventTitle,
      eventType,
      eventVenue,
      mediaType,
      numberOfPrintPersonnel,
      numberOfRadioPersonnel,
      numberOfTvPersonnel,
      value,
      eventBudget,
    } = req.body;
    const { requestId } = req.params;
    const { userId } = req.user;
    if (requestId != null && requestId != "undefined") {
      const r = await dbObject.getRequestById(requestId);

      if (r) {
        const {
          fullname,
          eventTitle,
          eventDate,
          eventType,
          eventvenue,
          mediaType,
          numberOfPrintPersonnel,
          numberOfRadioPersonnel,
          numberOfTvPersonnel,
          value,
          eventBudget,
        } = r[0];
        res.render("user-single", {
          fullname,
          eventTitle,
          eventDate,
          eventType,
          eventvenue,
          mediaType,
          numberOfPrintPersonnel,
          numberOfRadioPersonnel,
          numberOfTvPersonnel,
          value,
          eventBudget,
        });
        // return res.status(200).json({ data: r });
      } else {
        return res.status(404).json({ error: "REQUEST NOT FOUND" });
      }
    }
  }
);

router.delete("/request/delete/", ensureAuthenticated, async (req, res) => {
  const { requestId } = req.body;
  if (requestId != "undefined") {
    const deleted = await dbObject.deleteRequestByID(requestId).catch((err) => {
      res.send(err);
    });
    if (deleted) {
      console.log(deleted);
      res.send({ data: deleted, message: "Request Successfully deleted" });
    } else {
      console.log(deleted);
      res.send({ data: null, message: "Error deleting request. Try again" });
    }
  }
});

router.post("/accept/request", RequestController.ApproveRequest);

router.get("/test", RequestController.Test);

//route for rejecting a request
router.post("/reject/request/:requestId", async (req, res, next) => {
  //1. Check if the request has been accepted


  
  //4. Update the request status to REJECTED

  try {
    const { requestId } = req.params;
    const HODApproval = "No";
    const { userId } = req.user;
    const requestStatus = "REJECTED";
    const { rejectReason } = req.body;

    const wasAccepted = await dbObject
      .getApprovedRequestByID(requestId)
      .catch((err) => {
        console.log(err);
      });

  //2. IF yes, then delete from accepted table
    if (wasAccepted.length > 0) {
      //console.log(wasAccepted);
      const deletedRequest = await dbObject
        .deleteApprovedRequestByID(requestId)
        .catch((err) => {
          console.log(err);
        });
//3. Reject the request 
      if (deletedRequest) {
        const rejectedRequest = await dbObject
          .RejectRequest(requestId, userId, rejectReason)
          .catch((err) => {
            console.log(err);
          });
          //console.log(rejectedRequest);
        const updatedRequest = await dbObject.UpdateRequestStatus(
          requestId,
          requestStatus
        );
        if (updatedRequest) {
         
          const rejectingRequest = await dbObject.getRejectedRequestByID(requestId);
          
          const data = rejectingRequest[0];
          console.log(data);
          const { fullname, number } = data;
          let c_code = "+232";
          let n_number = c_code + number;
          //let securityNum = "+23276450406";

        smpp.SendSMSAlert2(fullname, n_number);
          req.flash("err_msg", "Request has been rejected");
          res.redirect("/line-approve");
        }
      } else {
      }
    } else {
      const rejectedRequest = await dbObject.RejectRequest(
        requestId,
        userId,
        rejectReason
      );
      
        if (rejectedRequest) {
          const updatedRequest = await dbObject.UpdateRequestStatus(
            requestId,
            requestStatus,
            HODApproval
          );

          const rejectingRequest = await dbObject.getRejectedRequestByID(requestId);
          const data = rejectingRequest[0];
          console.log(data);
          const { fullname, number } = data;
          let c_code = "+232";
          let n_number = c_code + number;
          let securityNum = "+23276450406";
          smpp.SendSMSAlert2(fullname, n_number);
          req.flash("err_msg", "Request has been rejected");
          res.redirect("/line-approve");
      }
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
      res.redirect(`/lineapprovesingle/${requestId}`);
    }
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Successfully Logged Out");
  res.redirect("/login");
});

module.exports = router;
