let favoritePR;
if (localStorage.getItem('Authorization')) {
	(async () => {
		try {
			const {
				data: { favoritePR: id }
			} = await axios.get('http://localhost:3000/user/me', { headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') } });
			favoritePR = id;
		} catch (err) {
			console.log(err.message);
			alert(err.message);
		}
	})();
}

document.getElementById('searchPointRelais').addEventListener('submit', async e => {
	e.preventDefault();
	const results = document.querySelector('#results');
	results.innerHTML = '';

	// reset map div
	document.querySelector('#map').outerHTML = '<div id="map"></div>';

	const body = {};
	const inputs = Array.from(e.target.children).slice(0, 4);

	inputs.forEach(input => {
		body[input.name] = input.value;
	});
	try {
		const { data } = await axios.post('http://localhost:3000/mr/search', body);

		const map = L.map('map').setView([data[0].Latitude, data[0].Longitude], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

		data.forEach(pointRelais => {
			const horaires = Object.entries(pointRelais).filter(
				([key, value]) =>
					((value.toString().includes('h') && value.toString().includes(' - ')) || value.toString() === 'Closed') && key.toLowerCase().includes('i')
			);
			let horairesStr = '';
			horaires.forEach(h => {
				horairesStr += `<strong>${h[0].replaceAll('_', ' ')}</strong><br>${h[1]}<br>`;
			});

			L.marker([pointRelais.Latitude, pointRelais.Longitude]).addTo(map).bindPopup(`
        <strong style="color:#3388cc;">${pointRelais.LgAdr1}</strong><br>${pointRelais.LgAdr3}<br>
        ${horairesStr}
        `);
			//<span class="star emptyStar"><i class="fas fa-star"></i></span>
			results.style.display = 'flex';
			results.innerHTML += `
		<div class="contenerRelay">
		${localStorage.getItem('Authorization') ? '<span data-id="' + pointRelais.Num + '" class="star emptyStar"><i class="fas fa-star"></i></span>' : ''}
			<h2>
				${pointRelais.LgAdr1}
			</h2>
			<p>${pointRelais.LgAdr3}</p>
			<p>${horairesStr}</p>
		</div>
		`;
			if (localStorage.getItem('Authorization')) {
				if (pointRelais.Num === favoritePR) {
					const star = document.querySelector('span[data-id="' + favoritePR + '"]');
					star.style.color = '#ebc700';
					star.classList.replace('emptyStar', 'fullStar');
				}
			}
		});
	} catch (e) {
		alert(e);
	}

	Array.from(document.getElementsByClassName('star')).forEach(star => {
		star.style.cursor = 'pointer';
		star.addEventListener('click', async event => {
			if (star.className.includes('emptyStar')) {
				if (!!document.querySelector('.fullStar')) {
					document.querySelector('.fullStar').style.color = 'gray';
					document.querySelector('.fullStar').classList.replace('fullStar', 'emptyStar');
				}
				star.style.color = '#ebc700';
				star.classList.replace('emptyStar', 'fullStar');
				const { data } = await axios.put(
					'http://localhost:3000/user/me',
					{ favoritePR: star.dataset.id },
					{ headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') } }
				);
				localStorage.setItem('Authorization', data);
			} else {
				star.style.color = 'gray';
				star.classList.replace('fullStar', 'emptyStar');
				const { data } = await axios.put(
					'http://localhost:3000/user/me',
					{ favoritePR: 0 },
					{ headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') } }
				);
				localStorage.setItem('Authorization', data);
			}
		});
	});
});
