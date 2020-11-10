import Game from './engine/game.js';
import Controller from './controller.js';
import GameView from './view.js';

let model = null;
let c = null;
let view = null;

document.addEventListener('DOMContentLoaded', function () {
  model = new Game(4);
  view = new GameView(model);
  c = new Controller(model, view);
  $('root').empty().append(view.div);
});
