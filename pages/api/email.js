export default async function (req, res) {
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
    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              console.log("Server is ready to take our messages");
              resolve(success);
          }
      });
    });
    const mailData = {
      from: 'Used.com',
      to: req.body.email,
      subject: `${req.body.subject}`,
      text: req.body.message + " | Sent from: " + req.body.email,
      html: `<div>${req.body.message}</div><p>Sent from:
      Used.com</p>`
    }
    
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
    });
    res.status(200).send("Done")
  }