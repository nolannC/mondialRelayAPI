document.querySelector('form').addEventListener('submit', async e => {
	e.preventDefault();
	const inputs = Array.from(e.target.elements).filter(element => element.tagName === 'INPUT');

	const body = {};
	inputs.forEach(input => {
		body[input.name] = input.value;
	});
	try {
		const { data } = await axios.post('http://localhost:3000/auth/signin', body);
		localStorage.setItem('Authorization', data);
		window.location = 'http://localhost:1234/';
	} catch (e) {
		if (e.response.status === 404) {
			document.getElementById('errorEmail').hidden = false;
			document.getElementById('errorEmail').textContent = e.response.data;
			document.getElementById('errorPassword').hidden = true;
			document.getElementById('errorServer').hidden = true;
		} else if (e.response.status === 401) {
			document.getElementById('errorPassword').hidden = false;
			document.getElementById('errorPassword').textContent = e.response.data;
			document.getElementById('errorEmail').hidden = true;
			document.getElementById('errorServer').hidden = true;
		} else {
			document.getElementById('errorServer').hidden = false;
			document.getElementById('errorServer').textContent = e.response.data;
			document.getElementById('errorEmail').hidden = true;
			document.getElementById('errorPassword').hidden = true;
		}
	}
});
