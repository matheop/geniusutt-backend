const express = require("express");

const usersController = require("../controllers/users");
const {
	userValidator,
	signupValidator,
} = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// GET ALL
router.get("/getAll", isAuth, isAdmin, usersController.getAll);

// GET ONE
router.get(
	"/getOne/:userId",
	isAuth,
	isAdmin,
	usersController.getOneById
);

// CREATE
router.post(
	"/create",
	isAuth,
	isAdmin,
	signupValidator,
	usersController.create
);

// UPDATE
router.put(
	"/update/:userId",
	isAuth,
	isAdmin,
	userValidator,
	usersController.update
);

// DELETE
router.delete(
	"/delete/:userId",
	isAuth,
	isAdmin,
	usersController.delete
);

// CHANGE PWD
router.put(
	"/change-password/:userId",
	isAuth,
	usersController.changePassword
);

module.exports = router;
