const express = require("express");
const path = require("path");
const router = require("./router");
const functions = require("./functions");
function iniciar(port) {
	var app = express();
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.set("views", __dirname + "/views");
	app.set("view engine", "pug");
	app.use(express.static(path.join(__dirname, "public")));
	app.listen(port, function () {
		console.log("Server listen localhost:" + port);
	});
	app.get("/", router.index);
	app.get("/webhook", function (req, res) {
		if (req.query["hub.verify_token"] === "QCTOKEN9901") {
			res.send(req.query["hub.challenge"]);
		} else {
			res.send("Tu no tienes que entrar aqui");
		}
	});

	app.post("/webhook", function (req, res) {
		var data = req.body;
		//console.log(JSON.stringify(req.body, null, 2));
		if (data.object == "page") {
			data.entry.forEach(function (pageEntry) {
				pageEntry.messaging.forEach(function (messagingEvent) {
					if (messagingEvent.message) {
						functions.getMessage(messagingEvent);
					}
				});s
			});
		}
		if (data.object == "whatsapp_business_account") {
			data.entry.forEach(function (messagingEvent) {
				if (messagingEvent.changes[0].value.messages) {
					functions.getMessageWP(messagingEvent);
				}
			});
		}
		res.sendStatus(200);
	});
}
exports.iniciar = iniciar;