//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = process.env.PORT;

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/3441b19cf9";

    const option = {
        method: "POST",
        auth: "iamtopher:2a4da2c82e4b6a7e25026f9a7208f4c1-us10"
    }

   const request = https.request(url, option, function(response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(port || 3000, function() {
    console.log("server running on port 3000");
});


//Api Key
//2a4da2c82e4b6a7e25026f9a7208f4c1-us10
//List ID
//3441b19cf9