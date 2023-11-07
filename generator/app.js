const mainEl = document.querySelector('.main');

const passwordEl = document.createElement('input');
passwordEl.classList.add('password');
passwordEl.setAttribute('placeholder', 'Тут будет пароль');
passwordEl.addEventListener('keypress', (e) => {
	e.preventDefault();
});

const PassLenght = document.createElement('input');
PassLenght.classList.add('password');
PassLenght.setAttribute('placeholder', 'Длина пароля');
PassLenght.setAttribute('id', 'PassLenght');

const copyButton = document.createElement('button');
copyButton.classList.add('passwordbtn');
copyButton.innerText = 'Копировать';
copyButton.addEventListener('click', (e) => {
	passwordEl.select();
	passwordEl.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(passwordEl.value);
});

const generateButton = document.createElement('button');
generateButton.classList.add('passwordbtn');
generateButton.innerText = 'Сгенерировать';
generateButton.addEventListener('click', (e) => {
	var inputVal = document.getElementById('PassLenght').value;
	let password = generatePassword(inputVal);
	passwordEl.value = password;
});

function generatePassword(passwordLenght) {
	const numberChars = "0123456789";
	const upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	const lowerChars = "abcdefhjkmnprstuvwxyz";
	const symbolChars = "!@#$%^&()_+=";
	const allChars = numberChars + upperChars + lowerChars + symbolChars;
	
	let randomString = '';
	for (let i = 0; i < passwordLenght; i++) {
		let randomNumber = Math.floor(Math.random() * allChars.length);
		randomString += allChars[randomNumber];
	}
	return randomString;
}

mainEl.appendChild(PassLenght);
mainEl.appendChild(passwordEl);
mainEl.appendChild(generateButton);
mainEl.appendChild(copyButton);
