const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const ContactForm = require("../models/contact-form");
const { error500, errorHandler } = require("../utils/error");

// GET
exports.getAll = async (req, res, next) => {
	try {
		const forms = await ContactForm.find();
		if (!forms) throw errorHandler("No form found.", 404);
		res.status(200).json({
			message: "ContactForms fetched successfully",
			forms,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// GET
exports.getOneById = async (req, res, next) => {
	const id = req.params.formId;
	try {
		const form = await ContactForm.findById(id);

		if (!form) throw errorHandler("No form found.", 404);
		res.status(200).json({
			message: "ContactForm fetched successfully",
			form,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// POST
exports.send = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: [
				"lastname",
				"firstname",
				"email",
				"subject",
				"message",
			],
			errors: errors.array(),
		});
	}

	const {
		lastname,
		firstname,
		email,
		organization,
		subject,
		message,
	} = req.body;

	const form = new ContactForm({
		lastname,
		firstname,
		email,
		organization,
		subject,
		message,
		date: new Date(),
		contacted: false,
	});

	try {
		const result = await form.save();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "matheo.pierini.pro@gmail.com",
				pass: "S@9p!t7R&13or",
			},
		});
		transporter.verify().then(console.log).catch(console.error);

		const mail = `
        Contact : ${lastname.toUpperCase()} ${firstname} <br />
        Email : <strong>${email}</strong> <br />
        Organisation : ${organization} <br />
        <br />
        Objet : ${subject} <br />
        Message : ${message} <br />
        `;

		const mailOptions = {
			from: "matheo.pierini.pro@gmail.com",
			to: "matheo.pierini1@gmail.com",
			subject: "Website: Nouvelle prise de contact",
			html: mail,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});

		res.status(201).json({
			message: "ContactForm created successfully!",
			form: result,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// UPDATE
exports.updateState = async (req, res, next) => {
	const id = req.params.formId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			requiredFields: ["contacted"],
			errors: errors.array(),
		});
	}

	try {
		const form = await ContactForm.findById(id);

		if (!form) throw errorHandler("No form found.", 404);

		form.contacted = req.body.contacted;

		result = await form.save();

		res.status(200).json({
			message: "ContactForm successfully updated",
			form: result,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};

// DELETE
exports.delete = async (req, res, next) => {
	const id = req.params.formId;

	try {
		const form = await ContactForm.findByIdAndDelete(id);
		if (!form) throw errorHandler("No form found.", 404);
		res.status(200).json({
			success: true,
			message: "ContactForm deleted successfully",
			deletedMember: form,
		});
	} catch (error) {
		const err = error500(error);
		next(err);
	}
};
