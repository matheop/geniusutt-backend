const express = require("express");

const contactFormController = require("../controllers/contact");

const { formValidator } = require("../utils/dataValidator");
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

// DELETE
router.delete(
	"/delete/:formId",
	isAuth,
	contactFormController.delete
);

module.exports = router;
