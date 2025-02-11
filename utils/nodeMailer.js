const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: `${process.env.GMAIL_ID}`,
    pass: `${process.env.GMAIL_PASSWORD}`,
  },
});

const sendMail = async(email,url)=>{
    console.log("email", email)
    const info = await transporter.sendMail({
        from: `${process.env.GMAIL_ID}`, // sender address
        to: `${email}`, // list of receivers
        subject: "Update Password", // Subject line
        text: `Visit below link to update your password: ${url}`, // plain text body
        html: `<b>Visit below link to update your password: ${url}</b>`, // html body
      });
    
      return info;
}

module.exports = {sendMail}