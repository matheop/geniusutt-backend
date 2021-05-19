const express = require("express");

const contactFormController = require("../controllers/contact");

const { formValidator } = require("../utils/dataValidator");

const router = express.Router();

// GET ALL
router.get("/getAll", contactFormController.getAll);

// GET ONE
router.get("/getOne/:formId", contactFormController.getOneById);

// CREATE
router.post("/send", formValidator, contactFormController.send);

// DELETE
router.delete("/delete/:formId", contactFormController.delete);

module.exports = router;
