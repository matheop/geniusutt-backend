const { body } = require("express-validator");

exports.createUserValidator = [
	body("name", "name must have at least 2 chars")
		.exists()
		.trim()
		.isLength({ min: 2 }),
	body("email", "Invalid email").exists().isEmail(),
	body("role").exists().isIn(["Admin", "Modo"]),
];
exports.updateUserValidator = [
	body("name", "name must have at least 2 chars")
		.optional()
		.trim()
		.isLength({ min: 2 }),
	body("email", "Invalid email").optional().isEmail(),
	body("role").optional().isIn(["Admin", "Modo"]),
];
