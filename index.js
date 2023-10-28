// Game class will handle the logic of the game and managing elements
class Game {
  #score = 0;
  #expression = "";
  #app;
  #questionDiv;
  #answerDiv;
  #scoreDiv;
  #correctSound;
  #wrongSound;
  #timeOut;
  #progressBarContainer;

  constructor() {
    this.#app = document.getElementById("app");

    this.#progressBarContainer = document.createElement("div");
    this.#progressBarContainer.className = "progress-bar-container";
    this.#app.appendChild(this.#progressBarContainer);

    this.#scoreDiv = document.createElement("div");
    this.#scoreDiv.innerText = "0";
    this.#scoreDiv.className = "score-div";
    this.#app.appendChild(this.#scoreDiv);
    this.#questionDiv = document.createElement("p");
    this.#questionDiv.className = "question-div";
    this.#app.appendChild(this.#questionDiv);
    this.#answerDiv = document.createElement("p");
    this.#answerDiv.id = "answer-div";
    this.#app.appendChild(this.#answerDiv);
    this.#correctSound = new Audio("assets/correct.wav");
    this.#wrongSound = new Audio("assets/wrong.wav");

    this.#createKeyBoard();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  removeEventListeners() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event) {
    const key = event.key;
    const answerDiv = document.getElementById("answer-div");

    if (!isNaN(key) && key !== " ") {
      answerDiv.innerText += key;
    } else if (event.keyCode === 13) {
      // Enter key
      if (eval(this.#expression) == this.#answerDiv.innerText) {
        clearTimeout(this.#timeOut);
        this.#correctSound.play();
        this.#score += 5;
        this.#scoreDiv.innerText = this.#score;
        this.#refresh();
      } else {
        this.#wrongAnswer();
      }
    } else if (key === "-") {
      let textValue = answerDiv.innerText;
      if (textValue === "") {
        answerDiv.innerText = "-";
      } else if (!isNaN(textValue) && parseFloat(textValue) !== 0) {
        answerDiv.innerText = -parseFloat(textValue);
      }
    }
  }

  #createKeyBoard() {
    const keyBoard = document.createElement("div");
    keyBoard.className = "keyboard";
    const leftKeyContainer = document.createElement("div");
    leftKeyContainer.className = "keyboard-left";
    const keyContainer = document.createElement("div");
    keyContainer.className = "keyboard-middle";
    const okButton = document.createElement("button");
    okButton.innerText = "OK";
    okButton.id = "ok-button";
    okButton.onclick = () => {
      if (eval(this.#expression) == this.#answerDiv.innerText) {
        clearTimeout(this.#timeOut);
        this.#correctSound.play();
        this.#score += 5;
        this.#scoreDiv.innerText = this.#score;
        this.#refresh();
      } else {
        this.#wrongAnswer();
      }
    };
    keyBoard.appendChild(leftKeyContainer);
    keyBoard.appendChild(keyContainer);
    keyBoard.appendChild(okButton);

    for (let keyValue = 0; keyValue < 10; keyValue++) {
      const keyButton = document.createElement("button");
      keyButton.innerText = keyValue;

      keyButton.onclick = function () {
        document.getElementById("answer-div").innerText += this.innerText;
      };

      if (keyValue === 0) leftKeyContainer.appendChild(keyButton);
      else keyContainer.appendChild(keyButton);
    }

    const minusButton = document.createElement("button");
    minusButton.innerText = "-";
    minusButton.onclick = () => {
      let textValue = Number(this.#answerDiv.innerText);
      if (textValue) textValue *= -1;
      else textValue = "-";
      this.#answerDiv.innerText = textValue;
    };
    leftKeyContainer.appendChild(minusButton);

    const clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.onclick = () => {
      this.#answerDiv.innerText = "";
    };
    leftKeyContainer.appendChild(clearButton);

    this.#app.appendChild(keyBoard);
  }

  #refresh() {
    let randomNumber = () => Math.floor(Math.random() * 10);

    let operator = () => {
      let op = Math.floor(Math.random() * 3);
      switch (op) {
        case 0:
          return "+";
        case 1:
          return "-";
        case 2:
          return "*";
      }
    };

    let operator1 = operator();
    let operator2 = operator();
    let number1 = randomNumber();
    let number2 = randomNumber();
    let number3 = randomNumber();

    this.#expression = `${number1}${operator1}${number2}${operator2}${number3}`;
    this.#questionDiv.innerText = this.#expression;
    this.#answerDiv.innerText = "";

    if (this.#progressBarContainer.hasChildNodes())
      this.#progressBarContainer.removeChild(
        this.#progressBarContainer.firstChild,
      );
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    this.#progressBarContainer.appendChild(progressBar);

    this.#timeOut = setTimeout(() => {
      this.#timeOver();
    }, 8000);
  }

  #timeOver() {
    this.#wrongAnswer();
    const timeOverDiv = document.createElement("p");
    timeOverDiv.innerText = "Time Over";
    this.#app.insertBefore(timeOverDiv, this.#app.lastChild);
  }

  #wrongAnswer() {
    clearTimeout(this.#timeOut);
    this.#wrongSound.play();
    this.#app.innerHTML = "";
    this.removeEventListeners();
    buildWelcomeScreen();
    const appScoreDiv = document.createElement("p");
    appScoreDiv.innerText = `Your score : ${this.#score}`;
    this.#app.insertBefore(appScoreDiv, this.#app.lastChild);
    const alertDiv = document.createElement("p");
    alertDiv.innerText = `${this.#expression} = ${eval(this.#expression)}`;
    this.#app.insertBefore(alertDiv, this.#app.lastChild);
  }

  run() {
    this.#refresh();
  }
}

window.onload = () => {
  buildWelcomeScreen();
};

function buildWelcomeScreen() {
  const app = document.getElementById("app");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message-div";
  messageDiv.innerText =
    "Welcome to maths game. Play a game with your math skills. Speed Up your calculations";
  app.appendChild(messageDiv);

  const playButton = document.createElement("button");
  playButton.innerText = "Play";
  playButton.className = "play-button";
  playButton.onclick = () => {
    app.innerHTML = "";
    startGame();
  };

  app.appendChild(playButton);
}

function startGame() {
  let game = new Game();
  game.run();
}
