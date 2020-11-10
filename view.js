export default class GameView {
  constructor(model) {
    this.model = model;
    this.listeners = [];
    this.div = document.createElement('div');
    this.setupNewBoard();
  }

  setupNewBoard() {
    if (localStorage.getItem('highscore') != null) {
      document.getElementById(
        'high'
      ).innerHTML = `Your best: ${localStorage.getItem('highscore')}`;
    }

    let tiles = document.getElementById('tiles');
    for (let r = 0; r < this.model.size; r++) {
      let row = document.createElement('div');
      for (let c = 0; c < this.model.size; c++) {
        let tile_view = document.createElement('div');
        tile_view.setAttribute('id', `${r * this.model.size + c}`);
        tile_view.add;
        tile_view.className += 'grid-container';
        tile_view.style.fontSize = '40px';
        tile_view.style.width = '100px';
        tile_view.style.height = '100px';
        tile_view.style.border = '2px solid';
        tile_view.style.display = 'flex';
        tile_view.style.alignContent = 'center';
        tile_view.style.alignSelf = 'center';
        tile_view.style.justifyContent = 'center';
        tile_view.style.backgroundColor = '#61c6d3';

        tile_view.innerHTML = this.model.gameState.board[
          r * this.model.size + c
        ];
        row.append(tile_view);
      }
      tiles.append(row);
      let scores = document.getElementById('score');
      scores.style.fontSize = '40px';
      scores.innerHTML = `Score: ${this.model.gameState.score}`;
    }
  }

  update(new_model) {
    for (let r = 0; r < new_model.size; r++) {
      for (let c = 0; c < new_model.size; c++) {
        let til = document.getElementById(`${r * new_model.size + c}`);
        til.innerHTML = new_model.gameState.board[r * new_model.size + c];
      }
      let scores = document.getElementById('score');
      scores.innerHTML = `Score: ${new_model.gameState.score}`;
    }
  }

  reset() {
    this.model.setupNewBoard();
    update(this.model);
  }
}
