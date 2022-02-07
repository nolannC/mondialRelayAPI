const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyToken = require('./../middlewares/verifyToken');

const User = require('./../models/User');

// Create an account
router.post('/signup', async (req, res) => {
	try {
		const users = await User.find({ email: req.body.email });
		if (users.length > 0) {
			console.log('Email already exists');
			return res.status(403).send('Email already exists');
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(req.body.password, salt);

		const user = new User({
			fName: req.body.fName,
			lName: req.body.lName,
			email: req.body.email,
			phoneNumber: req.body.phoneNumber,
			country: req.body.country,
			civility: req.body.civility,
			localisation: req.body.localisation,
			city: req.body.city,
			postalCode: req.body.postalCode,
			password: hash
		});

		const userData = await user.save();
		const token = userData.generateAuthToken();
		res.status(201).send(token);
	} catch (err) {
		console.log(err.message);
		return res.status(500).send(err.message);
	}
});

router.get('/me', verifyToken, async (req, res) => {
	const id = jwt.verify(req.token, process.env.PRIVATE_KEY);
	try {
		const user = await User.findById(id);
		if (!user) {
			console.log('No user found');
			return res.status(400).send('No user found');
		}

		const { _doc: resp } = Object.assign({}, user);

		delete resp.password;
		delete resp._id;
		delete resp.__v;

		res.status(200).send(resp);
	} catch (err) {
		console.log(err.message);
		res.status(400).send(err.message);
	}
});

router.put('/me', verifyToken, async (req, res) => {
	const id = jwt.verify(req.token, process.env.PRIVATE_KEY);
	try {
		let userData;
		if (Object.keys(req.body).includes('createdSticker')) {
			userData = await User.findByIdAndUpdate(id, { $push: req.body }, { new: true });
		} else {
			userData = await User.findByIdAndUpdate(id, req.body, { new: true });
		}
		const token = userData.generateAuthToken();
		res.status(201).send(token);
	} catch (err) {
		console.log(err.message);
		return res.status(500).send(err.message);
	}
});

module.exports = router;
