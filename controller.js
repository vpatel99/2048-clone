export default class Controller {
  constructor(model, view) {
    //let game = new Game(4);
    this.model = model;
    this.view = view;
    this.view.div;

    let highscore = localStorage.getItem('highscore');

    let winCon = function (gamestate) {
      let gameOver = document.getElementById('gameOver');
      gameOver.innerHTML = 'You won!';
    };

    let loseCon = function (gamestate) {
      let gameOver = document.getElementById('gameOver');
      gameOver.innerHTML = `You lost`;
      highscore = gamestate.score > highscore ? gamestate.score : highscore;
      localStorage.setItem('highscore', highscore);
      document.getElementById(
        'high'
      ).innerHTML = `Your best: ${localStorage.getItem('highscore')}`;
    };

    model.onWin(winCon);
    model.onLose(loseCon);

    let reset = function () {
      model.setupNewGame();
      let make = (document.getElementById('gameOver').innerHTML =
        "Make your move! You haven't lost or won yet");
      view.update(model);
    };

    let move = function (event) {
      if (event.keyCode === 37) {
        model.move('left');
        view.update(model);
        //left
      } else if (event.keyCode === 39) {
        //right
        model.move('right');
        view.update(model);
      } else if (event.keyCode === 38) {
        //up
        model.move('up');
        view.update(model);
      } else if (event.keyCode === 40) {
        //down
        model.move('down');
        view.update(model);
      }
    };
    //let resetButton = document.createElement('button');
    //resetButton.click(reset);
    //$('tiles').append(resetButton);

    $('body').on('keydown', move); // make it respond to keyboard events

    let re = document.getElementById('reset');
    re.addEventListener('click', reset);
  }
}

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
