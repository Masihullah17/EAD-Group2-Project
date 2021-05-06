var Rembrandt = require("rembrandt");
var events = require("events");
var util = require("util");
var http = require("http");
var https = require("https");
var Url = require("url");
var nodeHtmlParser = require("node-html-parser");
const { statusOfSites, userData } = require("../data/Data");
var communications = require("./communication");
var commsClass = communications.findByType("email");
require("dotenv").config();

function Site(config, id) {
	events.EventEmitter.call(this);

	//The ID
	this.id = id;

	this.uid = config.uid;

	//The name
	this.name = config.name;

	this.username = config.username;

	//Url
	this.url =
		config.url.substr(0, 4) === "http"
			? config.url
			: "https://" + config.url;

	//Content
	this.content =
		config.content !== undefined && config.content.length > 0
			? config.content
			: null;

	// Element
	this.element =
		config.element !== undefined && config.element.length > 0
			? config.element
			: null;
	this.elementAttr =
		config.elementAttr !== undefined && config.elementAttr.length > 0
			? config.elementAttr
			: null;
	this.elementContent =
		config.elementContent !== undefined && config.elementContent.length > 0
			? config.elementContent
			: null;
	this.elementChange = config.elementChange === "false" ? false : true;

	// Image
	this.imageChange =
		config.imageChange !== undefined && config.imageChange.length > 0
			? config.imageChange
			: null;

	//Interval
	this.interval = config.interval;

	//Timeout
	this.timeout = config.timeout;

	//Last run
	this.lastRun = 0;

	//Is down
	this.down = false;

	//Previous down
	this.previousDown = true;

	this.mail = new commsClass(
		{ username: config.username },
		{ type: "email", address: config.username },
		{
			sender: process.env.SENDER,
			service: process.env.SERVICE,
			username: process.env.USERNAME,
			password: process.env.PASSWORD,
		}
	);
}

//Inherit event emitter
util.inherits(Site, events.EventEmitter);

//Export
module.exports = Site;

Site.prototype.wasDown = function () {
	return this.previousDown;
};

Site.prototype.isDown = function () {
	return this.down;
};

Site.prototype.requiresCheck = function () {
	if (this.lastRun + this.interval * 1000 < new Date().getTime()) {
		return true;
	}
	return false;
};

Site.prototype.check = function (numRun, callback) {
	//Make the request and then decide if the result was success or failure
	this.request(
		numRun,
		function (stats) {
			//Set the preview down status
			this.previousDown = this.down ? true : false;

			//Check status
			if (
				stats.statusCode !== 304 &&
				(stats.statusCode < 200 || stats.statusCode > 299)
			) {
				//Not a good status code
				this.down = true;
				stats.notes = "A non 304 or 2XX status code";
			}

			//Callback
			callback(stats);
		}.bind(this)
	);
};

var fs = require("fs"),
	request = require("request");

var download = async function (uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
	});
};

Site.prototype.request = async function (numRun, callback) {
	//Set the last run
	this.lastRun = new Date().getTime();

	//Keep the request meta data with the request
	var stats = {
		startTime: new Date().getTime(),
		connectTime: 0,
		responseTime: 0,
		connectTimeout: false,
		connectFailed: false,
		contentMatched: null,
		elementMatched: null,
		request: null,
		response: null,
		body: null,
		parsed: null,
		statusCode: null,
		notes: "",
		numRun: numRun,
		done: false,
	};

	//Create the request
	var url = Url.parse(this.url);
	var httpModule = http;
	if (url.protocol.substr(0, 5) === "https") {
		httpModule = https;
		url.port = url.port ? url.port : 443;
	} else {
		url.port = url.port ? url.port : 80;
	}

	var request = httpModule.request(
		{
			port: url.port,
			host: url.host,
			path: url.path,
			headers: {
				"User-Agent": "node-site-monitor/0.1.0",
			},
			method: "GET",
			agent: false,
		},
		function (response) {
			//Response
			stats.response = response;

			//Status code
			stats.statusCode = response.statusCode;

			//Set the response time
			stats.connectTime = (new Date().getTime() - stats.startTime) / 1000;

			//Clear the request timeout
			clearTimeout(connectTimeout);
			request.connectTimeout = null;

			//Collect the body
			var body = "";
			response.on("data", function (chunk) {
				body += chunk.toString("utf8");
			});

			//Respond with whole body
			response.on(
				"end",
				async function () {
					stats.body = body;
					stats.parsed = nodeHtmlParser.parse(body);
					stats.responseTime =
						(new Date().getTime() - stats.startTime) / 1000;

					//Check the content matched
					if (this.content !== null) {
						if (stats.body.indexOf(this.content) >= 0) {
							stats.contentMatched = true;
						} else {
							stats.contentMatched = false;

							await statusOfSites.update(this.uid, {
								uid: this.uid,
								contentChanged: true,
								lastChecked: this.lastRun,
							});

							var user = await userData.get(this.username);

							var rawBody = "Hello " + user.name + "," + "\n\n";
							var htmlBody =
								"<p><strong>Hello " +
								user.name +
								",</strong></p>";

							rawBody +=
								"Your website watch request for " +
								this.url +
								" has an update.\n\nGiven content " +
								this.content +
								" has changed.";
							htmlBody +=
								"<li>Your website watch request for <strong>" +
								this.url +
								"</strong> has an update.</li><br/><br/><li>Given content <strong>" +
								this.content +
								"</strong> has changed.</li>";

							htmlBody += "</ul><p>Best<br />Watcher</p>";
							rawBody += "\nBest\nWatcher";

							var subject =
								"Content Update on " + this.name + "!!";
							this.mail.send(
								rawBody,
								htmlBody,
								subject,
								(s) => {}
							);

							stats.done = true;

							stats.notes =
								'The site content did not contain the string: "' +
								this.content +
								'" ';
						}
					}

					if (this.element !== null) {
						var elements = stats.parsed.querySelectorAll(
							this.element
						);
						if (
							this.elementContent !== null ||
							this.elementAttr !== null
						) {
							var found = false;
							var elementAttr = this.elementAttr;
							var elementContent = this.elementContent;
							Array.prototype.filter.call(
								elements,
								function (element) {
									found =
										found ||
										RegExp(elementAttr).test(
											JSON.stringify(element.attributes)
										) ||
										RegExp(elementContent).test(
											element.textContent
										);
								}
							);

							if (!found) {
								stats.elementMatched = false;
								stats.notes += "The site element did not match";
								await statusOfSites.update(this.uid, {
									uid: this.uid,
									elementChanged: true,
									lastChecked: this.lastRun,
								});

								var user = await userData.get(this.username);

								var rawBody =
									"Hello " + user.name + "," + "\n\n";
								var htmlBody =
									"<p><strong>Hello " +
									user.name +
									",</strong></p>";

								rawBody +=
									"Your website watch request for " +
									this.url +
									" has an update.\n\nGiven element " +
									this.element +
									" has changed.";
								htmlBody +=
									"<li>Your website watch request for <strong>" +
									this.url +
									"</strong> has an update.</li><br/><br/><li>Given element <strong>" +
									this.element +
									"</strong> has changed.</li>";

								htmlBody += "</ul><p>Best<br />Watcher</p>";
								rawBody += "\nBest\nWatcher";

								var subject =
									"Content Update on " + this.name + "!!";
								this.mail.send(
									rawBody,
									htmlBody,
									subject,
									(s) => {}
								);
								stats.done = true;
							} else {
								stats.elementMatched = true;
							}
						} else if (this.elementChange) {
							if (stats.numRun == 1) {
								// Save elements in the database
								await statusOfSites.update(this.uid, {
									uid: this.uid,
									elementData: JSON.stringify(elements),
									lastChecked: this.lastRun,
								});
							} else {
								// Compare with the elements present in the database
								var storedElements = await statusOfSites.findByUid(
									{ uid: this.uid }
								);
								if (
									storedElements !== JSON.stringify(elements)
								) {
									await statusOfSites.update(this.uid, {
										uid: this.uid,
										elementChanged: true,
										lastChecked: this.lastRun,
									});
								}
							}
						}
					}

					if (this.imageChange !== null) {
						var image = stats.parsed.querySelector(
							this.imageChange
						);

						if (stats.numRun === 1) {
							// Save elements in the database
						} else {
							download(
								"https:" + image.attributes.src,
								"temp2." + image.attributes.src.split(".")[-1],
								function () {}
							);

							// Compare with the elements present in the database
							stats.notes += "Here ";
							const rembrandt = new Rembrandt({
								imageA: "temp.png",
								imageB: "temp2.png",

								thresholdType: Rembrandt.THRESHOLD_PERCENT,

								maxThreshold: 0.01,

								maxDelta: 20,

								maxOffset: 0,

								renderComposition: true,
								compositionMaskColor: Rembrandt.Color.RED,
							});

							const result = await rembrandt
								.compare()
								.then((result) => {
									return result.passed;
								})
								.catch((e) => {
									return e;
								});

							stats.notes += result;

							if (!result) {
								await statusOfSites.update(this.uid, {
									uid: this.uid,
									imageChanged: true,
									lastChecked: this.lastRun,
								});
								var user = await userData.get(this.username);

								var rawBody =
									"Hello " + user.name + "," + "\n\n";
								var htmlBody =
									"<p><strong>Hello " +
									user.name +
									",</strong></p>";

								rawBody +=
									"Your website watch request for " +
									this.url +
									" has an update.\n\nGiven image " +
									this.imageChange +
									" has changed.";
								htmlBody +=
									"<li>Your website watch request for <strong>" +
									this.url +
									"</strong> has an update.</li><br/><br/><li>Given imageChange <strong>" +
									this.imageChange +
									"</strong> has changed.</li>";

								htmlBody += "</ul><p>Best<br />Watcher</p>";
								rawBody += "\nBest\nWatcher";

								var subject =
									"Content Update on " + this.name + "!!";
								this.mail.send(
									rawBody,
									htmlBody,
									subject,
									(s) => {}
								);
								stats.done = true;
							}
						}
					}

					callback(stats);
				}.bind(this)
			);
		}.bind(this)
	);

	stats.request = request;

	//Create the response timeout timer
	var connectTimeout = setTimeout(
		function () {
			request.abort();
			stats.connectTimeout = true;
			stats.connectFailed = true;
			callback(stats);
		}.bind(this),
		this.timeout * 1000
	);

	//Attach error handlers
	request.on("error", function (err) {
		//Connection error
		stats.connectFailed = true;
		clearTimeout(connectTimeout);
		callback(stats);
	});

	//End the request and start receiving the response
	request.end();
};
