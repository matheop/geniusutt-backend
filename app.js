const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const boardMembersRoutes = require("./routes/board-members");
const formsRoutes = require("./routes/contacts");
const eventsRoutes = require("./routes/events");

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE, HEAD"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Headers", "*");
	next();
});

app.use("/auth", authRoutes);

app.use("/users", usersRoutes);
app.use("/board-members", boardMembersRoutes);
app.use("/contacts", formsRoutes);
app.use("/events", eventsRoutes);

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message, data });
});

mongoose
	.connect(
		"mongodb+srv://matheop:Tf1aP8s2U7bhOZML@cluster0.0ihgb.mongodb.net/genius-utt?authSource=admin&replicaSet=atlas-jkg9wq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		app.listen(PORT, HOST, () => {
			console.log(`Server running at http://${HOST}:${PORT}/`);
		});
	})
	.catch((err) => console.log(err));
