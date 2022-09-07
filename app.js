const dotenv = require('dotenv')

const nodemailer = require('nodemailer')

//upload image
const multer = require('multer')

// delete save images file sytem
const fs = require('fs')

//need middleware for upload image
const bodyParser = require('body-parser');

const express = require('express')

const app = express()

dotenv.config(); // important 

const port = process.env.PORT || 5000;
///////
//const buf = Buffer.from('BASIC=basic')
//const config = dotenv.parse(buf) 
//console.log(typeof config, config)


//console.log(process.env)



//----Alert
//flash message middleware



//--Alert end

//--


//--pass bady parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


var to;
var subject;
var body;
var path;

var Storage = multer.diskStorage({
   destination: function(req,file,callback) {
       callback(null, "./images");
   },
   filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
   storage: Storage
}).single("image"); //Field name and max count



app.use(express.static('public'))


app.post('/sendemail',(req,res) => {

   ///-upload image exzecute middleware
   upload(req,res,function(err){
      if(err){
          console.log(err)
          return res.end("Something went wrong!");
         }else{
            to = req.body.to
           
            from = req.body.from
            subject = req.body.subject
            body = req.body.body//store
            //add
            //item = req.body.item
            //amount = req.body.amount
            
            path = req.file.path
            console.log(to)
            //console.log(from)
            console.log(subject)
            console.log(body)
            //add
            //console.log(item)
            //console.log(amount)
           
           
            console.log(path)


            var transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                 //user: '',
                 //pass: ''
                 user: process.env.EMAIL_USER,
                 pass: process.env.PASSWORD,
               }
             });
           //
             var mailOptions = {
               from: process.env.EMAIL_USER,
              //from: from,
               to: to,
               //from: from,
              
               subject: subject,
               text: body,

               //text:item,
               //text:amount,
               attachments: [
                 {
                  path: path
                 }
              ]
             };

             //
             transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                 console.log(error);
               } else {
                 console.log('Success, Email sent: ' + info.response);
                 
                 //delete function fs
                 fs.unlink(path,function(err){
                   if(err){
                       return res.end(err)
                   }else{
                       console.log("deleted")
                       return res.redirect('/result.html')
                       //-not working return res.redirect('#submit')
                   }
                 })
               }
             });
             
         //
         }
         
      })
})

/*app.listen(5000,() => {
   console.log("Starting:-) on Port 5000")
})*/
app.listen(port,() => {
     console.log("Starting:-) on server at " + port);

})