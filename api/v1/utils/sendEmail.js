const nodemailer = require("nodemailer")
const ErrorResponse = require("./errorResponse")

require('dotenv').config()
const env = process.env

const sendEmail = async (options) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_EMAIL, // generated ethereal user
      pass: env.SMTP_PASSWORD, // generated ethereal password
    },
  })

  // send mail with defined transport object
  const message = {
    from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html || null
  }

  const email = await transporter.sendMail(message)

  console.log("Message sent: %s", email.messageId)
  
  return email
  
}

module.exports = sendEmail