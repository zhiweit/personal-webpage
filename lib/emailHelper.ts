import nodemailer from "nodemailer"

export default class EmailHelper {
  static sendRegistrationEmail = async (recipientEmail: string, url: string) => {
    if (!process.env['SMTP_HOST'] || !process.env['SMTP_USERNAME'] || !process.env['SMTP_PASSWORD']) {
      console.error("'hostname' or 'username' or 'password' does not exist as a environment variable")
      process.exit(1)
    }

    const hostname = process.env['SMTP_HOST']
    const username = process.env['SMTP_USERNAME']
    const password = process.env['SMTP_PASSWORD']

    const transporter = nodemailer.createTransport({
      host: hostname,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: username,
        pass: password,
      },
      logger: true
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Thean Zhi Wei", // sender address
      to: recipientEmail, // list of receivers
      subject: "Confirm Email Registration", // Subject line
      text: "Thank you for registering on my website! Click here to complete your registration, or copy and paste the URL into your browser.", // plain text body
      html: `Thank you for registering on my website! Click <a href='${url}'>here</a> to complete your registration, or copy and paste the URL into your browser.`, // html body
    });

    
  }
}