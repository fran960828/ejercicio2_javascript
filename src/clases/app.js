class App {
  static getRowsColsBombs(container) {
    return new Promise((resolve) => {
      const overlay = document.querySelector(".overlay");
      const level_btns = document.querySelectorAll(".level__btn");

      level_btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const level = e.currentTarget.dataset.level;
          let row, col, bomb;

          if (level === "easy") {
            row = 9;
            col = 9;
            bomb = 10;
          } else if (level === "medium") {
            row = 16;
            col = 16;
            bomb = 40;
          } else if (level === "hard") {
            row = 16;
            col = 30;
            bomb = 99;
          }

          // Ocultar overlay
          setTimeout(() => {
            overlay.style.display = "none";
          }, 400);

          // Limpia el contenedor
          container.innerHTML = "";

          // Resuelve la promesa con los datos seleccionados
          resolve({ row, col, bomb });
        });
      });
    });
  }
  static gridRowsCols(container,row,col){
    container.style.gridTemplateColumns=`repeat(${col}, 30px)`
    container.style.gridTemplateRows=`repeat(${row}, 30px)`
  }
}

export default App;
