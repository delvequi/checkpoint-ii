window.addEventListener('load', () => {
	
	const nameInput = document.querySelector('#name');
	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})});