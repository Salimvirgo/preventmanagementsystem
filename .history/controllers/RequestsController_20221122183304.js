const { dbObject } = require("../db/db");
const smpp = require("../smpp/smpp");
const moment = require("moment");

const {
  sendHREmail,
  SendRequestAcceptanceEmail,
} = require("../Helper/MailHelper");

//get all request
exports.GetVehicleRequests = async (req, res, next) => {
  if (Object.keys(req.query).length) {
    const { filterStartDate, filterEndDate, filterPurpose, filterStatus } =
      req.query;
  } else {
    allRequests = allRequests.map((request) => {
      return {
        requestId: request.requestId,
        fullname: request.fullname,
        deptname: request.deptname,
        requestDate: moment(request.requestDate).format("DD-MMMM-YYYY"),
        departureDate: moment(request.departureDate).format("DD-MMMM-YYYY"),
        departureTime: request.departureTime,
        returnDate: moment(request.returnDate).format("DD-MMMM-YYYY"),
        returnTime: request.returnTime,
        tripPurpose: request.tripPurpose,
        numberOfPassengers: request.numberOfPassengers,
        requestStatus: request.requestStatus,
      };
    });

    res.render("admin/admin-report", {
      isAdmin,
      requests: allRequests,
      pageTitle: "Reports",
      adminName,
    });
  }
};

//save new request
exports.SaveNewRequest = async (req, res, next) => {
  try {
    const today = moment().format("DD-MMMM-YYYY");
    const eventDate = moment().format("DD-MMMM-YYYY");

    const {
      eventTitle,
      eventType,
      eventVenue,
      mediaType,
      numberOfPrint,
      numberOfRadio,
      numberOfTv,
      eventBudget,
    } = req.body;
    const typeOfMedia = mediaType.toString();
    const newRequest = {
      userId: req.user.userId,
      email: req.user.email,
      deptId: req.user.department,
      eventTitle,
      eventDate,
      eventType,
      eventVenue,
      typeOfMedia,
      numberOfPrint,
      numberOfRadio,
      numberOfTv,
      eventBudget,
    };
    await dbObject.addNewRequest(newRequest);

    // const { department } = req.user;
    // const headOfDept = await dbObject.getDeptartmentHead(department);
    // console.log(headOfDept);
    // const { email, fullname } = headOfDept[0];
    //await sendHREmail(email, fullname, newRequest);
    return res.status(200).json({
      success:
        "Request has successfully been submitted. Please wait while your request is being reviewed by your supervisor",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//get a single request by ID
exports.GetAllVehicleRequestById = async (req, res, next) => {};

//approves a request by ID
exports.ApproveRequest = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    const HODApproval = "Yes";
    const requestStatus = "APPROVED";
    const userId = parseInt(req.user.userId);
    const request = await dbObject.getRequestById(requestId);
    const { departureDate } = request[0];
    const today = moment();

    //TODO 1. Secondly, Check if request has been rejected first
    const wasRejected = await dbObject.getRejectedRequestByID(requestId);
    console.log(was);

    if (Object.keys(wasRejected).length) {
      //delete from rejected request before approval
      await dbObject.deleteRejectedRequestByID(requestId);
      //accept the previously rejected request and assign a vehicle
      await dbObject.AcceptRequest(requestId, userId);

      //update the accepted request status to APPROVEDRejecte
      await dbObject.UpdateRequestStatus(requestId, requestStatus, HODApproval);
      const request = await dbObject.getApprovedRequestByID(requestId);

      const data = request[0];
      const { fullname, number } = data;
      let c_code = "+232";
      let n_number = c_code + number;
      smpp.SendSMSAlert(fullname, n_number);

      return res.status(200).json({
        success: "Rejected request has successfully been approved",
      });
     
    } else {
      const acceptedRequest = await dbObject.AcceptRequest(requestId, userId);
      if (acceptedRequest) {
        const updatedRequest = await dbObject.UpdateRequestStatus(
          requestId,
          requestStatus,
          HODApproval
        );
        const request = await dbObject.getApprovedRequestByID(requestId);

        const data = request[0];
        const { fullname, number } = data;
        let c_code = "+232";
        let n_number = c_code + number;
        let securityNum = "+23276450406";

        smpp.SendSMSAlert(fullname, n_number);

        return res
          .status(200)
          .json({ success: "Request has successfully been approved" });
      } else {
        // req.flash("err_msg", "An Error Occured");
        // res.redirect(`/admin/request-single/${requestId}`);
        console.log("Error occured");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//rejects a request by ID
exports.RejectVehicleRequest = async (req, res, next) => {};

//update a request by ID
exports.UpdateVehicleRequest = async (req, res, next) => {};

//delete a request by ID
exports.DeleteVehicleRequest = async (req, res, next) => {};

exports.Test = async (req, res, next) => {
  const result = await dbObject.getApprovedRequestByID(54);
  console.log(result);
};
