import './style.css';

import {SceneManager} from "./scene_manager/SceneManager";
import {BoardSceneContainer} from "./scenes/BoardSceneContainer";
import {MenuSceneContainer} from "./scenes/MenuSceneContainer";

const gameCanvas = <HTMLCanvasElement>document.getElementById("game_canvas");

const sceneManager = new SceneManager(gameCanvas);

document.addEventListener("click", (e) => sceneManager.onClick(e));
window.addEventListener('mousemove', (e) => sceneManager.onMouseMove(e));

let scenes = new MenuSceneContainer();




function animate(): void {
  requestAnimationFrame(animate);
  render();
}

function render(): void {
  sceneManager.update();
}

sceneManager.setSceneContainer(scenes).then(() => {
  animate();
});


