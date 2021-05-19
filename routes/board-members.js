const express = require("express");
const { body } = require("express-validator");

const boardMembersController = require("../controllers/board-members");

const { memberValidator } = require("../utils/dataValidator");

const router = express.Router();

// GET ALL
router.get("/getAll", boardMembersController.getAll);

// GET ONE
router.get("/getOne/:userId", boardMembersController.getOneById);

// CREATE
router.post(
	"/create",
	memberValidator,
	boardMembersController.create
);

// UPDATE
router.put(
	"/update/:userId",
	memberValidator,
	boardMembersController.update
);

// DELETE
router.delete("/delete/:userId", boardMembersController.delete);

module.exports = router;
