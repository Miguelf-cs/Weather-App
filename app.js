const { log } = require("console");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

//Get request to obtain html file
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

//Post request to try to fetch data from user
app.post("/", function(req, res) {

    //Body Parser lets you parse through body of request and then get name of input from html
    const query = req.body.cityName;
    const apiKey = "37caeb3667b682c440ec8569b8097317";
    const unit = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + unit;

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Fahrenheit</h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        })
    });
})



//Checks if server is up and running
app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})