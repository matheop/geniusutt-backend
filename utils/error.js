exports.error500 = (err) => {
	if (!err.statusCode) {
		err.statusCode = 500;
	}
	return err;
};

exports.errorHandler = (message, status) => {
	const error = new Error(message);
	error.statusCode = status;
	return error;
};
