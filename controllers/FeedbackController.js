const { dbObject } = require("../db/db");
const moment = require("moment");

// const displayMessage = (response) => {
//     if (response.success) {
//       return swal({
//         title: "Success",
//         text: response.success,
//         icon: "success",
//         buttons: true,
//       }).then((confirm) => {
//         if (confirm) {
//           location.reload();
//         }
//       });
//     }

//     if (response.error) {
//       return swal({
//         title: "Error",
//         text: response.error,
//         icon: "error",
//         buttons: true,
//       });
//     }
//   };

//save new Feedback
exports.SaveNewFeedback = async (req, res, next) => {
  try {
    const feedbackDate = moment().format("YYYY-MM-DD hh:mm:ss");

    const { userFeedback } = req.body;

    const newFeedback = {
      userId: req.user.userId,
      feedbackDate,
      userFeedback,
    };
    // console.log(newFeedback);
    // return;
    await dbObject.addNewFeedback(newFeedback);

    
    return res.status(200).json({
      success:
        "Your Feedback has successfully been submitted. Thanks for sending us your feedback. please go back to continue",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
