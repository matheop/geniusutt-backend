const express = require("express");

const eventsController = require("../controllers/events");

const { eventValidator } = require("../utils/dataValidator");

const router = express.Router();

// GET ALL
router.get("/getAll", eventsController.getAll);

// GET ONE
router.get("/getOne/:eventId", eventsController.getOneById);

// CREATE
router.post("/create", eventValidator, eventsController.create);

// UPDATE
router.put(
	"/update/:eventId",
	eventValidator,
	eventsController.update
);

// DELETE
router.delete("/delete/:eventId", eventsController.delete);

module.exports = router;
