const express = require("express");

const eventsController = require("../controllers/events");

const { eventValidator } = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET ALL
router.get("/getAll", eventsController.getAll);

// GET ONE
router.get("/getOne/:eventId", eventsController.getOneById);

// CREATE
router.post(
	"/create",
	isAuth,
	eventValidator,
	eventsController.create
);

// UPDATE
router.put(
	"/update/:eventId",
	isAuth,
	eventValidator,
	eventsController.update
);

// DELETE
router.delete("/delete/:eventId", isAuth, eventsController.delete);

module.exports = router;
