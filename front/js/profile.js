// Verify if the client is connected
if (!localStorage.getItem('Authorization')) {
	window.location = '/';
}
//! ################################# Get informations and display
//! ################################# Get informations and display
(async () => {
	const { data } = await axios('https://gentle-beyond-27069.herokuapp.com/user/me', {
		headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') }
	});
	document.querySelectorAll('option').forEach(option => {
		if (option.value === data.civility) {
			option.selected = true;
		}
	});
	for (const key in data) {
		if (!!document.getElementsByName(key).length) {
			document.getElementsByName(key)[0].value = data[key];
		}
	}

	if (data.favoritePR) {
		if (data.favoritePR !== 0) {
			let { data: pointRelais } = await axios.post('https://gentle-beyond-27069.herokuapp.com/mr/search', {
				country: 'FR',
				results: '1',
				id: data.favoritePR.toString().padStart(6, '0')
			});
			pointRelais = pointRelais[0];
			const map = L.map('map').setView([pointRelais.Latitude, pointRelais.Longitude], 13);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

			L.marker([pointRelais.Latitude, pointRelais.Longitude])
				.addTo(map)
				.bindPopup(`<strong style="color:#3388cc;">${pointRelais.LgAdr1}</strong>`)
				.openPopup();
		}
	} else {
		document.getElementById('mapDiv').style.display = 'none';
	}

	if (data.createdSticker.length > 0) {
		data.createdSticker.forEach(sticker => {
			const stickerID = sticker.split('expedition=')[1].split('&')[0];
			document.getElementById('ulStickers').innerHTML += `<button><a href="${sticker}">ID : ${stickerID}</a></button>`;
		});
	} else {
		document.getElementById('stickers').style.display = 'none';
	}
})();

document.getElementById('modifyButton').addEventListener('click', event => {
	// const inputs = ;
	Array.from(document.querySelectorAll('input')).forEach(input => {
		input.readOnly = false;
	});

	document.querySelector('select').disabled = false;
	document.querySelector('button').textContent = 'Save';
	document.querySelector('button').id = 'saveButton';
	// saveButton
	document.getElementById('saveButton').addEventListener('click', async e => {
		const inputs = Array.from(document.querySelectorAll('input'));
		inputs.push(document.querySelector('select'));

		const body = {};
		inputs.forEach(input => {
			body[input.name] = input.value;
		});
		const { data } = await axios.put('https://gentle-beyond-27069.herokuapp.com/user/me', body, {
			headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') }
		});
		localStorage.setItem('Authorization', data);

		window.location = '/profile.html';
	});
});
