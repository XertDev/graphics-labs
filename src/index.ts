import './style.css';

import App from "./App";

const gameCanvas = <HTMLCanvasElement>document.getElementById("game_canvas");

const game = new App(gameCanvas);
game.init().then(() => {
  game.run();
});




