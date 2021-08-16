const fs = require("fs");
const { validationResult } = require("express-validator");

const appDir = require("../utils/path");
const Event = require("../models/event");
const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = async (req, res, next) => {
	try {
		const events = await Event.find();
		if (!events) throw errorHandler("No event found.", 404);
		res.status(200).json({
			message: "Events fetched successfully",
			events,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// GET
exports.getOneById = async (req, res, next) => {
	const id = req.params.eventId;
	try {
		const event = await Event.findById(id);

		if (!event) throw errorHandler("No event found.", 404);
		res.status(200).json({
			message: "Event fetched successfully",
			event,
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
			requiredFields: ["name", "date", "schedule", "desc"],
			errors: errors.array(),
		});
	}

	if (!req.file) throw errorHandler("No image found.", 422);

	const { name, date, schedule, place, desc } = req.body;
	const imgUrl = req.file.path;

	const event = new Event({
		name,
		date,
		schedule,
		place,
		desc,
		imgUrl,
	});

	try {
		const result = await event.save();

		res.status(201).json({
			message: "Event created successfully!",
			event: result,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// PUT
exports.update = async (req, res, next) => {
	const id = req.params.eventId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: "",
			errors: errors.array(),
		});
	}

	try {
		const event = await Event.findById(id);

		if (!event) throw errorHandler("No event found.", 404);

		event.name = req.body.name;
		event.date = req.body.date;
		event.schedule = req.body.schedule;
		event.place = req.body.place;
		event.desc = req.body.desc;
		if (req.file) {
			fs.unlink(`${appDir}/${event.imgUrl}`, (err) => {
				if (err) {
					console.log("err:", err);
				}
			});
			event.imgUrl = req.file.path;
		}

		result = await event.save();

		res.status(200).json({
			message: "Event successfully updated",
			event: result,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// DELETE
exports.delete = async (req, res, next) => {
	const id = req.params.eventId;

	try {
		const event = await Event.findByIdAndDelete(id);
		if (!event) throw errorHandler("No event found.", 404);
		fs.unlink(`${appDir}/${event.imgUrl}`, (err) => {
			if (err) {
				console.log("err:", err);
			}
		});

		res.status(200).json({
			success: true,
			message: "Event deleted successfully",
			deletedMember: event,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
