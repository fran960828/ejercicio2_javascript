import { shuffleArray } from "../utils/utils";
import Cell from "./cell";
import Timer from "./timer";

class Board {
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

  get cols() {
    return this.#cols;
  }
  get rows() {
    return this.#rows;
  }
  get bomb() {
    return this.#bomb;
  }
  get element() {
    return this.#element;
  }

  buildArray() {
    // Crear array plano con minas y ceros
    const array = Array(this.#bomb)
      .fill("B")
      .concat(Array(this.#cols * this.#rows - this.#bomb).fill(0));
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
      this.cssColorCells(cell);
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
      flag.textContent = `${
        this.#bomb -
        this.cells.flat().filter((cell) => cell.state === "flag").length
      }`;
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
    const flag = document.getElementById("flags");
    flag.textContent = this.#bomb;
    // 5️⃣ Reinicia el temporizador
    this.timer.restart();
  }
  cssColorCells(cell) {
    if (cell.content === 0) cell.element.style.color = "white";
    if (cell.content === 1) cell.element.style.color = "blue";
    if (cell.content === 2) cell.element.style.color = "green";
    if (cell.content === 3) cell.element.style.color = "red";
    if (cell.content === 4) cell.element.style.color = "purple";
    if (cell.content === 5) cell.element.style.color = "maroon";
    if (cell.content === 6) cell.element.style.color = "turquoise";
    if (cell.content === 7) cell.element.style.color = "black";
    if (cell.content === 8) cell.element.style.color = "gray";
  }
  storeBestTime() {
    let difficulty = ""; // Definir fuera de los if para poder usarla después

    // Determinar la dificultad según el número de bombas
    if (this.#bomb === 10) {
      difficulty = "easy";
    } else if (this.#bomb === 40) {
      difficulty = "medium";
    } else if (this.#bomb === 99) {
      difficulty = "hard";
    } else {
      difficulty = "custom"; // Por si acaso
    }

    // Calcular el tiempo total en segundos
    const tiempoTotal =
      this.timer.min * 60 + this.timer.sec + this.timer.ms / 100;

    // Obtener el mejor tiempo guardado para esa dificultad
    const record = JSON.parse(localStorage.getItem(difficulty));

    // Guardar el tiempo si no hay récord o si el nuevo es mejor (menor)
    if (!record || tiempoTotal < record) {
      localStorage.setItem(difficulty, JSON.stringify(tiempoTotal));
      console.log(
        `🎉 Nuevo récord en ${difficulty}: ${tiempoTotal.toFixed(2)}s`
      );
    } else {
      console.log(
        `⏱ No se superó el récord (${record.toFixed(2)}s en ${difficulty})`
      );
    }
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
    const divs = document.querySelectorAll(".cell");
    resetBtn.addEventListener("click", () => this.board.restart(divs));
    this.board.Opencells();
    this.board.addFlagEvent();
  }
}

export { Board, BoardView };
