import createItem from './create.js';

export default class Keyboard {
  constructor(keys, language) {
    this.keyButtons = keys;
    this.language = language;
    this.capsKey = false;
    this.elements = {
      keyboard: null,
      keyboardKeys: null,
    };
  }

  init() {
    this.markupCreate();
    this.outputCreate();
    this.addToDom();
    this.eventListeners();
  };

  markupCreate() {
    this.main = createItem('main', 'main');
    this.h1 = this.addTextContent('h1', 'main__header', 'Virtual Keyboard');
    this.p = this.addTextContent('p', 'main__text', 'Use Ctrl+Shift to switch the language');
    this.elements.keyboard = createItem('div', 'keyboard');
    this.elements.keyboardKeys = createItem('div', 'keyboard__keys');
  }

  addTextContent(el, className, text) {
    this.element = createItem(el, className);
    this.element.innerText = text;
    return this.element;
  }

  outputCreate() {
    this.output = createItem('textarea', 'output');
    this.output.setAttribute('rows', 10);
    this.output.setAttribute('cols', 50);
    this.output.setAttribute('placeholder', 'Start type...');
    this.output.setAttribute('spellcheck', false);
  }

  addToDom() {
    document.body.prepend(this.main);
    this.main.appendChild(this.h1);
    this.main.appendChild(this.p);
    this.main.appendChild(this.output);
    this.main.appendChild(this.elements.keyboard);
    this.elements.keyboard.appendChild(this.elements.keyboardKeys);
    this.keyButtons.forEach((el) => this.elements.keyboardKeys.appendChild(el.keyElement));
  }

  eventListeners() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      this.handleEventDown(event.code, event.ctrlKey);
    });

    document.addEventListener('keyup', (event) => {
      this.handleEventUp(event.code, event.ctrlKey);
    });

    this.elements.keyboardKeys.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const code = this.mouseHandleEvent(event);
      this.handleEventDown(code);
    });

    this.elements.keyboardKeys.addEventListener('mouseup', (event) => {
      const code = this.mouseHandleEvent(event);
      this.handleEventUp(code);
    });
  }

  mouseHandleEvent = (event) => {
    const keyElement = event.target.closest('.keyboard__key');
    if (!keyElement) {
      return;
    }
    return keyElement.dataset.code;
  };

  handleEventDown = (code, ctrlKey) => {
    switch (code) {
      case 'ShiftRight':
      case 'ShiftLeft':
        if (ctrlKey) {
          this.changeLanguage();
        } else {
          this.shiftPressed();
        }
        break;
      case  'CapsLock':
        this.capsKey = !this.capsKey;
        this.capsPressed();
        if (!this.capsKey) {
          this.shiftUnPressed();
        }
        break;
    }
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;
    keyObj.keyPressed();
    this.output.focus();

    this.printToOutput(keyObj);
  };

  handleEventUp = (code, ctrlKey) => {
    switch (code) {
      case 'ShiftRight':
      case 'ShiftLeft':
        if (!ctrlKey) {
          if (this.capsKey) {
            this.shiftUnPressedForNonChars();
          } else {
            this.shiftUnPressed();
          }
        }
        break;
    }
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (keyObj) {
      keyObj.keyUnPressed();
    }
  };

  shiftPressed() {
    this.keyButtons.forEach(key => key.shiftOn());
  }

  shiftUnPressed() {
    this.keyButtons.forEach(key => key.shiftOff());
  }

  shiftUnPressedForNonChars() {
    this.keyButtons
      .filter((key) => !key.currentChar.match(/[а-яА-ЯЁёa-zA-Z]/))
      .forEach(key => key.shiftOff());
  }

  changeLanguage() {
    if (this.language === 'ru') {
      this.language = 'en';
    } else {
      this.language = 'ru';
    }

    if (typeof (Storage) !== "undefined") {
      localStorage.setItem('language', this.language);
    }

    this.keyButtons.forEach(key => key.setLanguage(this.language));

    if(this.capsKey) {
      this.shiftUnPressed();
      this.capsPressed();
    }
  }

  capsPressed() {
    this.keyButtons
      .filter(key => key.currentChar.match(/[а-яёa-z]/))
      .forEach(key => key.shiftOn())
  }

  printToOutput(keyObj) {
    let cursorPosition = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPosition);
    const right = this.output.value.slice(cursorPosition);
    const functionalButtonsHandler = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursorPosition += 1;
      },
      ArrowLeft: () => {
        cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : 0;
      },
      ArrowRight: () => {
        cursorPosition += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = this.output.value.slice(0, cursorPosition).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPosition -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = this.output.value.slice(cursorPosition).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPosition += positionFromLeft[0].length;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursorPosition += 1;
      },
      Delete: () => {
        this.output.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPosition -= 1;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursorPosition += 1;
      },
    };

    if (keyObj.code.match(/CapsLock|ShiftLeft|ShiftRight|ControlLeft|ControlRight|AltLeft|AltRight|MetaLeft/)) {
      return;
    }

    if (functionalButtonsHandler[keyObj.code]) {
      functionalButtonsHandler[keyObj.code]();
    } else {
      cursorPosition += 1;
      this.output.value = `${left}${keyObj.currentChar || ''}${right}`;
    }

    this.output.setSelectionRange(cursorPosition, cursorPosition);
  };
}

