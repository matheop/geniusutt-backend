const express = require("express");

const boardMembersController = require("../controllers/board-members");

const { memberValidator } = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// GET ALL
router.get("/getAll", boardMembersController.getAll);

// GET ONE
router.get("/getOne/:userId", boardMembersController.getOneById);

// CREATE
router.post(
	"/create",
	isAuth,
	isAdmin,
	memberValidator,
	boardMembersController.create
);

// UPDATE
router.put(
	"/update/:userId",
	isAuth,
	isAdmin,
	memberValidator,
	boardMembersController.update
);

// DELETE
router.delete(
	"/delete/:userId",
	isAuth,
	isAdmin,
	boardMembersController.delete
);

module.exports = router;
