/**
 * Clase BoardView
 * Se encarga de generar visualmente el tablero en el DOM.
 */
export class BoardView {
  constructor(board) {
    this.board = board;
  }
  // Inserta las celdas en el dom y añade los eventos
  createCellsDom() {
    const cellsMatrix = this.board.buildArray();
    cellsMatrix.forEach((row) => {
      row.forEach((cell) => {
        const newDiv = document.createElement("div");
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
