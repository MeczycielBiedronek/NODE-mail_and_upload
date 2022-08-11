
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
            ///// UPLOAD FILE 
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    // Generates new date (y m d)
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let newdate = "_" + year + month + day;
    // Generates new folder
    const dest = "public/uploads/" + req.body.email + newdate;
    fs.access(dest, function (error) {
      if (error) {
        console.log("Directory created");
        return fs.mkdir(dest, (error) => cb(error, dest));
      } else {
        console.log("Directory exists.");
        return cb(null, dest);
      }
    });
  },

  

    filename: function(req, file, cb) {
        // console.log(file.originalname);
        cb(null, file.originalname);
      
    }

});

const upload = multer({ storage: storage })

app.get('/', (req, res) => {

  res.sendFile(`${__dirname}/static/index.html`);

});

  

app.post('/', upload.array('multi-files'), (req, res) => {

  // upload progress desktop - simulation
  console.log('file uploaded');
  const myTimeout = setTimeout(function(){
    res.redirect('/');
}, 3000);

////////////  SEND EMAIL
const output = `
<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>  
  <li>Name: ${req.body.name}</li>
  <li>Company: ${req.body.company}</li>
  <li>Email: ${req.body.email} <a href="mailto:${req.body.email}?subject=Szparowanie.pl - Widamość dotycząca zlecenia"><button>Odpowiedz</button></a></li>
  <li>Phone: ${req.body.phone}</li>
</ul>
<h3>Message</h3>
<p>${req.body.message}</p>
`;

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
host: process.env.MAILER_HOST_NAME,
port: 465,
secure: true, // true for 465, false for other ports
auth: {
    user: process.env.MAILER_EMAIL, // generated ethereal user
    pass: process.env.MAILER_PASS // generated ethereal password
},
tls:{
  rejectUnauthorized:false
}
});

// setup email data with unicode symbols
let mailOptions = {
  from: `"szparowanie.pl" <${process.env.MAILER_EMAIL}>`, // sender address
  to: process.env.MAIL_TO, // list of receivers
  subject: `DARMOWA WYCENA - ${req.body.email}`, // Subject line
  text: 'Hello world?', // plain text body
  html: output // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);   
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

});
 

});

  

app.listen(80);