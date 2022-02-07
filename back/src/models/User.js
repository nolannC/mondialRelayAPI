const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Schema = new mongoose.Schema({
	fName: {
		type: String,
		minLength: 2,
		maxLength: 30,
		required: true
	},
	lName: {
		type: String,
		minLength: 2,
		maxLength: 30,
		required: true
	},
	email: {
		type: String,
		minLength: 2,
		maxLength: 30,
		required: true,
		unique: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	country: {
		type: String,
		minLength: 2,
		maxLength: 2,
		required: true
	},
	civility: {
		type: String,
		required: true
	},
	localisation: {
		type: String,
		minLength: 2,
		maxLength: 32,
		required: true
	},
	city: {
		type: String,
		minLength: 2,
		maxLength: 32,
		required: true
	},
	postalCode: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		minLength: 3,
		maxLength: 1000,
		required: true
	},
	favoritePR: {
		type: Number
	},
	createdSticker: [String]
});

Schema.methods.generateAuthToken = function () {
	return jwt.sign({ _id: this._id }, process.env.PRIVATE_KEY, { expiresIn: '3d' });
};

const User = mongoose.model('User', Schema);

module.exports = User;
