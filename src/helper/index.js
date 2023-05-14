const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "server500.orangehost.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@biddersbay.online",
    pass: "testingacc0912@",
  },
});

module.exports = {
  transporter,
};
