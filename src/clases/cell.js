/**
 * Clase Cell
 * Representa una celda individual del tablero del Buscaminas.
 */
export default class Cell {
  #col;
  #row;
  #state;
  #content;
  #element;

  constructor(row, col, content, state = "close") {
    this.#col = col;
    this.#row = row;
    this.#content = content;
    this.#state = state;
  }

  get col() { return this.#col; }
  get row() { return this.#row; }
  get state() { return this.#state; }
  get content() { return this.#content; }
  get element() { return this.#element; }

  set element(element) { this.#element = element; }
  set state(state) { this.#state = state; }
  set content(content) { this.#content = content; }
}

