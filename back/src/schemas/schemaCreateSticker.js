const Joi = require('joi');

module.exports = Joi.object({
	CollectMode: Joi.string()
		.pattern(/^(CCC|CDR|CDS|REL)$/)
		.required(),
	DeliveryMode: Joi.string()
		.pattern(/^(LCC|LD1|LDS|24R|24L|ESP|DRI)$/)
		.required(),
	NFolder: Joi.string().pattern(/^(|[0-9A-Z_ -]{0,15})$/),
	NCustomer: Joi.string().pattern(/^(|[0-9A-Z]{0,9})$/),
	LanguageSender: Joi.string()
		.pattern(/^[A-Z]{2}$/)
		.required(),
	AddressSender1: Joi.string()
		.pattern(/^[0-9A-Z_\-'., /]{2,32}$/)
		.required(),
	AddressSender2: Joi.string().pattern(/^[0-9A-Z_\-'., /]{0,32}$/),
	AddressSender3: Joi.string()
		.pattern(/^[0-9A-Z_\-'., /]{2,32}$/)
		.required(),
	AddressSender4: Joi.string().pattern(/^[0-9A-Z_\-'., /]{0,32}$/),
	CitySender: Joi.string()
		.pattern(/^[A-Z_\-' ]{2,26}$/)
		.required(),
	PCSender: Joi.string()
		.pattern(/^[0-9@]{1}[0-9]{4}$/)
		.required(),
	CountrySender: Joi.string()
		.pattern(/^[A-Z]{2}$/)
		.required(),
	PhoneSender: Joi.string()
		.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
		.required(),
	PhoneSender2: Joi.string().pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
	MailSender: Joi.string().pattern(/^[\w\-\.\@_]{7,70}$/),
	LangReceiver: Joi.string()
		.pattern(/^[A-Z]{2}$/)
		.required(),
	AddressReceiver1: Joi.string()
		.pattern(/^[0-9A-Z_\-'., /]{2,32}$/)
		.required(),
	AddressReceiver2: Joi.string().pattern(/^[0-9A-Z_\-'., /]{0,32}$/),
	AddressReceiver3: Joi.string()
		.pattern(/^[0-9A-Z_\-'., /]{2,32}$/)
		.required(),
	AddressReceiver4: Joi.string().pattern(/^[0-9A-Z_\-'., /]{0,32}$/),
	CityReceiver: Joi.string()
		.pattern(/^[A-Z_\-' ]{2,26}$/)
		.required(),
	PostalCodeReceiver: Joi.string()
		.pattern(/^[0-9@]{1}[0-9]{4}$/)
		.required(),
	CountryReceiver: Joi.string()
		.pattern(/^[A-Z]{2}$/)
		.required(),
	PhoneReceiver1: Joi.string().pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
	PhoneReceiver2: Joi.string().pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
	MailReceiver2: Joi.string().pattern(/^[\w\-\.\@_]{7,70}$/),
	WeightReceiver: Joi.string()
		.pattern(/^[0-9]{2,7}\.?[0-9]{0,2}$/)
		.required(),
	LengthReceiver: Joi.string().pattern(/^[0-9]{0,3}$/),
	HeightReceiver: Joi.string().pattern(/^(XS|S|M|L|XL|3XL)$/),
	NbPackage: Joi.string()
		.pattern(/^[0-9]{1,2}$/)
		.required(),
	Reimbursement: Joi.string()
		.pattern(/^[0-9]{1,7}$/)
		.required(),
	ReimbursementDev: Joi.string().pattern(/^(|EUR)$/),
	PriceSender: Joi.string().pattern(/^[0-9]{0,7}$/),
	PriceSenderDev: Joi.string().pattern(/^(|EUR)$/),
	CountryCollect: Joi.string().pattern(/^[A-Z]{2}$/),
	IdCollect: Joi.string().pattern(/^(|[0-9]{6})$/),
	DeliveryCountry: Joi.string().pattern(/^[A-Z]{2}$/),
	DeliveryId: Joi.string().pattern(/^(|[0-9]{6})$/),
	NoticeSender: Joi.string().pattern(/^(|O|N)$/),
	Recovery: Joi.string().pattern(/^(|O|N)$/),
	Assembly: Joi.string().pattern(/^(|[0-9]{1,3})$/),
	Appointment: Joi.string().pattern(/^(|O|N)$/),
	Insurance: Joi.string().pattern(/^(|[0-9A-Z]{1})$/),
	Instructions: Joi.string().pattern(/^[0-9A-Z_\-'., /]{0,31}/),
	Text: Joi.string().pattern(/^([^<>&']{3,30})(\(cr\)[^<>&']{0,30}){0,9}$/)
});
