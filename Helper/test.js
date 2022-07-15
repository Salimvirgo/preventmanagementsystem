const Mailer = require("./Mailer.js");
const path = require("path");
const ejs = require("ejs");
// async function sendMail() {
//   const data = await Mailer.sendRegisterMail(
//     "Test Username",
//     "comroland85@gmail.com"
//   );
//   console.log(data);
// }
// sendMail();

ejs.renderFile(
  path.join(__dirname, "../views/mail_templates/new-vehicle-request.ejs"),
  {
    username: "Hello Mail Templates",
    request: { department: "Testing Department" },
  },
  (err, file) => {
    if (err) console.log(err);

    console.log(file);
  }
);
