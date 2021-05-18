const { validationResult } = require("express-validator");

const User = require("../models/user");
const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = (req, res, next) => {
	User.find()
		.then((users) => {
			if (!users) throw errorHandler("No user found.", 404);
			res.status(200).json({
				message: "Users fetched successfully",
				users,
			});
		})
		.catch((error) => {
			const err = error500(error);
			next(err);
		});
};

// GET
exports.getOneById = (req, res, next) => {
	const id = req.params.userId;
	User.findById(id)
		.then((user) => {
			if (!user) throw errorHandler("No user found.", 404);
			res.status(200).json({
				message: "User fetched successfully",
				user,
			});
		})
		.catch((error) => {
			const err = error500(error);
			next(err);
		});
};

// POST
exports.create = (req, res) => {
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

	user.save()
		.then((result) => {
			res.status(201).json({
				message: "User created successfully!",
				user: result,
			});
		})
		.catch((error) => {
			const err = error500(error);
			next(err);
		});
};

// PUT
exports.update = (req, res, next) => {
	const id = req.params.userId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: "",
			errors: errors.array(),
		});
	}

	User.findById(id)
		.then((user) => {
			if (!user) throw errorHandler("No user found.", 404);

			user.name = req.body.name;
			user.email = req.body.email;
			user.role = req.body.role;

			return user.save();
		})
		.then((user) => {
			res.status(200).json({
				message: "User successfully updated",
				user,
			});
		})
		.catch((error) => {
			const err = error500(error);
			next(err);
		});
};

// DELETE
exports.delete = (req, res, next) => {
	const id = req.params.userId;

	User.findByIdAndDelete(id)
		.then((user) => {
			if (!user) throw errorHandler("No user found.", 404);
		})
		.then(() => {
			res.status(200).json({
				message: "User deleted successfully",
			});
		})
		.catch((error) => {
			const err = error500(error);
			next(err);
		});
};
