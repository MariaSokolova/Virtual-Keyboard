import createItem from './create.js';

export default class Key {
  constructor({ ru, en, code }, lang) {
    this.ru = ru;
    this.en = en;
    this.code = code;
    this.wideKey = ['Backspace', 'CapsLock', 'Shift', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight'];
    this.extraWideKey = ['Space'];
    this.shift = false;

    this.init(lang, code);
  }

  init(lang, code) {
    this.keyElement = createItem('div', 'keyboard__key');
    this.keyElement.dataset.code = this.code;
    this.setLanguage(lang);

    if (this.wideKey.includes(code)) {
      this.keyElement.classList.add('keyboard__key--wide');
    }

    if (this.extraWideKey.includes(code)) {
      this.keyElement.classList.add('keyboard__key--extra-wide');
    }
  }

  changeCurrentChar(lang) {
    if (lang === 'en') {
      this.currentChar = this.shift ? this.en.shift : this.en.small;
    } else {
      this.currentChar = this.shift ? this.ru.shift : this.ru.small;
    }
    this.keyElement.innerHTML = this.currentChar;
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.changeCurrentChar(lang);
  }

  shiftOn() {
    this.shift = true;
    this.changeCurrentChar(this.currentLang);
  }

  shiftOff() {
    this.shift = false;
    this.changeCurrentChar(this.currentLang);
  }

  keyPressed() {
    this.keyElement.classList.add('active');
  }

  keyUnPressed() {
    this.keyElement.classList.remove('active');
  }
}
