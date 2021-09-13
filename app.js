const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const boardMembersRoutes = require("./routes/board-members");
const formsRoutes = require("./routes/contacts");
const eventsRoutes = require("./routes/events");

// File related
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		const name = req.body.name
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, ""); // remove accent
		let filename = name.replace(/ |\//g, "-"); // remove spaces & /
		if (!!req.body.date) filename = `event-${filename}`;
		else filename = `boardmember-${filename}`;
		cb(
			null,
			`${filename}-${Math.floor(Math.random() * 1001)}.${
				file.mimetype.split("/")[1]
			}`
		);
	},
});
const fileFilter = (req, file, cb) => {
	["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)
		? cb(null, true)
		: cb(null, false);
};

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const MONGO_PASS = process.env.MONGO_PASS;

app.use((req, res, next) => {
	res.setHeader(
		"Access-Control-Allow-Origin",
		"http://localhost:3000"
	);
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Expose-Headers", "Authorization");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Accept, Content-Type, Authorization, Access-Control-Allow-Origin"
	);
	next();
});

app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage, fileFilter }).single("image")); // files

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
		`mongodb+srv://matheop:${MONGO_PASS}@cluster0.0ihgb.mongodb.net/genius-utt?authSource=admin&replicaSet=atlas-jkg9wq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		}
	)
	.then(() => {
		app.listen(PORT, HOST, () => {
			console.log(`Server running at http://${HOST}:${PORT}/`);
		});
	})
	.catch((err) => console.log(err));
