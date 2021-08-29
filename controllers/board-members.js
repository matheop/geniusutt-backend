const fs = require("fs");

const { validationResult } = require("express-validator");
const BoardMember = require("../models/board-member");
const { error500, errorHandler } = require("../utils/error");
const appDir = require("../utils/path");

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

	if (!req.file) throw errorHandler("No image found.", 422);

	const { name, position, shortDesc, longDesc, linkedin } =
		req.body;
	const imgUrl = req.file.path;

	const member = new BoardMember({
		name,
		position,
		shortDesc,
		longDesc,
		linkedin,
		imgUrl,
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

		if (req.file) {
			fs.unlink(`${appDir}/${member.imgUrl}`, (err) => {
				if (err) {
					console.log("err:", err);
				}
			});
			member.imgUrl = req.file.path;
		}

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
		fs.unlink(`${appDir}/${member.imgUrl}`, (err) => {
			if (err) {
				console.log("err:", err);
			}
		});

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
