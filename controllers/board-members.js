const { validationResult } = require("express-validator");

const BoardMember = require("../models/board-members");

const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = (req, res, next) => {
	BoardMember.find()
		.then((members) => {
			if (!members) throw errorHandler("No member found.", 404);
			res.status(200).json({
				message: "BoardMember fetched successfully",
				members,
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
	BoardMember.findById(id)
		.then((member) => {
			if (!member) throw errorHandler("No member found.", 404);
			res.status(200).json({
				message: "BoardMember fetched successfully",
				member,
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
			requiredFields: [
				"name",
				"position",
				"shortDesc",
				"longDesc",
				"linkedin",
			],
			errors: errors.array(),
		});
	}

	const { name, position, shortDesc, longDesc, linkedin } =
		req.body;

	const member = new BoardMember({
		name: name,
		position: position,
		shortDesc: shortDesc,
		longDesc: longDesc,
		linkedin: linkedin,
	});

	member
		.save()
		.then((result) => {
			res.status(201).json({
				message: "BoardMember created successfully!",
				member: result,
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

	BoardMember.findById(id)
		.then((member) => {
			if (!member) throw errorHandler("No member found.", 404);

			member.name = req.body.name;
			member.position = req.body.position;
			member.shortDesc = req.body.shortDesc;
			member.longDesc = req.body.longDesc;
			member.linkedin = req.body.linkedin;

			return member.save();
		})
		.then((member) => {
			res.status(200).json({
				message: "BoardMember successfully updated",
				member,
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

	BoardMember.findByIdAndDelete(id)
		.then((member) => {
			if (!member) throw errorHandler("No member found.", 404);
		})
		.then(() => {
			res.status(200).json({
				message: "BoardMember deleted successfully",
			});
		})
		.catch((error) => {
			const err = error500(error);
			next(err);
		});
};
