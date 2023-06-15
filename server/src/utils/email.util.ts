import nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
import config from '../config'
import { errors } from '../_constants'

class EmailUtil {
  private env = process.env.NODE_ENV

  public sendVerificationEmail = async (email, token) => {
    const mailOptions = {
      from: 'tsneville@gmail.com',
      to: email,
      subject: 'Account Verification',
      text:
        'Hello,\n\n' +
        'Please verify your account by clicking the following link: \n\nhttp://' +
        config.HOST +
        ':' +
        config.CLIENT_PORT +
        '/verify/' +
        token +
        '\n\n' +
        'This link will self-destruct in 1 day.\n\n',
    }
    await this.sendEmail(mailOptions)
  }

  public sendPasswordResetEmail = async (email, token) => {
    const mailOptions = {
      from: 'tsneville@gmail.com',
      to: email,
      subject: 'Password Reset',
      text:
        'Hello,\n\n' +
        'Click this link to finish resetting your password: \n\nhttp://' +
        config.HOST +
        ':' +
        config.CLIENT_PORT +
        '/reset-password/' +
        token +
        '\n\n' +
        'This link will self-destruct in 30 minutes.\n\n',
    }
    await this.sendEmail(mailOptions)
  }

  private sendEmail = async (mailOptions) => {
    if (this.env === 'development') {
      console.log(mailOptions)
      return
    }

    try {
      const auth = {
        auth: {
          api_key: config.MAILGUN_API_KEY,
          domain: config.MAILGUN_DOMAIN,
        },
      }
      const transporter = nodemailer.createTransport(mailgun(auth))
      await transporter.sendMail(mailOptions)
    } catch (error) {
      console.log(error)
      throw new Error(errors.SEND_EMAIL_FAILED)
    }
  }
}

export default EmailUtil
