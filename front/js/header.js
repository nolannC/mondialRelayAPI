document.body.setAttribute(localStorage.getItem('theme'), '');

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

document.getElementById('moon').addEventListener('click', e => {
	document.body.toggleAttribute('dark-mode');
	localStorage.setItem('theme', document.getElementById('moon').classList[0]);
});

document.getElementById('sun').addEventListener('click', e => {
	document.body.toggleAttribute('dark-mode');
	localStorage.setItem('theme', document.getElementById('sun').classList[0]);
});
