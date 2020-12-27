import './style.css';

import {SceneManager} from "./scene_manager/SceneManager";
import {BoardSceneContainer} from "./scenes/BoardSceneContainer";

const gameCanvas = <HTMLCanvasElement>document.getElementById("game_canvas");

const sceneManager = new SceneManager(gameCanvas);


let scenes = new BoardSceneContainer();


sceneManager.setSceneContainer(scenes);


function animate(): void {
  requestAnimationFrame(animate);
  render();
}

function render(): void {
  sceneManager.update();
}

animate();
