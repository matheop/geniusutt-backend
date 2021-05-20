const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
let generator = require("generate-password");

const User = require("../models/user");
const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = async (req, res, next) => {
	try {
		const users = await User.find().select("-password");
		if (!users) throw errorHandler("No user found.", 404);
		res.status(200).json({
			message: "Users fetched successfully",
			users,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// GET
exports.getOneById = async (req, res, next) => {
	const id = req.params.userId;
	try {
		const user = await User.findById(id).select("-password");

		if (!user) throw errorHandler("No user found.", 404);

		res.status(200).json({
			message: "User fetched successfully",
			user,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// POST
exports.create = async (req, res, next) => {
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
		});
		const hashedPwd = bcrypt.hash(password, 12);

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

// PUT
exports.update = async (req, res, next) => {
	const id = req.params.userId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: "",
			errors: errors.array(),
		});
	}

	try {
		const user = await User.findById(id);

		if (!user) throw errorHandler("No user found.", 404);

		user.name = req.body.name;
		user.email = req.body.email;
		user.role = req.body.role;

		result = await user.save();

		res.status(200).json({
			message: "User successfully updated",
			user: result,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// DELETE
exports.delete = async (req, res, next) => {
	const id = req.params.userId;

	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) throw errorHandler("No user found.", 404);
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
			deletedMember: user,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
