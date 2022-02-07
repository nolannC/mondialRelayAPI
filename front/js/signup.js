document.querySelector('form').addEventListener('submit', async e => {
	e.preventDefault();
	const inputs = Array.from(e.target.elements).filter(element => element.tagName === 'INPUT' || element.tagName === 'SELECT');

	const body = {};
	inputs.forEach(input => {
		body[input.name] = input.value;
	});

	try {
		const { data } = await axios.post('http://localhost:3000/user/signup', body);
		localStorage.setItem('Authorization', data);
		window.location = 'http://localhost:1234/';
	} catch (e) {
		if (e.response.status === 403) {
			document.getElementById('errorEmail').hidden = false;
			document.getElementById('errorEmail').textContent = e.response.data;
			document.getElementById('errorServer').hidden = true;
		} else {
			document.getElementById('errorServer').hidden = false;
			document.getElementById('errorServer').textContent = e.response.data;
		}
	}
});
