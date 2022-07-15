const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const { resolve } = require("path");
const mailTransprter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASS,
  },
});

let mailOptions = {};
exports.sendRegisterationEmail = async (email, username) => {
  const data = await ejs.renderFile(
    path.join(__dirname, "../views/mail_templates/registration-complete.ejs"),
    { username }
  );
  mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Registration Successful",
    html: data,
  };
  mailTransprter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
  });
};

exports.sendHREmail = async (email, username, request) => {
  const data = await ejs.renderFile(
    path.join(__dirname, "../views/mail_templates/new-vehicle-request.ejs"),
    { username, request }
  );

  return new Promise((reject, resolve) => {
    mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "New Vehicle Request",
      html: data,
    };

    mailTransprter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);

      return resolve(info);
    });
  });
};

exports.sendForgetPassEmail = async (email, username) => {
    const data = await ejs.renderFile(
      path.join(__dirname, "../views/mail_templates/forgetPassword.ejs"),
      { username }
    );
  
    return new Promise((reject, resolve) => {
      mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Forget Password Link",
        html: data,
      };
  
      mailTransprter.sendMail(mailOptions, (err, info) => {
        if (err) return reject(err);
  
        return resolve(info);
      });
    });
  };

//Function for sending Emails
exports.sendEmail = async (email, username) => {
  mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Registration Successful",
    html: `<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>User Registeration</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            min-width: 100% !important;
        }

        img {
            height: auto;
        }

        .content {
            width: 100%;
            max-width: 600px;
        }

        .header {
            padding: 40px 30px 20px 30px;
        }

        .innerpadding {
            padding: 30px 30px 30px 30px;
        }

        .borderbottom {
            border-bottom: 1px solid #f2eeed;
        }

        .subhead {
            font-size: 15px;
            color: #ffffff;
            font-family: helvetica;
            letter-spacing: 10px;
        }

        .h1,
        .h2,
        .bodycopy {
            color: #153643;
            font-family: sans-serif;
        }

        .h1 {
            font-size: 33px;
            line-height: 38px;
            font-weight: bold;
        }

        .h2 {
            padding: 0 0 15px 0;
            font-size: 24px;
            line-height: 28px;
            font-weight: bold;
        }

        .bodycopy {
            font-size: 16px;
            line-height: 22px;
        }

        .button {
            text-align: center;
            font-size: 18px;
            font-family: helvetica;
            font-weight: bold;
            padding: 0 30px 0 30px;
        }

        .button a {
            color: #ffffff;
            text-decoration: none;
        }

        .footer {
            padding: 20px 30px 15px 30px;
        }

        .footercopy {
            font-family: sans-serif;
            font-size: 14px;
            color: #ffffff;
        }

        .footercopy a {
            color: #ffffff;
            text-decoration: underline;
        }

        @media only screen and (max-width: 550px),
        screen and (max-device-width: 550px) {
            body[yahoo] .hide {
                display: none !important;
            }

            body[yahoo] .buttonwrapper {
                background-color: transparent !important;
            }

            body[yahoo] .button {
                padding: 0px !important;
            }

            body[yahoo] .button a {
                background-color: #e05443;
                padding: 15px 15px 13px !important;
            }

            body[yahoo] .unsubscribe {
                display: block;
                margin-top: 20px;
                padding: 10px 50px;
                background: #2f3942;
                border-radius: 5px;
                text-decoration: none !important;
                font-weight: bold;
            }
        }
    </style>
</head>

<body yahoo bgcolor="#f6f8f1">
    <table width="100%" bgcolor="#f6f8f1" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td bgcolor="#fc8844" class="header">
                            <table width="70" align="left" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td height="70" style="padding: 0 20px 20px 0;">
                                        <img class="fix"
                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/icon.gif"
                                            width="70" height="70" border="0" alt="" />
                                    </td>
                                </tr>
                            </table>
                            <table class="col425" align="left" border="0" cellpadding="0" cellspacing="0"
                                style="width: 100%; max-width: 425px;">
                                <tr>
                                    <td height="70">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td class="subhead" style="padding: 0 0 0 3px;">
                                                    New
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="h1" style="padding: 5px 0 0 0;">
                                                    User Registeration
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                    <tr>
                        <td class="innerpadding borderbottom">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="h2">
                                        Dear <strong>
                                            ${username}
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="bodycopy">You have successfully been registered to the Orange Vehicle Request System.
 							You must follow this link to activate your account:
                     				 	<a href="http://172.25.164.15:3500/login" target="_blank">Click the link to login</a> 
							Have fun, and please dont hesitate to contact us with your feedback.
            
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer" bgcolor="#44525f">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" class="footercopy">
                                        &reg; Vehicle Request System, OrangeSl 2021<br />
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`,
  };

  mailTransprter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
  });
};

exports.SendRequestAcceptanceEmail = async (email, username) => {
  const data = await ejs.renderFile(
    path.join(__dirname, "../views/mail_templates/requestAccepted.ejs"),
    {
      username,
    }
  );

  return new Promise((reject, resolve) => {
    mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "REQUEST ACCEPTED",
      html: data,
    };

    mailTransprter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);

      return resolve(info);
    });
  });
};

exports.SendRequestRejectionEmail = async (username, email, reason) => {
  const data = await ejs.renderFile(
    path.join(__dirname, "../views/mail_templates/requestRejected.ejs"),
    {
      username,
      reason,
    }
  );

  mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "REQUEST REJECTED",
    html: data,
  };

  mailTransprter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
  });
};
