const { body } = require("express-validator");
const User = require("../models/user");
const { scheduleValidator, dateValidator } = require("./regex");

/* Sign up */
exports.signupValidator = [
	body("name", "name must have at least 2 chars")
		.exists()
		.isLength({ min: 2 }),
	body("role").exists().isIn(["Admin", "Modo"]),
	body("email", "Invalid email")
		.exists()
		.isEmail()
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then((userDoc) => {
				if (userDoc)
					return Promise.reject(
						"Cannot signup with this email"
					);
			});
		}),
];

/* Log in */
exports.loginValidator = [
	body("email").exists(),
	body("password").exists(),
];

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
	body("shortDesc", "shortDesc must contain at least 70 chars")
		.exists()
		.isLength({ min: 70 }),
	body("longDesc", "longDesc must contain at least 200 chars")
		.exists()
		.isLength({ min: 200 }),
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
	body("place").optional(),
	body("desc", "desc must have at least 20 chars")
		.exists()
		.trim()
		.isLength({ min: 20 }),
	body("imgUrl").optional(),
	body("videoUrl").optional(),
	body("upcoming").exists(),
];
