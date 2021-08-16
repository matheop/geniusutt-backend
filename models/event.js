const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {
	dateValidator,
	scheduleValidator,
} = require("../utils/regex");

const eventSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		validate: dateValidator,
		required: true,
	},
	schedule: {
		type: String,
		validate: scheduleValidator,
	},
	place: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: String,
	},
	eventUrl: {
		type: String,
	},
});

module.exports = mongoose.model("Event", eventSchema);
