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
	if (!errors.isEmpty()) throw errorHandler("Invalid data.", 422);

	const name = req.body.name;
	const email = req.body.email;
	const role = req.body.role;

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

// PATCH
exports.update = (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const role = req.body.role;

	// TODO: find & update user in DB
	const id = "hey";

	res.status(200).json({
		message: "User updated successfully",
		user: {
			id: id,
			name: name,
			email: email,
			role: role,
		},
	});
};

// DELETE
exports.delete = (req, res) => {
	const id = req.body._id;

	if (id === "wazaaa")
		res.status(200).json({
			message: "User deleted successfully",
			user: {
				id: "id",
				name: "name",
				email: "email",
				role: "role",
			},
		});
	else
		throw res.status(500).json({
			message: "Bad request: id not found",
		});
};
