const { body, validationResult } = require("express-validator");

exports.saveUserValidationRules = () => {
  return [
    body("fullname")
      .not()
      .isEmpty()
      .withMessage("Please provide users fullname")
      .trim()
      .escape(),

    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a username")
      .trim()
      .escape(),

    body("email")
      .not()
      .isEmpty()
      .withMessage("Please Provide an Email")
      .trim()
      .escape(),

    body("number")
      .not()
      .isEmpty()
      .withMessage("Please Provide a valid Phone number")
      .trim()
      .escape(),

    body("department")
      .not()
      .isEmpty()
      .withMessage("Select users department")
      .trim()
      .escape(),

    body("userLevel")
      .not()
      .isEmpty()
      .withMessage("Select user's level")
      .trim()
      .escape(),

    body("password")
      .not()
      .isEmpty()
      .withMessage("Please provide your password.")
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6-50 characters long"),

    body("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("Enter confirm password")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

exports.updateUserValidationRules = () => {
  return [
    body("fullname")
      .not()
      .isEmpty()
      .withMessage("Please provide users fullname")
      .trim()
      .escape(),

    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a username")
      .trim()
      .escape(),

    body("email")
      .not()
      .isEmpty()
      .withMessage("Please Provide an Email")
      .trim()
      .escape(),

    body("number")
      .not()
      .isEmpty()
      .withMessage("Please Provide a valid Phone number")
      .trim()
      .escape(),

    body("department")
      .not()
      .isEmpty()
      .withMessage("Select users department")
      .trim()
      .escape(),

    body("userLevel")
      .not()
      .isEmpty()
      .withMessage("Select user's level")
      .trim()
      .escape(),
  ];
};

exports.saveVehcileValidationRules = () => {
  return [
    body("model")
      .not()
      .isEmpty()
      .withMessage("Please provide vehicles model")
      .trim(),
    body("vehicleRegNumber")
      .not()
      .isEmpty()
      .withMessage("Please provide vehicles registration number")
      .trim(),
    body("department")
      .not()
      .isEmpty()
      .withMessage("Select vehicle's department")
      .trim(),
  ];
};

exports.saveDepartmentValidationRules = () => {
  return [
    body("departmentName")
      .not()
      .isEmpty()
      .withMessage("Department Name is required"),
  ];
};

exports.saveDriverValidationRules = () => {
  return [
    body("driverName")
      .not()
      .isEmpty()
      .withMessage("Driver's Name is required")
      .trim()
      .escape(),
    body("driverId")
      .not()
      .isEmpty()
      .withMessage("Driver's ID is required")
      .trim()
      .escape(),
    body("vehicleRegNumber")
      .not()
      .isEmpty()
      .withMessage("Please select driver's vehicle registration number")
      .trim()
      .escape(),
    body("driverStatus")
      .not()
      .isEmpty()
      .withMessage("Please Select Drivers Status")
      .trim()
      .escape(),
  ];
};

exports.saveUserValidationRules = () => {
  return [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a username")
      .trim()
      .escape(),

    body("password")
      .not()
      .isEmpty()
      .withMessage("Please provide your password.")
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6-50 characters long"),

    body("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("Enter confirm password")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

exports.assignHeadOfDepartmentValidationRules = () => {
  return [
    body("departmentId").not().isEmpty().withMessage("Department is required"),
    body("hodId").not().isEmpty().withMessage("HOD is required"),
  ];
};

exports.userLoginValidationRules = () => {
  return [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Please Provide an Email")
      .trim()
      .escape(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please provide your password."),
  ];
};

exports.saveNewFeedbackValidationRules = () => {
  return [
    body("userFeedback")
      .not()
      .isEmpty()
      .withMessage("Please Provide a Feedback")
      .trim()
      .escape(),
  ];
};

exports.PRRequestValidationRules = () => {
  return [
    body("eventTitle").not().isEmpty().withMessage("Please enter Event Title"),
    body("eventDate").not().isEmpty().withMessage("Please enter Event Date."),
    body("eventType")
      .not()
      .isEmpty()
      .withMessage("Please enter theType of Event"),
    body("eventVenue")
      .not()
      .isEmpty()
      .withMessage("Please enter the venue for the event."),

    body("mediaType").not().isEmpty().withMessage("Please select a media type"),

    body("numberOfMedia")
      .not()
      .isEmpty()
      .withMessage("Please provide number of media personnel")
      .isNumeric()
      .withMessage("number of media personels must be a numric value"),

    body("eventBudget")
      .not()
      .isEmpty()
      .withMessage("Please provide event budget"),
  ];
};
exports.validate = async (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length <= 0) {
    return next();
  }

  return res.status(201).json(errors);
};
