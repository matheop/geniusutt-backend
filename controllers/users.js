const { validationResult } = require("express-validator");

const User = require("../models/user");
const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = async (req, res, next) => {
	try {
		const users = await User.find();
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
		const user = await User.findById(id);

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
exports.create = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: ["name", "email", "role"],
			errors: errors.array(),
		});
	}

	const { name, email, role } = req.body;

	const user = new User({
		name: name,
		email: email,
		role: role,
	});

	try {
		const result = await user.save();

		res.status(201).json({
			message: "User created successfully!",
			user: result,
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
