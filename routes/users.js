const express = require("express");
const { body } = require("express-validator");

const usersController = require("../controllers/users");

const router = express.Router();

// GET ALL
router.get("/getAll", usersController.getAll);

// GET ONE
router.get("/getOne/:userId", usersController.getOneById);

// CREATE
router.post(
	"/create",
	[
		body("name")
			.trim()
			.isLength({ min: 2 })
			.withMessage("Must have at least 2 chars"),
		body("email")
			.isEmail()
			.withMessage("Doesn't match email pattern"),
		body("role").isIn(["Admin", "Modo"]),
	],
	usersController.create
);

// UPDATE
router.put(
	"/update/:userId",
	[
		body("name")
			.trim()
			.isLength({ min: 2 })
			.withMessage("Must have at least 2 chars"),
		body("email")
			.isEmail()
			.withMessage("Doesn't match email pattern"),
		body("role").isIn(["Admin", "Modo"]),
	],
	usersController.update
);

// DELETE
router.delete("/delete/:userId", usersController.delete);

module.exports = router;
