const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");
const { options } = require("request");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
//javascript data object created
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


    const jsonData = JSON.stringify(data);      //to convert javascript data into json string.

    const url = "https://us21.api.mailchimp.com/3.0/lists/95c3c6a352"; //added listid to the end of the url.

    const options = {
        method: "POST",
        auth: "nikita1:85c71932d9eb11da2ebc227ab974c23b-us21"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


       response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});
//post request for the home route ends

app.post("/failure", function(req, res){
    res.redirect("/")         //after failure page the button redirects to home route
})



app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});


//API Key
//85c71932d9eb11da2ebc227ab974c23b-us21
//API Key 2
//3fc358403ee32265374b912bdb85bd3d-us21

//List ID
//95c3c6a352

//{"name":"Freddie'\''s Favourite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receriving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddihats.com","subject":"","language":"en"},"email_type_option":true}
