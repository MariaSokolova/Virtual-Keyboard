import Keyboard from './Keyboard.js';
import keys from './ru.js';
import Key from './Key.js';

let language;
if (typeof (Storage) !== 'undefined') {
  language = localStorage.getItem('language');
}
if (!language) {
  language = 'ru';
}

const keyButtons = keys.map((el) => new Key(el, language));
const keyboard = new Keyboard(keyButtons, language);

document.addEventListener('DOMContentLoaded', () => {
  keyboard.init();
});
