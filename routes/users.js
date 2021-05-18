const express = require("express");

const usersController = require("../controllers/users");

const {
	updateUserValidator,
	createUserValidator,
} = require("../utils/dataValidator");

const router = express.Router();

// GET ALL
router.get("/getAll", usersController.getAll);

// GET ONE
router.get("/getOne/:userId", usersController.getOneById);

// CREATE
router.post("/create", createUserValidator, usersController.create);

// UPDATE
router.put(
	"/update/:userId",
	updateUserValidator,
	usersController.update
);

// DELETE
router.delete("/delete/:userId", usersController.delete);

module.exports = router;
