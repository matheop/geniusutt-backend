const express = require("express");

const usersController = require("../controllers/users");
const { userValidator } = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// TODO: add "isAuth"

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
	userValidator,
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

module.exports = router;
