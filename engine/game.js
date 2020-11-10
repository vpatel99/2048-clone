/*
Add your code for Game here
 */

export default class Game {
  constructor(size) {
    this.size = size;
    this.setupNewGame();
    this.wincallback = [];
    this.losecallback = [];
    this.onMovecallback = [];
  }

  setupNewGame() {
    let board = []; // initial game board that will get filled in with 2 random tiles
    for (let i = 0; i < this.size * this.size; i++) {
      if (i < 2) {
        board.push(twoOrFour());
      } else {
        board.push(0);
      }
    }

    let shuffleboard = shuffle(board); // random location now for the start

    this.gameState = {
      // initialize gamestate
      board: shuffleboard,
      //board: [1024, 1, 2, 3, 4, 5, 6, 7, 9, 10, 110, 1111, 111, 13, 121, 11111],
      //board: [1024, 1024, 2, 3, 4, 5, 6, 7, 9, 10, 110, 1111, 111, 13, 121, 11111],
      //board: [16, 4, 64, 16, 2, 64, 2, 4, 4, 256, 64, 128, 2, 2, 16, 32],
      score: 0,
      won: false,
      over: false,
    };
  }

  loadGame(gameState) {
    this.gameState = gameState;
  }

  move(direction) {
    let org_board = this.gameState.board;
    switch (direction) {
      case 'right':
        this.moveRight();
        break;
      case 'left':
        this.moveLeft();
        break;
      case 'down':
        this.moveDown();
        break;
      case 'up':
        this.moveUp();
        break;
    }

    if (this.gameState.won) {
      this.onWinListeners();
    }

    //;
    //;

    //let rand = addRandom(this.gameState.board, this.size);
    //this.gameState.board = rand;
    let zeros = this.gameState.board.filter((a) => a == 0);

    if (
      JSON.stringify(org_board) != JSON.stringify(this.gameState.board) &&
      zeros.length != 0
    ) {
      // if it didnt change

      let rand = addRandom(this.gameState.board, this.size);
      this.gameState.board = rand;
    }
    if (!this.isAnyMovePossible()) {
      this.gameState.over = true;
      this.onOverListeners();
    }

    this.onMoveListeners();
  }
  onMove(callback) {
    this.onMovecallback.push(callback);
  }

  onWin(callback) {
    this.wincallback.push(callback);
  }
  onLose(callback) {
    this.losecallback.push(callback);
  }

  onMoveListeners() {
    // gamestate parameter
    this.onMovecallback.forEach((element) => {
      element(this.gameState);
    });
  }

  onWinListeners() {
    // gamestate parameter
    this.wincallback.forEach((element) => {
      element(this.gameState);
    });
  }

  onOverListeners() {
    // gamestate parameter
    this.losecallback.forEach((element) => {
      element(this.gameState);
    });
  }

  getGameState() {
    return this.gameState; // should return right one because everytime anything happens, I hopefully will update the property
  }

  moveLeft() {
    //this will be the hardest but that means the others will be ezzzz
    // test if move is feasible if not break (make a copy of board)
    let copy = this.gameState.board;
    let total;
    copy = slideLeft(copy, this.size);

    let results = combineLeft(copy, this.size, this.gameState);
    total = results[1];
    copy = slideLeft(results[0], this.size);

    // if (testdidMove(copy, this.gameState.board)) {
    //   this.gameState.board = copy;
    // } else {
    //   return false;
    // }

    this.gameState.board = copy;
    this.gameState.score += total;
    return true;
  }

  moveDown() {
    let copy = this.gameState.board;
    let total;
    copy = slideDown(copy, this.size);
    let results = combineDown(copy, this.size, this.gameState);

    total = results[1];
    copy = slideDown(results[0], this.size);

    this.gameState.board = copy;
    this.gameState.score += total;
    return true;
  }

  moveUp() {
    let copy = this.gameState.board;
    let total;
    copy = slideUp(copy, this.size);
    let results = combineUp(copy, this.size, this.gameState);
    total = results[1];
    copy = slideUp(results[0], this.size);
    // if (testdidMove(copy, this.gameState.board)) {
    //   this.gameState.board = copy;
    // } else {
    //   return false;
    // }
    // let filt = copy.filter((val) => val == 0);
    // if (filt.length == 0) {
    //   return false;
    // }

    this.gameState.board = copy;
    this.gameState.score += total;
    return true;
  }

  moveRight() {
    let copy = this.gameState.board;
    let total = 0;
    copy = slideRight(copy, this.size);
    let results = combineRight(copy, this.size, this.gameState);
    total = results[1];
    copy = slideRight(results[0], this.size);

    // if (testdidMove(copy, this.gameState.board)) {
    //   this.gameState.board = copy;
    // } else {
    //   return false;
    // }

    this.gameState.board = copy;
    this.gameState.score += total;
    return true;
  }

  toString() {
    let board = this.gameState.board;
    let str = '';
    let conc = '';
    for (let i = 0; i < board.length; i++) {
      str = `  ${board[i]}   `;
      if (i % this.size == this.size - 1) {
        str += '\n';
      }
      conc = conc + str;
    }
    conc += `\n score: ${this.gameState.score}`;
    return conc;
  }

  isAnyMovePossible() {
    // iterate
    let test = false;

    let filt = this.gameState.board.filter((val) => val == 0); // game is only over if you can't slide
    if (filt.length != 0) {
      return true;
    }
    // test rows
    for (let i = 0; i < this.gameState.board.length - 1; i++) {
      if (i % this.size != this.size - 1) {
        if (this.gameState.board[i] == this.gameState.board[i + 1]) {
          test = true;
        }
      }
    }
    // test columns
    for (let i = 0; i < this.size * (this.size - 1); i++) {
      // one whole row won't have anything up/down
      if (this.gameState.board[i] == this.gameState.board[i + this.size]) {
        if (this.gameState.board[i] == this.gameState.board[i + this.size]) {
          test = true;
        }
      }
    }

    return test;
  }
}

export let twoOrFour = () => {
  let rand = Math.random();
  let prob = rand < 0.9 ? 2 : 4;
  return prob;
};

// use KMP's solution for shuffling an array around for a random position
/*
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */

let shuffle = function (array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export let slideRight = function (board, size) {
  let newboard = [];
  for (let i = 0; i < size * size; i++) {
    // go through all the board
    if (i % size == 0) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(board[j + i]); // making a row
      }
      //;
      let slidrow = row.filter((val) => val);
      let missing = size - slidrow.length; // how many 0's need to be added
      let zeros = new Array(missing);
      zeros.fill(0);
      //;
      //;
      let newRow = zeros.concat(slidrow);
      newboard.push(newRow);
    }

    // for (let j = 0; j < size; j++) {
    //   if (!board[size * j + i]) {
    //     // 0 will result in false thx chris
    //   }
    // }
  }
  newboard = [].concat(...newboard);
  return newboard;
};

export let slideLeft = function (board, size) {
  let newboard = [];
  for (let i = 0; i < size * size; i++) {
    // go through all the board
    if (i % size == 0) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(board[j + i]); // making a row
      }
      let slidrow = row.filter((val) => val);
      let missing = size - slidrow.length; // how many 0's need to be added
      let zeros = new Array(missing);
      zeros.fill(0);
      let newRow = slidrow.concat(zeros);
      newboard.push(newRow);
    }
  }
  newboard = [].concat(...newboard);
  return newboard;
};

export let slideUp = function (board, size) {
  let newboard = [];
  for (let i = 0; i < size; i++) {
    // can look at all the columns by going over the first row
    let column = [];
    for (let j = 0; j < size; j++) {
      column.push(board[i + size * j]); // making a column
    }
    let slidrow = column.filter((val) => val);
    let missing = size - slidrow.length; // how many 0's need to be added
    let zeros = new Array(missing);
    zeros.fill(0);
    let newColumn = slidrow.concat(zeros);
    newboard.push(newColumn); //problem now cuz columns are now rows in the newboard
  }
  newboard = [].concat(...newboard);
  let transpose = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      transpose.push(newboard[i + size * j]); // making a column
    }
  }
  return transpose;
};

export let slideDown = function (board, size) {
  let newboard = [];
  for (let i = 0; i < size; i++) {
    // can look at all the columns by going over the first row
    let column = [];
    for (let j = 0; j < size; j++) {
      column.push(board[i + size * j]); // making a column
    }
    let slidrow = column.filter((val) => val);
    let missing = size - slidrow.length; // how many 0's need to be added
    let zeros = new Array(missing);
    zeros.fill(0);
    let newColumn = zeros.concat(slidrow);
    newboard.push(newColumn); //problem now cuz columns are now rows in the newboard
  }
  newboard = [].concat(...newboard);
  let transpose = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      transpose.push(newboard[i + size * j]); // making a column
    }
  }
  return transpose;
};

export let combineLeft = function (board, size, gameState) {
  let total = 0;
  let sum = 0;
  for (let i = 0; i < size * size - 1; i++) {
    if (i % size != size - 1) {
      if (board[i] == board[i + 1]) {
        sum = board[i] + board[i + 1];
        board[i] = sum;
        board[i + 1] = 0;
        total += sum;
      }
    }

    if (sum == 2048) {
      gameState.won = true; // you won the game if you put two tiles together and get 2048
    }
  }
  return [board, total];
};

export let combineRight = function (board, size, gameState) {
  let total = 0;
  let sum = 0;
  let init = 0; // keeping track of where last element of row is
  for (let i = size - 1; i < size * size; i--) {
    if (board[i] == board[i - 1]) {
      sum = board[i] + board[i - 1];
      board[i] = sum;
      board[i - 1] = 0;
      total += sum;
    }
    if ((i - 1) % size == 0) {
      i = i + 2 * size - 1;
    }
    if (sum == 2048) {
      gameState.won = true; // you won the game if you put two tiles together and get 2048
    }
  }
  return [board, total];
};

export let combineUp = function (board, size, gameState) {
  let total = 0;
  let sum = 0;
  for (let i = 0; i < size * (size - 1); i++) {
    // one whole row won't have anything up/down
    if (board[i] == board[i + size]) {
      sum = board[i] + board[i + size];
      board[i] = sum;
      board[i + size] = 0;
      total += sum;
    }

    if (sum == 2048) {
      gameState.won = true; // you won the game if you put two tiles together and get 2048
    }
  }
  return [board, total];
};

export let combineDown = function (board, size, gameState) {
  let total = 0;
  let sum = 0;
  let moved = false;
  for (let i = size * size - 1; i >= size; i--) {
    // start at end of array and look at the one above it (i - size)
    // one whole row won't have anything above it so stop at the first element in the second row
    if (board[i] == board[i - size]) {
      sum = board[i] + board[i - size];
      board[i] = sum;
      board[i - size] = 0;
      total += sum;
    }

    if (sum == 2048) {
      gameState.won = true; // you won the game if you put two tiles together and get 2048
    }
  }
  return [board, total];
};

export let addRandom = function (board, size) {
  let ind = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] == 0) {
      ind.push(i);
    }
  }
  let prob = Math.random();
  let rand = Math.floor(prob * ind.length); // number between 0 and ind.length
  let index = ind[rand]; // random number from all indexes that aren't zero
  board[index] = twoOrFour();
  return board;

  // while (true) {
  //   let prob = Math.random();
  //   let rand = Math.floor(prob * (size * size - 1));
  //   if (board[rand] == 0) {
  //     board[rand] = twoOrFour();
  //     break;
  //   }
  // }
  return board;
};

/*
const testdidMove = function (original, newArray) {
  // for testing if move did anything
  for (let i = 0; i < original.length; i++) {
    if (original[i] != newArray[i]) {
      return true;
    }
  }
  return false;
};
*/
