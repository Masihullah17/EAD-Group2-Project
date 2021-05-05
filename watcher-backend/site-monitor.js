require("dotenv").config();

const express = require("express");
const app = express();
app.set("view engine", "ejs");

// Body Parser for parsing JSON objects
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routing the API
const site = require("./routes/site");
const user = require("./routes/user");
app.use("/site", site);
app.use("/user", user);

console.log(process.env);

// Logger Setup
const winston = require("winston");
require("winston-mongodb");

winston.add(
	new winston.transports.MongoDB({
		db: process.env.MONGODB,
		options: {
			useUnifiedTopology: true,
		},
	})
);

const consoleTransport = new winston.transports.MongoDB({
	db: process.env.MONGODB,
	options: { useUnifiedTopology: true },
	collection: "log",
});

const myWinstonOptions = {
	transports: [consoleTransport],
};
const logger = new winston.createLogger(myWinstonOptions);

function logRequest(req, res, next) {
	logger.info(req);
	next();
}
app.use(logRequest);

function logError(err, req, res, next) {
	logger.error(err);
	next();
}
app.use(logError);

// Setting up the server
app.listen(3000, () => console.log("Server Up and running"));

// Initializing the monitoring method
var monitor = require("./lib/monitor");

//Uncaught exception
process.on("uncaughtException", function (error) {
	console.log("Uncaught Exception: " + error + " TRACE: " + error.stack);
});

//Start monitoring
monitor(); //require("./config.json")
