if (localStorage.getItem('Authorization')) {
	document.getElementById('signup').hidden = true;
	document.getElementById('signin').hidden = true;
} else {
	document.getElementById('profile').hidden = true;
	document.getElementById('logout').hidden = true;
}

document.getElementById('logout').addEventListener('click', () => {
	localStorage.removeItem('Authorization');
	window.location.reload();
});
