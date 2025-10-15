/**
 * Clase Timer
 * Gestiona un cronómetro con minutos, segundos y milisegundos.
 */
export default class Timer {
  constructor(idElement = "timer") {
    this.idElement = idElement;
    this.ms = 0;
    this.sec = 0;
    this.min = 0;
    this.count = null;
  }

  // Inicia el cronómetro
  start() {
    if (this.count) return;

    this.count = setInterval(() => {
      if (this.ms === 100) {
        this.ms = 0;
        if (this.sec === 60) {
          this.sec = 0;
          this.min++;
        } else {
          this.sec++;
        }
      } else {
        this.ms++;
      }

      const malt = this.pad(this.min);
      const salt = this.pad(this.sec);
      const msalt = this.pad(this.ms);
      this.update(`${malt}:${salt}:${msalt}`);
    }, 10);
  }

  // Detiene el cronómetro
  stop() {
    clearInterval(this.count);
    this.count = null;
  }

  // Actualiza el valor mostrado en el DOM
  update(txt) {
    const temp = document.getElementById(this.idElement);
    if (temp && temp.firstChild) temp.firstChild.nodeValue = txt;
  }

  // Reinicia el cronómetro
  restart() {
    this.stop()
    this.ms = 0;
    this.sec = 0;
    this.min = 0;
    this.update("00:00:00");
  }

  // Formatea el número a dos dígitos
  pad(time) {
    return time < 10 ? "0" + time : time;
  }
}

