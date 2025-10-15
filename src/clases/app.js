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
  static gridRowsCols(container, row, col) {
    container.style.gridTemplateColumns = `repeat(${col}, 30px)`;
    container.style.gridTemplateRows = `repeat(${row}, 30px)`;
  }
  static stadistics() {
    const modal = document.getElementById("statsModal");
    const statsList = document.getElementById("statsList");

    document.getElementById("statsBtn").addEventListener("click", () => {
      // Leer directamente del localStorage
      const easy = JSON.parse(localStorage.getItem("easy"));
      const medium = JSON.parse(localStorage.getItem("medium"));
      const hard = JSON.parse(localStorage.getItem("hard"));

      // Mostrar los tiempos formateados
      let liEasy = document.createElement("li");
      debugger;
      liEasy.innerHTML = `<strong>Fácil:</strong> ${
        easy ? easy.toFixed(2) + "s" : "—"
      }`;
      let liMedium = document.createElement("li");
      liMedium.innerHTML = `<strong>Medio:</strong> ${
        medium ? medium.toFixed(2) + "s" : "—"
      }`;
      let liHard = document.createElement("li");
      liHard.innerHTML = `<strong>Difícil:</strong> ${
        hard ? hard.toFixed(2) + "s" : "—"
      }`;

      statsList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos
      statsList.appendChild(liEasy);
      statsList.appendChild(liMedium);
      statsList.appendChild(liHard);

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

export default App;
