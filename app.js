
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');

const app = express();


const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, 'public/uploads/');

    },

  

    filename: function(req, file, cb) {
        console.log(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      
    }

});

  

const upload = multer({ storage: storage })

  

app.get('/', (req, res) => {

  res.sendFile(`${__dirname}/static/index.html`);

});

  

app.post('/', upload.array('multi-files'), (req, res) => {
  const myTimeout = setTimeout(function(){
    res.redirect('/');
}, 5000);
 

});

  

app.listen(80);