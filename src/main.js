import "../sass/style.scss";
import App from "./clases/app.js";
import Timer from "./clases/timer.js";

// Elementos base
const container = document.getElementById("game");
const timer = new Timer("timer");

// Inicializa la aplicación
const app = new App(container, timer);
app.init();

