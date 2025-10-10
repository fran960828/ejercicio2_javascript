import "../sass/style.scss";
import { Board, BoardView } from "./clases/board";
let container=document.getElementById('game')
const board = new Board(9, 9,container);
const game = new BoardView(board);
console.log(board.element)

game.createCellsDom()