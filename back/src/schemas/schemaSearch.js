const Joi = require('joi');

module.exports = Joi.object({
	country: Joi.string()
		.pattern(/^[A-Za-z]{2}$/)
		.required(),
	results: Joi.string()
		.pattern(/^[0-3]?[0-9]$/)
		.required(),
	city: Joi.string().pattern(/^[A-Za-z_\-' ]{2,25}$/),
	postalCode: Joi.string(),
	latitude: Joi.string().pattern(/^-?[0-9]{1,2}\.[0-9]{7}$/),
	longitude: Joi.string().pattern(/^-?[0-9]{1,2}\.[0-9]{7}$/),
	id: Joi.string().pattern(/^[0-9]{6}$/),
	radius: Joi.string().pattern(/^[0-9]{1,4}$/),
	action: Joi.string().pattern(/^(REL|24R|24L|DRI)$/),
	weight: Joi.string().pattern(/^[0-9]{1,6}$/),
	height: Joi.string().pattern(/^(XS|S|M|L|XL|3XL)$/),
	sendDelay: Joi.string().pattern(/^-?([0-9]{2})$/),
	activityType: Joi.string().pattern(/^(\d{3},|\d{3})*$/)
});
