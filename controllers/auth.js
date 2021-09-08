require("dotenv").config();
const cookie = require("cookie");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { error500, errorHandler } = require("../utils/error");

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
			expiresIn: "24h",
		});

		var expiryDate = new Date();
		expiryDate.setHours(expiryDate.getHours() + 1);

		const tokenCookie = cookie.serialize("token", token, {
			maxAge: 60 * 60 * 24, // 24 hours
			// httpOnly: true,
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
