const express = require("express");

const contactFormController = require("../controllers/contacts");

const {
	formValidator,
	updateFormState,
} = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET ALL
router.get("/getAll", isAuth, contactFormController.getAll);

// GET ONE
router.get(
	"/getOne/:formId",
	isAuth,
	contactFormController.getOneById
);

// CREATE
router.post("/send", formValidator, contactFormController.send);

// UPDATE
router.put(
	"/update-state/:formId",
	isAuth,
	updateFormState,
	contactFormController.updateState
);

// DELETE
router.delete(
	"/delete/:formId",
	isAuth,
	contactFormController.delete
);

module.exports = router;
