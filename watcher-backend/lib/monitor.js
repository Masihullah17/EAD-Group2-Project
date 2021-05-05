var fs = require("fs");
var util = require("./util");
const { notifications, sites } = require("../data/Data");
var Site = require("./site");

module.exports = async function () {
	//Sites
	var sitesData = await sites.findAll();
	var sitesToCheck = [];
	var lastCheck = new Date();

	//Add each site in the config into the array
	sitesData.forEach(function (siteConfig, index) {
		sitesToCheck.push(new Site(siteConfig, index));
	});

	//Run the checks
	var runChecks = function (numRun) {
		util.asyncForEach(
			sitesToCheck,
			function (site) {
				//Check the site requires a check
				if (site.requiresCheck()) {
					console.log("Watching: " + site.url);
					site.check(numRun, async function (stats) {
						//Up down
						var up_down = false;

						//Check for different situations
						if (site.isDown() && !site.wasDown()) {
							console.log(
								"Watching: " +
									site.url +
									" - The Site is DOWN!!"
							);
							await notifications.update(
								site.uid,
								false,
								"The Site is DOWN!!"
							);
							up_down = "down";
						} else if (!site.isDown() && site.wasDown()) {
							//Site is up and was down
							console.log(
								"Watching: " + site.url + " - The Site is UP!!"
							);
							await notifications.update(
								site.uid,
								true,
								"The Site is UP!!"
							);
							up_down = "up";
						} else if (site.isDown() && site.wasDown()) {
							//Site still down
							console.log(
								"Watching: " +
									site.url +
									" - The Site is still DOWN!!"
							);
							await notifications.update(
								site.uid,
								false,
								"The Site is still DOWN!!"
							);
						} else {
							//All is good in the hood
							console.log(
								"Watching: " + site.url + " - ALL GOOD!!"
							);
							await notifications.update(
								site.uid,
								true,
								"ALL GOOD!!"
							);
						}

						//Only carry on if the stats of the site has changed
						if (up_down !== false) {
							//Check one more time after a half second delay
							setTimeout(
								function () {
									site.check(
										numRun,
										async function (stats) {
											//Stats is the same as previous check
											if (
												site.isDown() === site.wasDown()
											) {
												// DO something
											} else {
												//Log the false alarm!
												console.log(
													"Watching: " +
														site.url +
														" - FALSE ALARM!"
												);
												await notifications.update(
													site.uid,
													false,
													"FALSE ALARM"
												);
											}
										}.bind(this)
									);
								}.bind(this),
								500
							);
						}
					});
				}
			},
			function () {}
		);
	};

	//Run the first check now
	runChecks(1);

	//Run further checks
	setInterval(async function () {
		sitesData = await sites.findByTime(lastCheck);

		sitesData.forEach(function (siteConfig, index) {
			sitesToCheck.push(new Site(siteConfig, index));
		});

		lastCheck = new Date();

		runChecks(2);
	}, 10 * 1000);
};
