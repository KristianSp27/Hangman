const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

document.addEventListener("DOMContentLoaded", initGame);

const LETTER_CONTAINER_SELECTOR = "letter-container";
const CHOSEN_WORD_CONTAINER_SELECTOR = "chosen-word-container";
const HANGMAN_SELECTOR = "hangman";
const GAME_OUTCOME_SELECTOR = "game-outcome";

const WORDS = ["APPLE", "BANANA", "CHERRY", "CAT", "DOG", "ELEPHANT", "FISH", "GIRAFFE", "HORSE", "MOUSE"];
const draws = ["gallows", "head", "body", "rightHarm", "leftHarm", "rightLeg", "leftLeg", "rightFoot", "leftFoot"];

let step = 0;
let selectedWord = null;

const canvas = document.getElementById(HANGMAN_SELECTOR);
const context = canvas.getContext("2d");

function initGame() {
  console.log("Booting up the game...");
  drawAlphabet();
  selectWord();
  registerEventListeners();
}

function getLetterIndices(letter) {
  const indices = [];
  let index = selectedWord.indexOf(letter);
  while (index > -1) {
    indices.push(index);
    index = selectedWord.indexOf(letter, index + 1);
  }
  return indices;
}

function handleCorrectGuess(letter) {
  console.log("Marking letter as correct...");
  const letterIndices = getLetterIndices(letter);
  const letters = document.getElementById(CHOSEN_WORD_CONTAINER_SELECTOR).querySelectorAll("span");
  letterIndices.forEach((index) => {
    letters[index].innerText = letter;
  });
  disableLetter(letter);
}

function handleWrongGuess(letter) {
  console.log("Marking letter as wrong...");
  disableLetter(letter);
  drawHangman();
}

function disableLetter(letter) {
  const button = document.getElementById(LETTER_CONTAINER_SELECTOR).querySelector(`button[data-letter="${letter}"]`);
  button.disabled = true;
  button.classList.add("bg-red-500", "text-white", "hover:bg-red-600", "cursor-not-allowed", "opacity-50");
}

function drawHangman() {
  console.log("Drawing the hangman...");
  draw(draws[step++]);
}

function checkIfGameIsOver() {
  const letters = document.getElementById(CHOSEN_WORD_CONTAINER_SELECTOR).querySelectorAll("span");
  const word = Array.from(letters)
    .map((letter) => letter.innerText)
    .join("");
  const winAudio = new Audio("success.mp3");
  const lossAudio = new Audio("sadtrombone.mp3");
  if (word === selectedWord) {
    endGame("Congratulations, You won!");
    winAudio.play();

  } else if (step === draws.length) {
    endGame("You lost! The word was: " + selectedWord);
    lossAudio.play();
  }
}

function endGame(message) {
  console.log("Ending the game...");
  const letterContainer = document.getElementById(LETTER_CONTAINER_SELECTOR);
  const gameOutcomeContainer = document.getElementById(GAME_OUTCOME_SELECTOR);
  letterContainer.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  gameOutcomeContainer.innerText = message;
  letterContainer.classList.add(...["opacity-50", "cursor-not-allowed"]);
  //add restart button
  const restartButton = document.createElement("button");
  restartButton.classList.add(...["bg-blue-500", "hover:bg-blue-400", "text-white", "px-4", "p-2", "mt-4", "rounded"]);
  restartButton.innerText = "Restart";
  restartButton.addEventListener("click", () => window.location.reload());
  gameOutcomeContainer.appendChild(restartButton);
}
function handleLetterSelection(event) {
  const letter = event.target.innerText;
  console.log("Button clicked: " + letter);
  if (selectedWord.includes(letter)) {
    handleCorrectGuess(letter);
  } else {
    handleWrongGuess(letter);
  }
  checkIfGameIsOver();
}

function registerEventListeners() {
  console.log("Registering event listeners...");
  const letterContainer = document.getElementById(LETTER_CONTAINER_SELECTOR);
  // for each button add event listener
  letterContainer.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", handleLetterSelection);
  });

  document.addEventListener("keydown", (event) => {
    const letter = event.key.toUpperCase();
    if (ALPHABET.includes(letter)) {
      const button = letterContainer.querySelector(`button[data-letter="${letter}"]`);
      if (button) {
        button.click();
      }
    }
  });
}

function selectWord() {
  console.log("Selecting a word...");
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  console.log("Selected word is " + word);
  selectedWord = word;
  drawWord(word);
}

function drawWord(word) {
  console.log("Drawing the word...");
  const wordContainer = document.getElementById(CHOSEN_WORD_CONTAINER_SELECTOR);
  const letterElementClasses = ["font-bold", "text-[8rem]", "mr-6"];
  word.split("").forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.classList.add(...letterElementClasses);
    letterElement.innerText = "_";
    wordContainer.appendChild(letterElement);
  });
}

function drawAlphabet() {
  console.log("Drawing the alphabet...");
  const letterContainerClasses = [
    "w-1/6",
    "overflow-hidden",
    "sm:my-2",
    "border-2",
    "text-center",
    "mr-2",
    "border-gray-800",
    "font-bold",
    "text-2xl",
    "text-gray-800",
    "bg-gray-200",
    "hover:bg-gray-300",
    "cursor-pointer",
    "transition",
    "duration-200",
    "ease-in-out",
    "transform",
    "hover:-translate-y-1",
  ];
  const letterContainer = document.getElementById(LETTER_CONTAINER_SELECTOR);
  ALPHABET.forEach((letter) => {
    const letterElement = document.createElement("div");
    letterElement.classList.add(...letterContainerClasses);
    const letterButton = document.createElement("button");
    letterButton.type = "button";
    letterButton.classList.add(["w-full"]);
    letterButton.dataset.letter = letter;
    letterButton.innerText = letter;
    letterElement.appendChild(letterButton);
    letterContainer.appendChild(letterElement);
  });
}

function draw(part) {
  switch (part) {
    case "gallows":
      context.strokeStyle = "#000";
      context.lineWidth = 10;
      context.beginPath();
      context.moveTo(175, 225);
      context.lineTo(5, 225);
      context.moveTo(40, 225);
      context.lineTo(25, 5);
      context.lineTo(100, 5);
      context.lineTo(100, 25);
      context.stroke();
      break;

    case "head":
      context.lineWidth = 5;
      context.beginPath();
      context.arc(100, 50, 25, 0, Math.PI * 2, true);
      context.closePath();
      context.stroke();
      break;

    case "body":
      context.beginPath();
      context.moveTo(100, 75);
      context.lineTo(100, 140);
      context.stroke();
      break;

    case "rightHarm":
      context.beginPath();
      context.moveTo(100, 85);
      context.lineTo(60, 100);
      context.stroke();
      break;

    case "leftHarm":
      context.beginPath();
      context.moveTo(100, 85);
      context.lineTo(140, 100);
      context.stroke();
      break;

    case "rightLeg":
      context.beginPath();
      context.moveTo(100, 140);
      context.lineTo(80, 190);
      context.stroke();
      break;

    case "rightFoot":
      context.beginPath();
      context.moveTo(82, 190);
      context.lineTo(70, 185);
      context.stroke();
      break;

    case "leftLeg":
      context.beginPath();
      context.moveTo(100, 140);
      context.lineTo(125, 190);
      context.stroke();
      break;

    case "leftFoot":
      context.beginPath();
      context.moveTo(122, 190);
      context.lineTo(135, 185);
      context.stroke();
      break;
  }
}
