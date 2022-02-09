// anonymous async function execution
(async () => {
	if (localStorage.getItem('Authorization')) {
		const { data } = await axios('https://gentle-beyond-27069.herokuapp.com/user/me', {
			headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') }
		});
		document.getElementById('welcomeMessage').textContent += `Welcome ${data.fName}`;
	}
})();
