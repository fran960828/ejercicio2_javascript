import "../sass/style.scss";
import { Board, BoardView } from "./clases/board";
import Timer from "./clases/timer";

// Seleccion del nivel de dificultad
let row = 0,
  col = 0,
  bomb = 0;
const overlay = document.querySelector(".popup");
level_btns = document.querySelectorAll(".level__btn");
level_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const level = e.target.dataset.level;
    if (level === "easy") {
      row = 9;
      col = 9;
      bomb = 10;
    } else if (level === "medium") {
      row = 16;
      col = 16;
      bomb = 40;
    } else if (level === "hard") {
      row = 16;
      col = 30;
      bomb = 99;
    }
    overlay.style.display = "none";
    let timer = new Timer("timer");
    timer.reset();
    container.innerHTML = "";
    const board = new Board(row, col, bomb, container, timer);
    const game = new BoardView(board);
    game.createCellsDom();
  });
});
