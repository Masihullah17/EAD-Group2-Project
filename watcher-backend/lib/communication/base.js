var events = require("events");
var util = require("util");
var http = require("http");
var Url = require("url");

//Mailer
var nodemailer = require("nodemailer");

/**
 * Base communication
 *
 * @param config Object the configuration
 *
 * @returns Site
 */
function BaseCommunication(user, config, baseConfig) {
	events.EventEmitter.call(this);

	//User
	this.user = user;

	//The config
	this.config = config;

	//The base config
	this.baseConfig = baseConfig;
}

//Inherit event emitter
util.inherits(BaseCommunication, events.EventEmitter);

//Export
module.exports = BaseCommunication;

/**
 * Can send
 *
 * @returns void
 */
BaseCommunication.prototype.toArray = function () {
	return { user: this.user, config: this.config };
};

/**
 * Can send
 *
 * @returns void
 */
BaseCommunication.prototype.isAllowed = function () {
	return true;
};

/**
 * Log success
 *
 * @returns void
 */
BaseCommunication.prototype.send = function (
	body,
	htmlBody,
	subject,
	callback
) {
	// send an e-mail

	//Get the transport
	var transport = nodemailer.createTransport("SMTP", {
		service: this.baseConfig.email.service,
		auth: {
			user: this.baseConfig.email.username,
			pass: this.baseConfig.email.password,
		},
	});

	var mailOptions = {
		transport: transport,
		from: "Site Alert <" + this.baseConfig.email.sender + ">",
		to: this.config.address,
		subject: subject,
		text: body,
		html: htmlBody,
	};

	nodemailer.sendMail(mailOptions, function (error) {
		if (error) {
			callback(false, error);
		} else {
			callback(true);
		}
	});
};
