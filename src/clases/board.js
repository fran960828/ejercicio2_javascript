import { shuffleArray } from "../utils/utils";
import Cell from "./cell";

class Board {
  #cols;
  #rows;
  #element;
  cells;

  constructor(cols, rows,element) {
    this.#cols = cols;
    this.#rows = rows;
    this.#element=element
    this.cells = [];
  }

  get cols() {
    return this.#cols;
  }

  get rows() {
    return this.#rows;
  }
  get element(){
    return this.#element
  }

  buildArray() {
    // Crear array plano con minas y ceros
    const array = Array(this.#cols)
      .fill("B")
      .concat(Array(this.#cols * this.#rows - this.#cols).fill(0));
    shuffleArray(array);

    // Convertir a matriz bidimensional
    let arrayBi = [];
    for (let i = 0; i < this.#rows; i++) {
      arrayBi.push(array.slice(i * this.#cols, (i + 1) * this.#cols));
    }

    // Asignar números a las celdas según minas
    const arraycells = this.asignArray(arrayBi);

    // Crear matriz de instancias Cell
    this.cells = [];
    for (let i = 0; i < this.#rows; i++) {
      let rowCells = [];
      for (let j = 0; j < this.#cols; j++) {
        let cell = new Cell(i, j, arraycells[i][j]);
        rowCells.push(cell);
      }
      this.cells.push(rowCells);
    }
    return this.cells;
  }

  asignArray(array) {
    const movs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
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
  constructor(board) {
    this.board=board
  }

  createCellsDom() {
    let cellsMatrix=this.board.buildArray()
    cellsMatrix.forEach(row => {
      row.forEach(cell => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("cell");
        cell.element = newDiv;
        this.board.element.appendChild(newDiv);
      });
    });
  }
}

export { Board, BoardView };
