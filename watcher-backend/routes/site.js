const express = require("express");
let app = express.Router();
const dataRepo = require("../data/Data");
const cors = require("cors");

// Using CORS middleware to avoid CORS policy error
app.use(cors());
var corsOptions = {
	origin: "http://localhost:4000",
};

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:4000");
	next();
});

// POST request for getting all the watch requests raised by a user
app.post("/get-all-sites", async (req, res, next) => {
	try {
		const data = await dataRepo.sites.findByUsername(req.body.email);
		return res.status(200).json(data);
	} catch (err) {
		console.log(err);
		next({ status: 400, message: "failed to get history" });
	}
});

// POST request for getting status of the watch requests raised by a user
app.post("/get-status", async (req, res, next) => {
	try {
		const data = await dataRepo.notifications.findByUid(req.body.uid);

		var msg = "Queued for checking...";
		if (data.length > 0) {
			msg = data.message;
		}
		return res.status(200).json(msg);
	} catch (err) {
		console.log(err);
		next({ status: 400, message: "failed to get history" });
	}
});

// POST request for counting the total number of submissions by a user or ip subnet per day
app.post("/count-submissions", async (req, res, next) => {
	try {
		const count = await dataRepo.sites.findByIP(req.body.ip);

		const count2 = await dataRepo.sites.findBySubnetIP2(req.body.ip);

		const count3 = await dataRepo.sites.findBySubnetIP3(req.body.ip);

		if (count > 5) {
			// A user can submit only 5 requests per day
			return res.status(403).json({
				allowed: false,
				message:
					"Daily limit of 5 watch request submissions exhausted!!",
			});
		} else if (count2 > 100000) {
			// Only 100000 requests are allowed from a subnet type, for ex. 192.168.xxx.xxx
			return res.status(403).json({
				allowed: false,
				message:
					"Daily limit of 100000 watch request submissions exhausted, from your subnet!!",
			});
		} else if (count3 > 1000) {
			// Only 1000 requests are allowed from a subnet, for ex. 192.168.0.xxx
			return res.status(403).json({
				allowed: false,
				message:
					"Daily limit of 1000 watch request submissions exhausted, from your subnet!!",
			});
		} else {
			return res.status(200).json({ allowed: true, ip: req.body.ip });
		}
	} catch (err) {
		console.log(err);
		next({ status: 400, message: "failed to get history" });
	}
});

// POST request for submitting the website watch request
app.post("/", async (req, res, next) => {
	try {
		const bodyData = req.body;
		const site = await dataRepo.sites.create(
			bodyData.uid,
			bodyData.username,
			bodyData.name,
			bodyData.url,
			bodyData.content,
			bodyData.element,
			bodyData.elementAttr,
			bodyData.elementContent,
			bodyData.elementChange,
			bodyData.imageChange,
			bodyData.interval,
			bodyData.timeout,
			bodyData.notifyId,
			bodyData.ip
		);

		const status = await dataRepo.statusOfSites.create(bodyData.uid);

		return res.status(200).json(site);
	} catch (err) {
		next({ status: 400, message: "failed to post!!" });
	}
});

module.exports = app;
