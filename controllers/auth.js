require("dotenv").config();
const cookie = require("cookie");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let generator = require("generate-password");

const User = require("../models/user");
const { error500, errorHandler } = require("../utils/error");

// PUT
exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: ["name", "email", "role"],
			errors: errors.array(),
		});
	}

	const { email, name, role } = req.body;

	try {
		const password = generator.generate({
			numbers: true,
			symbols: true,
			strict: true,
			exclude: '"',
		});

		const hashedPwd = await bcrypt.hash(password, 12);

		const user = new User({
			email,
			password: hashedPwd,
			name,
			role,
		});

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "matheo.pierini.pro@gmail.com",
				pass: "S@9p!t7R&13or",
			},
		});
		transporter.verify().then(console.log).catch(console.error);

		const mail = `
        Salut, ${name} !<br /><br />
        Voici ton mot de passe pour pouvoir accéder à ton espace admin.<br /><br />
        Mot de passe : <strong>${password}</strong> <br />
        `;

		const mailOptions = {
			from: "matheo.pierini.pro@gmail.com",
			to: email,
			subject: "Website: Nouvelle prise de contact",
			html: mail,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});

		const result = await user.save();

		res.status(201).json({
			success: true,
			message: "User successfully created",
			userId: result._id,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// POST
exports.login = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: ["email", "password"],
			errors: errors.array(),
		});
	}

	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) throw errorHandler("No user found.", 401);

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) throw errorHandler("Wrong IDs.", 401);

		const payload = {
			user: await User.findOne({ email }).select("-password"),
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "4h", // TODO: change expiration
		});

		var expiryDate = new Date();
		expiryDate.setHours(expiryDate.getHours() + 1);

		const tokenCookie = cookie.serialize("token", token, {
			maxAge: 60 * 60 * 4, // 4 hours
		});

		// To Write a Cookie
		res.writeHead(200, {
			"Set-Cookie": tokenCookie,
			"Content-Type": "text/plain",
		});

		res.end(JSON.stringify({ token, payload }));
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
