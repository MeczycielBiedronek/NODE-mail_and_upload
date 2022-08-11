
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');

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

    const dest = "public/uploads@a/" + req.body.email + newdate;
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
        console.log(file.originalname);
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

 

});
////////////  SEND EMAIL
  

app.listen(80);