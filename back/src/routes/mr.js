const router = require('express').Router();
const crypto = require('crypto');
const convert = require('xml-js');
const axios = require('axios');

router.post('/search', async (req, res) => {
	const body = req.body;
	for (const key in body) {
		body[key] = body[key].toUpperCase();
	}
	const schemaSearchPOST = require('./../schemas/schemaSearch');

	const { error } = schemaSearchPOST.validate(body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	if (
		!(
			(body.hasOwnProperty('city') && body.hasOwnProperty('postalCode')) ||
			body.hasOwnProperty('id') ||
			(body.hasOwnProperty('latitude') && body.hasOwnProperty('longitude'))
		)
	) {
		return res.status(400).send('You need to provide a (city and a postal code) or an relais point id or a (latitude and a longitude)');
	}

	body.Enseigne = 'BDTEST13';

	let securityConcat = '';

	[
		'Enseigne',
		'country',
		'id',
		'city',
		'postalCode',
		'latitude',
		'longitude',
		'height',
		'weight',
		'action',
		'sendDelay',
		'radius',
		'activityType',
		'results'
	].forEach(key => (securityConcat += body[key] === undefined ? '' : body[key]));
	securityConcat += 'PrivateK';
	body.Security = crypto.createHash('md5').update(securityConcat).digest('hex').toUpperCase();

	delete Object.assign(body, { ['Pays']: body['country'] })['country'];
	delete Object.assign(body, { ['NumPointRelais']: body['id'] })['id'];
	delete Object.assign(body, { ['Ville']: body['city'] })['city'];
	delete Object.assign(body, { ['CP']: body['postalCode'] })['postalCode'];
	delete Object.assign(body, { ['Latitude']: body['latitude'] })['latitude'];
	delete Object.assign(body, { ['Longitude']: body['longitude'] })['longitude'];
	delete Object.assign(body, { ['Taille']: body['height'] })['height'];
	delete Object.assign(body, { ['Poids']: body['weight'] })['weight'];
	delete Object.assign(body, { ['Action']: body['action'] })['action'];
	delete Object.assign(body, { ['DelaiEnvoi']: body['sendDelay'] })['sendDelay'];
	delete Object.assign(body, { ['RayonRecherche']: body['radius'] })['radius'];
	delete Object.assign(body, { ['TypeActivite']: body['activityType'] })['activityType'];
	delete Object.assign(body, { ['NombreResultats']: body['results'] })['results'];

	const xml =
		`<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><WSI4_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">` +
		convert.json2xml(JSON.parse(JSON.stringify(body, null, '\t')), { compact: true, spaces: '\t' }) +
		`</WSI4_PointRelais_Recherche></soap12:Body></soap12:Envelope>`;

	try {
		const { data } = await axios.post('https://api.mondialrelay.com/Web_Services.asmx', xml, {
			headers: { 'Content-Type': 'application/soap+xml' }
		});
		const response = convert.xml2js(data, {
			compact: true,
			spaces: 4,
			ignoreAttributes: true,
			ignoreDeclaration: true,
			trim: true
		});
		if (!response['soap:Envelope']['soap:Body']['WSI4_PointRelais_RechercheResponse']['WSI4_PointRelais_RechercheResult']['PointsRelais']) {
			return res
				.status(400)
				.send(
					'Failed, status code : ' +
						response['soap:Envelope']['soap:Body'].WSI4_PointRelais_RechercheResponse.WSI4_PointRelais_RechercheResult.STAT._text
				);
		}

		let json =
			response['soap:Envelope']['soap:Body']['WSI4_PointRelais_RechercheResponse']['WSI4_PointRelais_RechercheResult']['PointsRelais'][
				'PointRelais_Details'
			];
		if (!Array.isArray(json)) {
			json = [json];
		}
		json.forEach(pointRelais => {
			for (const key in pointRelais) {
				if (pointRelais[key]._text !== undefined) {
					pointRelais[key] = pointRelais[key]._text;
				}
				if (Object.keys(pointRelais[key]).length === 0) {
					delete pointRelais[key];
				}
				if (key.includes('Horaires')) {
					pointRelais[key] = pointRelais[key].string;
					pointRelais[key].forEach(horaire => {
						pointRelais[key].push(pointRelais[key].shift()._text);
					});

					const timeArray = pointRelais[key].filter(horaire => horaire !== '0000');

					if (timeArray.length === 0) {
						pointRelais[key] = 'Closed';
					} else {
						console.log(timeArray);
						pointRelais[key] = timeArray
							.map(
								horaire =>
									(parseInt(horaire.slice(0, 2)) % 13) +
									':' +
									horaire.slice(2, 4) +
									(Math.floor(parseInt(horaire.slice(0, 2)) / 12) === 0 ? 'AM' : 'PM')
							)
							.join(' - ');
					}
				}
				if (['Num', 'Latitude', 'Longitude', 'Distance'].includes(key)) {
					if (pointRelais[key].includes(',')) pointRelais[key] = pointRelais[key].replace(',', '.');
					pointRelais[key] = parseFloat(pointRelais[key]);
				}
			}

			const horaires = Object.fromEntries(Object.entries(pointRelais).filter(([key]) => key.includes('Horaires')));

			// const h = [...new Set(Object.values(horaires))];
			const hUniq = Object.values(horaires).filter((item, pos) => Object.values(horaires).indexOf(item) === pos);

			Object.keys(horaires).forEach(key => {
				delete pointRelais[key];
			});

			const arr = [];
			hUniq.forEach((value, index) => {
				arr.push([index, value]);
			});

			const days = {
				Lundi: 'Monday',
				Mardi: 'Tuesday',
				Mercredi: 'Wednesday',
				Jeudi: 'Thursday',
				Vendredi: 'Friday',
				Samedi: 'Saturday',
				Dimanche: 'Sunday'
			};

			Object.entries(horaires).forEach(kv => {
				const pos = hUniq.indexOf(kv[1]);
				arr[pos][0] += days[kv[0].slice(9)];
			});

			arr.forEach(value => {
				value[0] = value[0]
					.slice(1)
					.split(/(?=[A-Z])/)
					.join('_');
			});

			for (const [key, value] of arr) {
				pointRelais[key] = value;
			}
		});
		res.status(200).send(json);
	} catch (err) {
		console.log(err.message);
		return res.status(500).send(err.message);
	}
});

router.post('/createSticker', async (req, res) => {
	const body = req.body;
	for (const key in body) {
		body[key] = body[key].toUpperCase();
	}
	const schemaPost = require('./../schemas/schemaCreateSticker');

	const { error } = schemaPost.validate(body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}

	if ((body.DelMode === 'LD1' || body.DelMode === 'LDS') && !body.PhoneRec1) {
		return res.status(400).send("Please inquire : 'PhoneRec1' !");
	}
	if (body.ColMode === 'REL' && !body.countryCollect) {
		return res.status(400).send("Please inquire : 'countryCollect' !");
	}
	if (body.ColMode === 'REL' && !body.IdCollect) {
		return res.status(400).send("Please inquire : 'IdCollect' !");
	}
	if ((body.DelMode === '24L' || body.DelMode === '24R') && !body.DeliveryCountry) {
		return res.status(400).send("Please inquire : 'DeliveryCountry' !");
	}
	if ((body.DelMode === '24L' || body.DelMode === '24R') && !body.DeliveryId) {
		return res.status(400).send("Please inquire : 'DeliveryId' !");
	}

	body.Enseigne = 'BDTEST13';

	let secureConcatenate = '';

	[
		'Enseigne',
		'CollectMode',
		'DeliveryMode',
		'NFolder',
		'NCustomer',
		'LanguageSender',
		'AddressSender1',
		'AddressSender2',
		'AddressSender3',
		'AddressSender4',
		'CitySender',
		'PCSender',
		'CountrySender',
		'PhoneSender',
		'PhoneSender2',
		'MailSender',
		'LangReceiver',
		'AddressReceiver1',
		'AddressReceiver2',
		'AddressReceiver3',
		'AddressReceiver4',
		'CityReceiver',
		'PostalCodeReceiver',
		'CountryReceiver',
		'PhoneReceiver1',
		'PhoneReceiver2',
		'MailReceiver2',
		'WeightReceiver',
		'LengthReceiver',
		'HeightReceiver',
		'NbPackage',
		'Reimbursement',
		'ReimbursementDev',
		'PriceSender',
		'PriceSenderDev',
		'CountryCollect',
		'IdCollect',
		'DeliveryCountry',
		'DeliveryId',
		'NoticeSender',
		'Recovery',
		'Assembly',
		'Appointment',
		'Insurance',
		'Instructions'
	].forEach(e => {
		secureConcatenate += body[e] ? body[e] : '';
	});
	secureConcatenate += 'PrivateK';
	body.Security = crypto.createHash('md5').update(secureConcatenate).digest('hex').toUpperCase();

	delete Object.assign(body, { ['ModeCol']: body['CollectMode'] })['CollectMode'];
	delete Object.assign(body, { ['ModeLiv']: body['DeliveryMode'] })['DeliveryMode'];
	delete Object.assign(body, { ['NDossier']: body['NFolder'] })['NFolder'];
	delete Object.assign(body, { ['NClient']: body['NCustomer'] })['NCustomer'];
	delete Object.assign(body, { ['Expe_Langage']: body['LanguageSender'] })['LanguageSender'];
	delete Object.assign(body, { ['Expe_Ad1']: body['AddressSender1'] })['AddressSender1'];
	delete Object.assign(body, { ['Expe_Ad2']: body['AddressSender2'] })['AddressSender2'];
	delete Object.assign(body, { ['Expe_Ad3']: body['AddressSender3'] })['AddressSender3'];
	delete Object.assign(body, { ['Expe_Ad4']: body['AddressSender4'] })['AddressSender4'];
	delete Object.assign(body, { ['Expe_Ville']: body['CitySender'] })['CitySender'];
	delete Object.assign(body, { ['Expe_CP']: body['PCSender'] })['PCSender'];
	delete Object.assign(body, { ['Expe_Pays']: body['CountrySender'] })['CountrySender'];
	delete Object.assign(body, { ['Expe_Tel1']: body['PhoneSender'] })['PhoneSender'];
	delete Object.assign(body, { ['Expe_Tel2']: body['PhoneSender2'] })['PhoneSender2'];
	delete Object.assign(body, { ['Expe_Mail']: body['MailSender'] })['MailSender'];
	delete Object.assign(body, { ['Dest_Langage']: body['LangReceiver'] })['LangReceiver'];
	delete Object.assign(body, { ['Dest_Ad1']: body['AddressReceiver1'] })['AddressReceiver1'];
	delete Object.assign(body, { ['Dest_Ad2']: body['AddressReceiver2'] })['AddressReceiver2'];
	delete Object.assign(body, { ['Dest_Ad3']: body['AddressReceiver3'] })['AddressReceiver3'];
	delete Object.assign(body, { ['Dest_Ad4']: body['AddressReceiver4'] })['AddressReceiver4'];
	delete Object.assign(body, { ['Dest_Ville']: body['CityReceiver'] })['CityReceiver'];
	delete Object.assign(body, { ['Dest_CP']: body['PostalCodeReceiver'] })['PostalCodeReceiver'];
	delete Object.assign(body, { ['Dest_Pays']: body['CountryReceiver'] })['CountryReceiver'];
	delete Object.assign(body, { ['Dest_Tel1']: body['PhoneReceiver1'] })['PhoneReceiver1'];
	delete Object.assign(body, { ['Dest_Tel2']: body['PhoneReceiver2'] })['PhoneReceiver2'];
	delete Object.assign(body, { ['Dest_Mail']: body['MailReceiver2'] })['MailReceiver2'];
	delete Object.assign(body, { ['Poids']: body['WeightReceiver'] })['WeightReceiver'];
	delete Object.assign(body, { ['Longueur']: body['LengthReceiver'] })['LengthReceiver'];
	delete Object.assign(body, { ['Taille']: body['heightReceiver'] })['heightReceiver'];
	delete Object.assign(body, { ['NbColis']: body['NbPackage'] })['NbPackage'];
	delete Object.assign(body, { ['CRT_Valeur']: body['Reimbursement'] })['Reimbursement'];
	delete Object.assign(body, { ['CRT_Devise']: body['ReimbursementDev'] })['ReimbursementDev'];
	delete Object.assign(body, { ['Exp_Valeur']: body['PriceSender'] })['PriceSender'];
	delete Object.assign(body, { ['Exp_Devise']: body['PriceSenderDev'] })['PriceSenderDev'];
	delete Object.assign(body, { ['COL_Rel_Pays']: body['CountryCollect'] })['CountryCollect'];
	delete Object.assign(body, { ['COL_Rel']: body['IdCollect'] })['IdCollect'];
	delete Object.assign(body, { ['LIV_Rel_Pays']: body['DeliveryCountry'] })['DeliveryCountry'];
	delete Object.assign(body, { ['LIV_Rel']: body['DeliveryId'] })['DeliveryId'];
	delete Object.assign(body, { ['TAvisage']: body['NoticeSender'] })['NoticeSender'];
	delete Object.assign(body, { ['TReprise']: body['Recovery'] })['Recovery'];
	delete Object.assign(body, { ['Montage']: body['Assembly'] })['Assembly'];
	delete Object.assign(body, { ['TRDV']: body['Appointment'] })['Appointment'];
	delete Object.assign(body, { ['Assurance']: body['Insurance'] })['Insurance'];
	delete Object.assign(body, { ['Instructions']: body['Instructions'] })['Instructions'];
	delete Object.assign(body, { ['Texte']: body['Text'] })['Text'];

	const xml =
		`<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><WSI2_CreationEtiquette xmlns="http://www.mondialrelay.fr/webservice/">` +
		convert.json2xml(JSON.parse(JSON.stringify(body, null, '\t')), { compact: true, spaces: '\t' }) +
		`</WSI2_CreationEtiquette></soap12:Body></soap12:Envelope>`;

	try {
		const { data } = await axios.post('https://api.mondialrelay.com/Web_Services.asmx', xml, {
			headers: { 'Content-Type': 'application/soap+xml' }
		});
		const response = convert.xml2js(data, {
			compact: true,
			spaces: '\t',
			ignoreAttributes: true,
			ignoreDeclaration: true,
			trim: true
		});

		const json = response['soap:Envelope']['soap:Body'].WSI2_CreationEtiquetteResponse.WSI2_CreationEtiquetteResult;

		if (json.STAT._text !== '0') {
			return res.status(400).send('Failed, status code : ' + json.STAT._text);
		}

		res.status(200).send('http://mondialrelay.com' + json.URL_Etiquette._text);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

module.exports = router;
