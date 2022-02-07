const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (bearerHeader) {
		const token = bearerHeader.split(' ')[1];
		req.token = token;
		next();
	} else {
		res.sendStatus(403);
	}
};

module.exports = verifyToken;