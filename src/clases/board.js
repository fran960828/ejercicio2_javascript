import { shuffleArray } from "../utils/utils";
import Cell from "./cell";
import Timer from "./timer";

class Board {
  #cols;
  #rows;
  #element;
  cells;

  constructor(cols, rows, element, timer) {
    this.#cols = cols;
    this.#rows = rows;
    this.#element = element;
    this.timer = timer;
    this.cells = [];
  }

  get cols() {
    return this.#cols;
  }

  get rows() {
    return this.#rows;
  }
  get element() {
    return this.#element;
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
  Opencells() {
    this.timer.start();
    this.#element.addEventListener("click", (event) => {
      const div = event.target.closest(".cell");

      if (!div) return;
      const cell = this.cells.flat().find((cell) => cell.element === div);
      if (!cell || cell.state !== "close") return;
      if (cell.content === "B") {
        cell.element.textContent = "💣";
        cell.state = "bomb";
        this.checkStateGame();
      } else if (cell.content > 0) {
        cell.element.textContent = cell.content;
        cell.state = "open";
        this.checkStateGame();
      } else {
        this.revealAdjacent(cell.row, cell.col);
        this.checkStateGame();
      }
    });
  }
  revealAdjacent(row, col) {
    // Evita índices fuera de rango
    if (
      row < 0 ||
      row >= this.cells.length ||
      col < 0 ||
      col >= this.cells[0].length
    )
      return;

    const cell = this.cells.flat().find((c) => c.row === row && c.col === col);
    if (
      !cell ||
      cell.state === "open" ||
      cell.state === "flag" ||
      cell.content === "B"
    )
      return;

    // Mostrar el valor si > 0
    if (cell.content > 0) {
      cell.element.textContent = cell.content;
      cell.state = "open";
      return; // detenemos la propagación aquí
    }

    // Si es 0, se abre y se propaga a vecinos
    cell.state = "open";
    cell.element.textContent = cell.content;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      this.revealAdjacent(row + dx, col + dy);
    }
  }
  checkStateGame() {
    const cellOpen = this.cells.flat().filter((cell) => cell.state === "open");
    if (cellOpen.length === this.#cols * this.#rows - this.#cols) {
      this.timer.stop();
      const pWin = document.createElement("p");
      pWin.classList.add("result");
      pWin.textContent = "Has Ganado";
      document.body.appendChild(pWin);
    }
    const bombOpen = this.cells.flat().find((cell) => cell.state === "bomb");
    if (bombOpen) {
      this.cells.flat().forEach((cell) => {
        if (cell.content === "B") {
          cell.element.textContent = "💣";
        }
      });
      this.timer.stop();
      const pLose = document.createElement("p");
      pLose.classList.add("result");
      pLose.textContent = "Has Perdido";
      document.body.appendChild(pLose);
    }
  }
  addFlagEvent() {
    this.#element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const div = event.target.closest(".cell");
      if (!div) return;
      const cell = this.cells.flat().find((cell) => cell.element === div);
      if (!cell || cell.state === "open") return;
      if (cell.state === "close") {
        cell.state = "flag";
        cell.element.textContent = "🚩";
      } else if (cell.state === "flag") {
        cell.state = "close";
        cell.element.textContent = "";
      }
    });
  }
  restart(divs) {
    // 1️⃣ Quita mensajes de victoria/derrota
    const result = document.querySelector(".result");
    if (result) result.remove();

    // 2️⃣ Limpia el contenido visual de cada celda
    divs.forEach((div) => (div.textContent = ""));

    // 3️⃣ Genera nuevo tablero lógico
    const newArray = this.buildArray();

    // 4️⃣ Actualiza contenido y estado de cada celda (sin tocar el DOM)
    newArray.flat().forEach((cell, i) => {
      cell.element = divs[i];
      cell.state = "close";
    });

    // 5️⃣ Reinicia eventos y temporizador
    this.timer.restart();
    this.Opencells();
    this.addFlagEvent();
  }
}

class BoardView {
  constructor(board) {
    this.board = board;
  }

  createCellsDom() {
    let cellsMatrix = this.board.buildArray();
    cellsMatrix.forEach((row) => {
      row.forEach((cell) => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("cell");
        cell.element = newDiv;
        this.board.element.appendChild(newDiv);
      });
    });
    const resetBtn = document.getElementById("reset");
    const header = document.querySelector(".header");
    header.prepend(resetBtn);
    const divs = document.querySelectorAll(".cell");
    resetBtn.addEventListener("click", () => this.board.restart(divs));
    this.board.Opencells();
    this.board.addFlagEvent();
  }
}

export { Board, BoardView };
