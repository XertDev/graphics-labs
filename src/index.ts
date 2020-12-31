import './style.css';

import Game from "./Game";

const gameCanvas = <HTMLCanvasElement>document.getElementById("game_canvas");

const game = new Game(gameCanvas);
game.init().then(() => {
  game.run();
});




