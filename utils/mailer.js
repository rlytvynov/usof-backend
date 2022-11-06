const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const mailer = async mailOptions => {
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', response);
              
      } catch (error) {
        console.log('error =' + error);
        throw Error("Network Connection");
      }
}

module.exports = mailer