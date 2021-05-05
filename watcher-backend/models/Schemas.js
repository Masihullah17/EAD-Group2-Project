require("dotenv").config();
const mongoose = require("mongoose");

// Setting up database creds
const url = process.env.MONGODB;
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
};

// Connecting to database
mongoose.connect(url, options);
var db = mongoose.connection;

//handle mongo error
db.once("open", (_) => {
	console.log("Database connected:", url);
});

db.on("error", (err) => {
	console.error("connection error:", err);
});

// Schema for user details
const UserData = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	salt: { type: String, required: true },
	password: { type: String, required: true },
	wrong: { type: Number, default: 0 },
});

// Schema for website details to be watched
const Sites = new mongoose.Schema({
	username: { type: String, required: true },
	uid: { type: String, required: true },
	name: { type: String, required: true },
	url: { type: String, required: true },
	content: { type: String, default: "" },
	element: { type: String, default: "" },
	elementAttr: { type: String, default: "" },
	elementContent: { type: String, default: "" },
	elementChange: { type: Boolean, default: false },
	imageChange: { type: String, default: "" },
	interval: { type: Number, default: 600 },
	timeout: { type: Number, default: 5 },
	notifyId: { type: Number, default: 1 },
	ip: { type: String, required: true },
});

// Schema for status of the websites being watched
const StatusOfSites = new mongoose.Schema(
	{
		uid: { type: String, required: true },
		elementData: { type: String, default: "" },
		imageData: { type: String, default: "" },
		contentChanged: { type: Boolean, default: false },
		elementChanged: { type: Boolean, default: false },
		imageChanged: { type: Boolean, default: false },
		lastChecked: { type: Date, default: Date.now() },
	},
	{
		timestamps: true,
	}
);

// Schema for notifications of the websites being watched
const Notifications = new mongoose.Schema(
	{
		uid: { type: String, required: true },
		success: { type: Boolean, required: true },
		seen: { type: Boolean, default: false },
		message: { type: String, default: "Queued for checking..." },
		time: { type: Date, default: Date.now() },
	},
	{
		timestamps: true,
	}
);

module.exports = {
	userData: mongoose.model("UserData", UserData),
	sites: mongoose.model("Sites", Sites),
	statusOfSites: mongoose.model("StatusOfSites", StatusOfSites),
	notifications: mongoose.model("Notifications", Notifications),
};
