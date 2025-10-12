// Clase Timer para gestionar un cronómetro
class Timer {
  // Propiedades del cronómetro
  min; // Minutos
  sec; // Segundos
  ms; // Milisegundos
  count; // Identificador del intervalo
  malt; // Minutos con formato (dos dígitos)
  salt; // Segundos con formato (dos dígitos)
  msalt; // Milisegundos con formato (dos dígitos)
  idElement; // ID del elemento HTML donde se mostrará el cronómetro

  // Constructor: inicializa el cronómetro y asigna el ID del elemento HTML
  constructor(idElement = "timer") {
    this.idElement = idElement; // ID del elemento donde se mostrará el tiempo
    this.ms = 0; // Inicializar milisegundos en 0
    this.min = 0; // Inicializar minutos en 0
    this.sec = 0; // Inicializar segundos en 0
  }

  // Método para iniciar el cronómetro
  start() {
    // Detener cualquier intervalo existente antes de iniciar uno nuevo
    if (this.count) {
      return;
    }
    // Usar setInterval para actualizar el tiempo cada 10 ms
    this.count = setInterval(() => {
      // Incrementar milisegundos y manejar el desbordamiento
      if (this.ms == 100) {
        this.ms = 0; // Reiniciar milisegundos
        if (this.sec == 60) {
          this.sec = 0; // Reiniciar segundos
          this.min++; // Incrementar minutos
        } else {
          this.sec++; // Incrementar segundos
        }
      } else {
        this.ms++; // Incrementar milisegundos
      }

      // Formatear los valores de minutos, segundos y milisegundos
      this.malt = this.pad(this.min);
      this.salt = this.pad(this.sec);
      this.msalt = this.pad(this.ms);

      // Actualizar el texto del cronómetro en el DOM
      this.update(this.malt + ":" + this.salt + ":" + this.msalt);
    }, 10); // Actualización cada 10 ms
  }

  // Método para detener el cronómetro
  stop() {
    clearInterval(this.count); // Detener el intervalo
  }

  // Método para actualizar el texto del cronómetro en el DOM
  update(txt) {
    let temp = document.getElementById(this.idElement); // Obtener el elemento HTML
    temp.firstChild.nodeValue = txt; // Actualizar el contenido del texto
  }

  // Método para reiniciar el cronómetro
  restart() {
    this.stop(); // Detener el cronómetro
    this.ms = 0; // Reiniciar milisegundos
    this.sec = 0; // Reiniciar segundos
    this.min = 0; // Reiniciar minutos
    this.update("00:00:00"); // Actualizar el texto a "00:00:00"
    this.start(); // Iniciar el cronómetro nuevamente
  }

  // Método para formatear los valores de tiempo a dos dígitos
  pad(time) {
    let temp;
    if (time < 10) {
      temp = "0" + time; // Agregar un 0 al inicio si el valor es menor a 10
    } else {
      temp = time; // Mantener el valor si es mayor o igual a 10
    }
    return temp; // Retornar el valor formateado
  }
}
export default Timer;
