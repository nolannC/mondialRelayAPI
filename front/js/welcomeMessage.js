// anonymous async function execution
(async () => {
	if (localStorage.getItem('Authorization')) {
		console.log('user welcome');
		const { data } = await axios('http://localhost:3000/user/me', { headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') } });
		document.getElementById('welcomeMessage').textContent += `Welcome ${data.fName}`;
	}
})();
