import { Board } from "./board.js";
import { BoardView } from "./boardView.js";

/**
 * Clase App
 * Controla todo el flujo del juego: selección de dificultad, creación del tablero,
 * cambio de dificultad y estadísticas.
 */
export default class App {
  constructor(container, timer) {
    this.container = container;
    this.timer = timer;
  }

  async init() {
    const { row, col, bomb } = await this.getRowsColsBombs();
    this.setupBoard(row, col, bomb);
    this.handleDifficultyChange();
    this.stadistics();
  }

  getRowsColsBombs() {
    return new Promise((resolve) => {
      const overlay = document.querySelector(".overlay");
      const level_btns = document.querySelectorAll(".level__btn");

      level_btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const level = e.currentTarget.dataset.level;
          let row, col, bomb;

          if (level === "easy") { row = 9; col = 9; bomb = 10; }
          else if (level === "medium") { row = 16; col = 16; bomb = 40; }
          else if (level === "hard") { row = 16; col = 30; bomb = 99; }

          setTimeout(() => { overlay.style.display = "none"; }, 400);
          this.container.innerHTML = "";
          resolve({ row, col, bomb });
        });
      });
    });
  }

  setupBoard(row, col, bomb) {
    this.gridRowsCols(row, col);
    const board = new Board(col, row, bomb, this.container, this.timer);
    const game = new BoardView(board);
    game.createCellsDom();
  }

  gridRowsCols(row, col) {
    this.container.style.gridTemplateColumns = `repeat(${col}, 30px)`;
    this.container.style.gridTemplateRows = `repeat(${row}, 30px)`;
  }

  handleDifficultyChange() {
    const difficultyBtn = document.getElementById("difficulty");
    difficultyBtn.addEventListener("click", async () => {
      const divs = document.querySelectorAll(".cell");
      divs.forEach((div) => div.remove());
      const overlay = document.querySelector(".overlay");
      overlay.style.display = "flex";

      const { row, col, bomb } = await this.getRowsColsBombs();
      this.setupBoard(row, col, bomb);
    });
  }

  stadistics() {
    const modal = document.getElementById("statsModal");
    const statsList = document.getElementById("statsList");

    document.getElementById("statsBtn").addEventListener("click", () => {
      const easy = JSON.parse(localStorage.getItem("easy"));
      const medium = JSON.parse(localStorage.getItem("medium"));
      const hard = JSON.parse(localStorage.getItem("hard"));

      statsList.innerHTML = `
        <li><strong>Fácil:</strong> ${easy ? easy.toFixed(2) + "s" : "—"}</li>
        <li><strong>Medio:</strong> ${medium ? medium.toFixed(2) + "s" : "—"}</li>
        <li><strong>Difícil:</strong> ${hard ? hard.toFixed(2) + "s" : "—"}</li>
      `;
      modal.style.display = "block";
    });

    document.getElementById("closeModal").addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
}

