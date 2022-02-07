const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('./../models/User');

// Login
router.post('/signin', async (req, res) => {
	try {
		const userData = await User.findOne({ email: req.body.email });
		if (!userData) {
			return res.status(404).send('No account found');
		}

		if (!(await bcrypt.compare(req.body.password, userData.password))) {
			return res.status(401).send('Wrong password');
		}

		const token = userData.generateAuthToken();
		return res.status(200).send(token);
	} catch (err) {
		console.log(err.message);
		return res.status(500).send(err.message);
	}
});

module.exports = router;
