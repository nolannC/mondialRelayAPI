document.querySelector('form').addEventListener('submit', async e => {
	e.preventDefault();
	const inputs = Array.from(e.target.elements).filter(element => element.tagName === 'INPUT' || element.tagName === 'SELECT');

	const body = {};

	const passwords = inputs.filter(input => input.name.includes('password')).map(input => input.value);

	if (passwords[0] !== passwords[1]) {
		document.getElementById('errorPassword').hidden = false;
		document.getElementById('errorPassword').textContent = 'Passwords do not match';
		return;
	}

	inputs
		.filter(input => input.name !== 'confirm-password')
		.forEach(input => {
			body[input.name] = input.value;
		});

	try {
		const { data } = await axios.post('https://gentle-beyond-27069.herokuapp.com/user/signup', body);
		localStorage.setItem('Authorization', data);
		window.location = '/';
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
