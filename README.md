# dev-express-logger

Easily admin can create log of perticular route and track the ip and user activity on route. all log file is encrypted so you can set your encryption token 

Add module in main.js file 

<pre>
var logger = require("dev-express-logger");
var appLogger = new logger(); // Create logger instance 
</pre> 


Set encryption token  (Set only one time)


<pre>
  appLogger.setToken("My-demo-encryption-token");
</pre>

Use logger function for create log for route 

<pre>
 app.post("/savefunction", (req, res) => {
    appLogger.setLogger(req);
});
</pre>


function for get log details 
<pre>
app.get("/get", (req, res) => {
    appLogger.getLogger((data) => {
        res.send(data) ///responce is array for log details
    });
});
</pre>

complete  example here 

<pre>
var express = require("express");
var app = new express();


var bodyParser = require("body-parser");
app.use(bodyParser.json());

/**
 * 
 * @type Module logger|Module logger
 * 
 */
var logger = require("dev-express-logger");
var appLogger = new logger();

var port = process.env.port | 8080;


app.use(express.static("public"));

appLogger.setToken("My-demo-encryption-token");

app.post("/savedemolog", (req, res) => {
    appLogger.setLogger(req);
});


app.get("/get", (req, res) => {
    appLogger.getLogger((data) => {
        res.send(data)
    });
});

/**
 * @argument {Int} port 
 * @argument {Function} Callback 
 * @description Create server and listen on port 8080 
 */
app.listen(port, (err, res) => {
    if (err)
        console.log("I am in error---->" + err);
    else
        console.log("I am running on port---->" + port);
});
</pre>
