import Cell from "./cell.js";
import {shuffleArray} from "../utils/utils.js"

/**
 * Clase Board
 * Contiene la lógica del juego del Buscaminas.
 */
export class Board {
  #cols;
  #rows;
  #bomb;
  #element;
  cells;

  constructor(cols, rows, bomb, element, timer) {
    this.#cols = cols;
    this.#rows = rows;
    this.#bomb = bomb;
    this.#element = element;
    this.timer = timer;
    this.cells = [];
  }

  get cols() { return this.#cols; }
  get rows() { return this.#rows; }
  get bomb() { return this.#bomb; }
  get element() { return this.#element; }

  // Crea la matriz de celdas
  buildArray() {
    const array = Array(this.#bomb).fill("B")
      .concat(Array(this.#cols * this.#rows - this.#bomb).fill(0));

    shuffleArray(array);

    const arrayBi = [];
    for (let i = 0; i < this.#rows; i++) {
      arrayBi.push(array.slice(i * this.#cols, (i + 1) * this.#cols));
    }

    const arraycells = this.asignArray(arrayBi);
    this.cells = [];

    for (let i = 0; i < this.#rows; i++) {
      const rowCells = [];
      for (let j = 0; j < this.#cols; j++) {
        const cell = new Cell(i, j, arraycells[i][j]);
        rowCells.push(cell);
      }
      this.cells.push(rowCells);
    }

    return this.cells;
  }

  // Asigna los números alrededor de las bombas
  asignArray(array) {
    const movs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] === "B") {
          movs.forEach(([dx, dy]) => {
            const ni = i + dx;
            const nj = j + dy;
            if (
              ni >= 0 &&
              ni < array.length &&
              nj >= 0 &&
              nj < array[i].length &&
              array[ni][nj] !== "B"
            ) {
              array[ni][nj] += 1;
            }
          });
        }
      }
    }
    return array;
  }

  // --------------------- INTERACCIÓN ---------------------

  Opencells() {
    this.#element.addEventListener("click", (event) => {
      this.timer.start();
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
        this.cssColorCells(cell);
        this.checkStateGame();
      } else {
        this.revealAdjacent(cell.row, cell.col);
        this.checkStateGame();
      }
    });
  }

  // Revela celdas vacías de forma recursiva
  revealAdjacent(row, col) {
    if (
      row < 0 ||
      row >= this.cells.length ||
      col < 0 ||
      col >= this.cells[0].length
    ) return;

    const cell = this.cells[row][col];
    if (!cell || cell.state === "open" || cell.state === "flag" || cell.content === "B") return;

    if (cell.content > 0) {
      cell.element.textContent = cell.content;
      cell.state = "open";
      this.cssColorCells(cell);
      return;
    }

    cell.state = "open";
    cell.element.textContent = cell.content;

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    for (const [dx, dy] of directions) {
      this.revealAdjacent(row + dx, col + dy);
    }
  }

  // Comprueba si el jugador gana o pierde
  checkStateGame() {
    const cellOpen = this.cells.flat().filter((cell) => cell.state === "open");
    if (cellOpen.length === this.#cols * this.#rows - this.#bomb) {
      this.timer.stop();
      this.storeBestTime();
      const pWin = document.createElement("div");
      pWin.classList.add("result");
      pWin.innerHTML = `<div class="popup"><h2>PARTIDA GANADA</h2></div>`;
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
      const pLose = document.createElement("div");
      pLose.classList.add("result");
      pLose.innerHTML = `<div class="popup"><h2>PARTIDA PERDIDA</h2></div>`;
      document.body.appendChild(pLose);
    }
  }

  // Evento para colocar banderas
  addFlagEvent() {
    const flag = document.getElementById("flags");
    flag.textContent = this.#bomb;

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

      flag.textContent = `${this.#bomb - this.cells.flat().filter((c) => c.state === "flag").length}`;
    });
  }

  // Reinicia el tablero
  restart(divs) {
    const result = document.querySelector(".result");
    if (result) result.remove();

    divs.forEach((div) => (div.textContent = ""));

    const newArray = this.buildArray();
    newArray.flat().forEach((cell, i) => {
      cell.element = divs[i];
      cell.state = "close";
    });

    const flag = document.getElementById("flags");
    flag.textContent = this.#bomb;

    this.timer.restart();
  }

  // Colores para los números
  cssColorCells(cell) {
    const colors = ["white", "blue", "green", "red", "purple", "maroon", "turquoise", "black", "gray"];
    cell.element.style.color = colors[cell.content] || "black";
  }

  // Guarda el mejor tiempo
  storeBestTime() {
    let difficulty = "";
    if (this.#bomb === 10) difficulty = "easy";
    else if (this.#bomb === 40) difficulty = "medium";
    else if (this.#bomb === 99) difficulty = "hard";
    else difficulty = "custom";

    const tiempoTotal = this.timer.min * 60 + this.timer.sec + this.timer.ms / 100;
    const record = JSON.parse(localStorage.getItem(difficulty));

    if (!record || tiempoTotal < record) {
      localStorage.setItem(difficulty, JSON.stringify(tiempoTotal));
    }
  }
}

