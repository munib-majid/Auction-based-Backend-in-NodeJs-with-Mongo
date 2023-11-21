const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "server500.orangehost.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.psw,
  },
});

module.exports = {
  transporter,
};
