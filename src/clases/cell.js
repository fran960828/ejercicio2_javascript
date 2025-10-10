class Cell {
  #col;
  #row;
  #state;
  #content;
  #element;
  constructor(row, col, content, state = "cerrada") {
    this.#col = col;
    this.#row = row;
    this.#content = content;
    this.#state = state;
  }
  get col() {
    return this.#col;
  }
  get row() {
    return this.#row;
  }
  get state() {
    return this.#state;
  }
  get content() {
    return this.#content;
  }
  set element(element) {
    this.#element = element;
  }
  set state(state) {
    this.#state = state;
  }
  set content(content) {
    this.#content = content;
  }
}
export default Cell;
