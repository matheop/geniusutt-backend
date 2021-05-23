const express = require("express");

const contactFormController = require("../controllers/contacts");

const {
	formValidator,
	updateFormState,
} = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");
// TODO:  add "isAuth"

const router = express.Router();

// GET ALL
router.get("/getAll", contactFormController.getAll);

// GET ONE
router.get("/getOne/:formId", contactFormController.getOneById);

// CREATE
router.post("/send", formValidator, contactFormController.send);

// UPDATE
router.put(
	"/update-state/:formId",
	updateFormState,
	contactFormController.updateState
);

// DELETE
router.delete("/delete/:formId", contactFormController.delete);

module.exports = router;
