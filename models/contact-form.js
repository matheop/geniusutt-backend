const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactFormSchema = new Schema({
	lastname: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	organization: {
		type: String,
	},
	subject: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	contacted: {
		type: Boolean,
		required: true,
	},
});

module.exports = mongoose.model("ContactForm", contactFormSchema);
