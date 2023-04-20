export default function (req, res) {
    require('dotenv').config()
    console.log(req.body)
    
    let nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: 'used.association@gmail.com',
        pass: 'psjbozlcropwsest',
      },
      secure: true,
    })
    const mailData = {
      from: 'Used.com',
      to: req.body.email,
      subject: `${req.body.subject}`,
      text: req.body.message + " | Sent from: " + req.body.email,
      html: `<div>${req.body.message}</div><p>Sent from:
      Used.com</p>`
    }
    transporter.sendMail(mailData, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info)
    })
    res.status(200).send("Done")
  }