const express = require("express");

const boardMembersController = require("../controllers/board-members");

const { memberValidator } = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET ALL
router.get("/getAll", boardMembersController.getAll);

// GET ONE
router.get("/getOne/:userId", boardMembersController.getOneById);

// CREATE
router.post(
	"/create",
	isAuth,
	memberValidator,
	boardMembersController.create
);

// UPDATE
router.put(
	"/update/:userId",
	isAuth,
	memberValidator,
	boardMembersController.update
);

// DELETE
router.delete(
	"/delete/:userId",
	isAuth,
	boardMembersController.delete
);

module.exports = router;
