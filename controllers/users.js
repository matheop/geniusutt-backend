require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
let generator = require("generate-password");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_API_KEY);

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
		const userAlreadyExists = await User.findOne({ email });
		if (!!userAlreadyExists)
			throw errorHandler("User already exists.", 409);

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

		const mail = `
        Salut, ${name} !
        <br /><br />
        Voici ton mot de passe pour pouvoir accéder à ton espace admin : #ADD_URL
        <br /><br />
        Mot de passe : <strong>${password}</strong> <br />
        `;

		const mailOptions = {
			from: "matheo.pierini.pro@gmail.com",
			to: email,
			subject: "Genius UTT – identifiants",
			html: mail,
		};

		sgMail.send(mailOptions);
		res.status(201).json({
			success: true,
			message: "User successfully created",
			user: { name, email, role, _id: result._id },
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

	const email = req.body.email;

	try {
		const user = await User.findById(id).select("-password");

		if (email !== user.email) {
			const userAlreadyExists = await User.findOne({ email });
			if (!!userAlreadyExists)
				throw errorHandler("User already exists.", 409);
		}

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
			deletedUser: user,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// PASSWORD
exports.changePassword = async (req, res, next) => {
	const id = req.params.userId;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	try {
		if (req.userId !== id) throw errorHandler("Not allowed", 403);

		const user = await User.findById(id);
		if (!user) throw errorHandler("No user found.", 404);

		const isEqual = await bcrypt.compare(
			oldPassword,
			user.password
		);

		if (isEqual) {
			if (oldPassword !== newPassword) {
				const newHashedPass = await bcrypt.hash(
					newPassword,
					12
				);
				user.password = newHashedPass;

				result = await user.save();

				res.status(200).json({
					success: true,
					message: "Password successfully updated",
					userId: result._id,
				});
			} else {
				throw errorHandler(
					"New and old passwords are identical",
					401
				);
			}
		} else {
			throw errorHandler("Wrong password", 401);
		}
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
