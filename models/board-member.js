const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardMemberSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
	shortDesc: {
		type: String,
		required: true,
	},
	longDesc: {
		type: String,
		required: true,
	},
	linkedin: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: String,
	},
});

module.exports = mongoose.model("BoardMember", boardMemberSchema);
