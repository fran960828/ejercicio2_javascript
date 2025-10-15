import "../sass/style.scss";
import App from "./clases/app";
import { Board, BoardView } from "./clases/board";
import Timer from "./clases/timer";

const container = document.getElementById("game");
const timer = new Timer("timer");
App.getRowsColsBombs(container).then(({ row, col, bomb }) => {
  App.gridRowsCols(container, row, col);
  const board = new Board(col, row, bomb, container, timer);
  const game = new BoardView(board);
  game.createCellsDom();
});

const difficultyBtn = document.getElementById("difficulty");
difficultyBtn.addEventListener("click", () => {
  const divs = document.querySelectorAll(".cell");
  divs.forEach((div) => div.remove());
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "flex";
  App.getRowsColsBombs(container).then(({ row, col, bomb }) => {
    App.gridRowsCols(container, row, col);
    const board = new Board(col, row, bomb, container, timer);
    const game = new BoardView(board);
    game.createCellsDom();
  });
});
App.stadistics();
