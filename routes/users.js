const express = require("express");

const usersController = require("../controllers/users");
const { userValidator } = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET ALL
router.get("/getAll", isAuth, usersController.getAll);

// GET ONE
router.get("/getOne/:userId", isAuth, usersController.getOneById);

// CREATE
router.post("/create", isAuth, userValidator, usersController.create);

// UPDATE
router.put(
	"/update/:userId",
	isAuth,
	userValidator,
	usersController.update
);

// DELETE
router.delete("/delete/:userId", isAuth, usersController.delete);

module.exports = router;
