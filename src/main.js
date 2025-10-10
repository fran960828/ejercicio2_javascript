import "../sass/style.scss";
import { Board, BoardView } from "./clases/board";

const board = new Board(9, 9);
const game = new BoardView(board, "juego");

game.createCellsDom();
