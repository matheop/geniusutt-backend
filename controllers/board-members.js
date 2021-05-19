const { validationResult } = require("express-validator");

const BoardMember = require("../models/board-members");

const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = async (req, res, next) => {
	try {
		const members = await BoardMember.find();
		if (!members) throw errorHandler("No member found.", 404);
		res.status(200).json({
			success: true,
			message: "BoardMember fetched successfully",
			members,
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
		const member = await BoardMember.findById(id);
		if (!member) throw errorHandler("No member found.", 404);
		res.status(200).json({
			success: true,
			message: "BoardMember fetched successfully",
			member,
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

	try {
		const result = await member.save();
		res.status(201).json({
			success: true,
			message: "BoardMember created successfully!",
			member: result,
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
		const member = await BoardMember.findById(id);

		if (!member) throw errorHandler("No member found.", 404);

		member.name = req.body.name;
		member.position = req.body.position;
		member.shortDesc = req.body.shortDesc;
		member.longDesc = req.body.longDesc;
		member.linkedin = req.body.linkedin;

		const result = await member.save();
		res.status(200).json({
			success: true,
			message: "BoardMember successfully updated",
			member: result,
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
		const member = await BoardMember.findByIdAndDelete(id);

		if (!member) throw errorHandler("No member found.", 404);

		res.status(200).json({
			success: true,
			message: "BoardMember deleted successfully",
			deletedMember: member,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
