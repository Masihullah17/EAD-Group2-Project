const express = require("express");
let app = express.Router();
const { userData } = require("../data/Data");
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

// POST request for creating a user while sign up
app.post("/create-user", async (req, res, next) => {
	try {
		const bodyData = req.body;
		const name = await userData.get(bodyData.email);
		if (name) {
			return res
				.status(200)
				.json({ success: false, msg: "User already exists!" });
		} else {
			await userData.create(
				bodyData.name,
				bodyData.email,
				bodyData.salt,
				bodyData.hash
			);

			return res
				.status(200)
				.json({ success: true, msg: "Account Created Successfully." });
		}
	} catch (err) {
		console.log(err);
		next({ status: 400, message: "failed to post!!" });
	}
});

// POST request for getting the salt of the user generated while signing up
app.post("/get-salt", async (req, res, next) => {
	try {
		const bodyData = req.body;
		const user = await userData.get(bodyData.email);

		if (user) {
			return res.status(200).json({ salt: user.salt, exists: true });
		}
		return res
			.status(200)
			.json({ exists: false, msg: "User doesn't exists!!" });
	} catch (err) {
		console.log(err);
		next({ status: 400, message: "failed to post!!" });
	}
});

// POST request for checking and autheticating the password
app.post("/check-password", async (req, res, next) => {
	try {
		const bodyData = req.body;
		const user = await userData.checkPassword(
			bodyData.email,
			bodyData.password
		);

		if (user.length > 0) {
			await userData.resetWrongAttempt(bodyData.email);
			next({ status: 200, message: bodyData.email + " Logged In!" });
			return res
				.status(200)
				.json({ authorized: true, email: bodyData.email });
		} else {
			const attempts = await userData.increaseWrongAttempt(
				bodyData.email
			);

			if (attempts.wrong > 2) {
				//Send otp to email
			}

			next({ status: 200, message: "Wrong Password!" });
			return res.status(200).json({
				authorized: false,
				msg:
					"Wrong Email or Password! Only " +
					(2 - attempts.wrong) +
					" attempt(s) left.",
			});
		}
	} catch (err) {
		console.log(err);
		next({ status: 400, message: "failed to post!!" });
	}
});

module.exports = app;
