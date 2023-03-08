const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  HOST,
  CLIENT_PORT,
} = require('../config')
const { ERRORS } = require('../_constants')

const sendVerificationEmail = async (req, email, token) => {
  try {
    const auth = {
      auth: {
        api_key: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN,
      },
    }
    const transporter = nodemailer.createTransport(mailgun(auth))
    const mailOptions = {
      from: 'tsneville@gmail.com',
      to: email,
      subject: 'Account Verification Token',
      text:
        'Hello,\n\n' +
        'Please verify your account by clicking the link: \nhttp://' +
        HOST +
        ':' +
        CLIENT_PORT +
        '/verify/' +
        token +
        '.\n',
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
    throw new Error(ERRORS.SEND_EMAIL_FAILED)
  }
}

module.exports = { sendVerificationEmail }
