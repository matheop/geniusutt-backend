const { body } = require("express-validator");
const { scheduleValidator, dateValidator } = require("./regex");

/* Users */
exports.userValidator = [
	body("name", "name must have at least 2 chars")
		.exists()
		.trim()
		.isLength({ min: 2 }),
	body("email", "Invalid email").exists().isEmail(),
	body("role").exists().isIn(["Admin", "Modo"]),
	body("imgUrl").optional(),
];

/* Board Members */
exports.memberValidator = [
	body("name", "name must have at least 2 chars")
		.exists()
		.trim()
		.isLength({ min: 2 }),
	body("position").exists(),
	body("shortDesc").exists().isLength({ min: 100 }),
	body("longDesc").exists().isLength({ min: 200 }),
	body("linkedin").exists().contains("www.linkedin.com/in"),
];

/* Contact Form */
exports.formValidator = [
	body("lastname", "lastname must have at least 2 chars")
		.exists()
		.trim()
		.isLength({ min: 2 }),
	body("firstname", "firstname must have at least 2 chars")
		.exists()
		.trim()
		.isLength({ min: 2 }),
	body("email", "Invalid email").exists().isEmail(),
	body("organization").optional(),
	body("subject", "subject must have at least 2 chars")
		.exists()
		.isLength({ min: 2 }),
	body("message").exists().isLength({ min: 10 }),
];

/* Events */
exports.eventValidator = [
	body("name", "name must have at least 5 chars")
		.exists()
		.trim()
		.isLength({ min: 5 }),
	body("date", "Invalid date").exists().matches(dateValidator),
	body("schedule").optional().matches(scheduleValidator),
	body("desc", "desc must have at least 20 chars")
		.exists()
		.trim()
		.isLength({ min: 20 }),
	body("imgUrl").optional(),
	body("videoUrl").optional(),
];
