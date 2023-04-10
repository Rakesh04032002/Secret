//require dotenv
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

console.log(process.env.SECRET);

// const userschema = {
//     email: String,
//     password: String
// };

//updated schema
const userschema=new mongoose.Schema({
    email:String,
    password:String
});

// const secret = "Thisisoursecret";
//userschema.plugin(encrypt, { secret:secret,encryptedFields: ['password']  });
userschema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password']  });

const user = mongoose.model("user", userschema);
app.get("/", function (req, res) {
    res.render("home");
});
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/login", function (req, res) {
    res.render("login");
});
//level 1 authentication 
app.post("/register", function (req, res) {

    const newuser = new user({
        email: req.body.username,
        password: req.body.password
    });
    newuser.save().then(function () {
        res.render("secrets");
    }).catch(function (err) {
        console.log(err);
    });


});
app.post("/login", function (req, res) {

    const username = req.body.username;
    //const password = req.body.password;
    user.findOne({email:username}).then(function(founduser){
    
        if(founduser.password===req.body.password){
            res.render("secrets");
        }
    }).catch(function(err){
        console.log(err);
    });
});

//level 2 authentication
//here we will use mongoose-encryption package
//install it using npm and then require it and then we have to make proper mongoose schema following the documentation so now go to link no: 12 and update our schema 
//Plugin encryption package into schema and encrypt certain fields like in line no: 23 and 24 where we encrypt the password 


//using environment variable to keep secret save
//for that we have to install the dotenv package using npm i dotenv
//then require it like in line no : 2
//now make a .env file in root directory and then move line no 25(const secret = "Thisisoursecret";)
//now in .env file the format will be changed from this --> const secret = "Thisisoursecret"; to this--> SECRET = Thisisoursecret
//Now to process the .env file content we have to use process.env.the_content_Name like in line no 14 
//as we moved our secret to .env file so we can not use the plugin in like in 28 line for that we have to modified plugin like line no 29

const PORT=process.env.PORT||3000;

app.listen(PORT, function () {
    console.log("server is running on port no 3000");
})
