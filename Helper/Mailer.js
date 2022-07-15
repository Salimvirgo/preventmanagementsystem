const nodemailer = require("nodemailer");
const ejs = require("ejs");
const transporter = nodemailer.createTransport({
  type: "OAuth2",
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASS,
  },
});
const Mailer = {
  sendRegisterMail: async (username, email) => {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Registered Successfully",
      html: `
        <div class="container">
        <div class="row">
        <div class="col-md-8 offset-md-3">
            <div class="card" style="width: 500px; margin: 25px auto;">
                <img class="card-img-top" src="http://www.orange.sl/personal/1/102/spack_home.jpg" alt=""
                    style="width: 500px; height: 300px; border-bottom: 2px solid white;">
                <div class="card-body text-center" style="padding: 10px;">
                    <p style="padding: 10px 0px; font-size:12px; text-transform:uppercase;">Dear ${username}</p>
                    <p class="card-text" style="font-size: 12px; text-transform:capitalize;">You have successfully been registered to the Orange Vehicle Request System. You
                    must follow this link to activate your account:
                        <a href="http://localhost:3000/login" target="_blank">link</a> Have fun, and please dont hesitate to contact us with your feedback.</p>
                </div>
            </div>
        </div>
        </div>
        </div>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);

      console.log(info);
    });
  },
};

module.exports = Mailer;
