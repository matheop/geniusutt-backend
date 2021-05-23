const { validationResult } = require("express-validator");
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
			email: user.email,
			userId: user._id.toString(),
		};

		const token = jwt.sign(payload, "secretkey-magl", {
			expiresIn: "48h", // TODO: change expiration
		});

		res.status(200).json({ token, payload });
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
