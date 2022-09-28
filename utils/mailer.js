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

const mailer = mailOptions => {
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            return console.log(err)
        } else {
            console.log("Send mail: ", info)
        }
    })
}

module.exports = mailer