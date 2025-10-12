import "../sass/style.scss";
import { Board, BoardView } from "./clases/board";
import Timer from "./clases/timer";

let timer = new Timer("timer");
let container = document.getElementById("game");
const board = new Board(9, 9, 10, container, timer);
const game = new BoardView(board);
game.createCellsDom();
