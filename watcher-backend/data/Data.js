const {
	userData,
	sites,
	statusOfSites,
	notifications,
} = require("../models/Schemas");
var ObjectId = require("mongodb").ObjectID;

class UserData {
	constructor(model) {
		this.model = model;
	}

	create(name, email, salt, password) {
		const newProfile = { name, email, salt, password };
		const person = new this.model(newProfile);
		return person.save();
	}

	checkPassword(email, password) {
		return this.model.find({ email: email, password: password });
	}

	changePassword(email, newPassword) {
		return this.model.findOneAndUpdate(
			{ email },
			{ email: email, password: newPassword }
		);
	}

	get(email) {
		return this.model.findOne({ email: email });
	}

	increaseWrongAttempt(email) {
		return this.model.findOneAndUpdate(
			{ email: email },
			{ $inc: { wrong: 1 } }
		);
	}

	resetWrongAttempt(email) {
		return this.model.findOneAndUpdate({ email: email }, { wrong: 0 });
	}
}

class Site {
	constructor(model) {
		this.model = model;
	}

	create(
		uid,
		username,
		name,
		url,
		content,
		element,
		elementAttr,
		elementContent,
		elementChange,
		imageChange,
		interval,
		timeout,
		notifyId,
		ip
	) {
		const newSite = {
			uid,
			username,
			name,
			url,
			content,
			element,
			elementAttr,
			elementContent,
			elementChange,
			imageChange,
			interval,
			timeout,
			notifyId,
			ip,
		};
		const site = new this.model(newSite);
		return site.save();
	}

	findAll() {
		return this.model.find();
	}

	findByTime(time) {
		var startOfToday = time;
		var _id =
			Math.floor(startOfToday.getTime() / 1000).toString(16) +
			"0000000000000000";
		return this.model.find({ _id: { $gte: ObjectId(_id) } });
	}

	findByUid(searchUid) {
		return this.model.find({ uid: searchUid });
	}

	findByUsername(uname) {
		return this.model.find({ username: uname });
	}

	findByIP(ip) {
		var startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		var _id =
			Math.floor(startOfToday.getTime() / 1000).toString(16) +
			"0000000000000000";

		return this.model
			.find({ ip: ip, _id: { $gte: ObjectId(_id) } })
			.countDocuments();
	}

	findBySubnetIP2(ip) {
		var startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		var _id =
			Math.floor(startOfToday.getTime() / 1000).toString(16) +
			"0000000000000000";

		return this.model
			.find({
				username: {
					$regex:
						ip.substring(
							0,
							ip.indexOf(".", ip.indexOf(".") + 1) + 1
						) + "*",
				},
				_id: { $gte: ObjectId(_id) },
			})
			.countDocuments();
	}

	findBySubnetIP3(ip) {
		var startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		var _id =
			Math.floor(startOfToday.getTime() / 1000).toString(16) +
			"0000000000000000";

		return this.model
			.find({
				username: {
					$regex:
						ip.substring(
							0,
							ip.indexOf(
								".",
								ip.indexOf(".", ip.indexOf(".") + 1) + 1
							) + 1
						) + "*",
				},
				_id: { $gte: ObjectId(_id) },
			})
			.countDocuments();
	}
}

class Status {
	constructor(model) {
		this.model = model;
	}

	create(uid) {
		const newStatus = { uid };
		const status = new this.model(newStatus);
		return status.save();
	}

	update(uid, data) {
		return this.model.findOneAndUpdate({ uid }, data, { upsert: true });
	}

	findAll() {
		return this.model.find();
	}

	findByUid(searchUid) {
		return this.model.find({ uid: searchUid });
	}
}

class Notification {
	constructor(model) {
		this.model = model;
	}

	create(uid, success, message) {
		const newNotification = { uid, success, message };
		const notification = new this.model(newNotification);
		return notification.save();
	}

	update(uid, success, message) {
		return this.model.findOneAndUpdate(
			{ uid },
			{ uid, success, message },
			{ upsert: true }
		);
	}

	findAll() {
		return this.model.find();
	}

	findByUid(searchUid) {
		return this.model.find({ uid: searchUid });
	}
}

module.exports = {
	userData: new UserData(userData),
	sites: new Site(sites),
	statusOfSites: new Status(statusOfSites),
	notifications: new Notification(notifications),
};
