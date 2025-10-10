import { shuffleArray } from "../utils/utils";
import Cell from "./cell";
class Board {
  #cols;
  #rows;
  board;

  constructor(cols, rows) {
    this.#cols = cols;
    this.#rows = rows;
    this.board = [];
  }
  get cols() {
    return this.#cols;
  }
  get rows() {
    return this.#rows;
  }
  buildArray() {
    const array = Array(this.#cols)
      .fill("B")
      .concat(Array(this.#cols * this.#rows - this.#cols).fill(0));
    shuffleArray(array);
    const arrayBi = [];
    for (let i = 0; i < this.#cols; i++) {
      arrayBi.push(array.slice(i * this.#cols, (i + 1) * this.#cols));
    }
    this.board = this.asignArray(arrayBi);
    return this.board;
  }
  asignArray(array) {
    const movs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] === "B") {
          movs.forEach(([dx, dy]) => {
            const nuevoI = i + dx;
            const nuevoJ = j + dy;

            if (
              nuevoI >= 0 &&
              nuevoI < array.length &&
              nuevoJ >= 0 &&
              nuevoJ < array[i].length &&
              array[nuevoI][nuevoJ] !== "B"
            ) {
              array[nuevoI][nuevoJ] += 1;
            }
          });
        }
      }
    }

    return array;
  }
}

class BoardView {
  #board;
  #element;
  cells;
  constructor(board, element) {
    this.#board = board.buildArray(); // buildArray debe devolver el array 2D
    this.#element = document.getElementById(element);
    this.cells = [];
  }

  get board() {
    return this.#board;
  }

  createCellsDom() {
    for (let i = 0; i < this.#board.length; i++) {
      for (let j = 0; j < this.#board[i].length; j++) {
        let cell = new Cell(i, j, this.#board[i][j]);
        let newDiv = document.createElement("div");
        newDiv.classList.add("cell");
        newDiv.dataset.row = i;
        newDiv.dataset.col = j;

        cell.element = newDiv;
        this.cells.push(cell);
        this.#element.appendChild(newDiv);
      }
    }
  }
}

export { Board, BoardView };
