# 💣 Buscaminas — JavaScript Puro (ES6+)

Implementación completa del clásico juego **Buscaminas** utilizando **JavaScript moderno sin frameworks**, con una arquitectura modular, clases orientadas a objetos, temporizador, almacenamiento de récords y selección dinámica de dificultad.

---

## 🚀 Características principales

✅ **Arquitectura modular y escalable**  
Organizado en clases independientes (`Timer`, `Cell`, `Board`, `BoardView`, `App`) con import/export entre archivos.

✅ **Programación Orientada a Objetos (POO)**  
Cada clase tiene una responsabilidad clara, facilitando la mantenibilidad y la legibilidad del código.

✅ **Selección de dificultad interactiva**  
Tres niveles predefinidos:  
- 🟩 Fácil: 9x9 con 10 bombas  
- 🟨 Medio: 16x16 con 40 bombas  
- 🟥 Difícil: 16x30 con 99 bombas  

✅ **Cronómetro en tiempo real**  
Temporizador de precisión con formato `mm:ss:ms`, controlado por la clase `Timer`.

✅ **Almacenamiento de récords en LocalStorage**  
Guarda los mejores tiempos por dificultad y los muestra en una ventana de estadísticas.

✅ **Cambio dinámico de dificultad**  
Permite reiniciar el tablero o seleccionar un nuevo nivel sin recargar la página.

✅ **Diseño adaptable y centrado**  
El tablero (`div#game`) se ajusta al contenido y permanece centrado en pantalla, incluso al cambiar la dificultad.

---

## 🧱 Estructura del proyecto

```
📂 src/
 ┣ 📂 clases/
 ┃ ┣ 📜 Timer.js
 ┃ ┣ 📜 Cell.js
 ┃ ┣ 📜 Board.js
 ┃ ┣ 📜 BoardView.js
 ┃ ┗ 📜 App.js
 ┣ 📂 sass/
 ┃ ┗ 📜 style.scss
 ┣ 📜 main.js
 ┗ 📜 index.html
```

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/buscaminas-js.git
cd buscaminas-js
```

### 2️⃣ Instalar dependencias (opcional si usas SCSS)

Si utilizas SCSS, asegúrate de tener instalado `sass` globalmente:

```bash
npm install -g sass
```

### 3️⃣ Compilar los estilos (solo si usas SCSS)

```bash
sass src/sass/style.scss dist/style.css
```

### 4️⃣ Abrir el proyecto en el navegador

Simplemente abre el archivo `index.html`:

```bash
open index.html
```

O arrástralo directamente a una ventana del navegador.

---

## 🕹️ Cómo jugar

1. Selecciona la dificultad en la pantalla inicial.  
2. Haz clic izquierdo para revelar una celda.  
3. Haz clic derecho para colocar o quitar una bandera 🚩.  
4. Gana al descubrir todas las celdas sin bombas 💣.  
5. Consulta tus mejores tiempos en el botón de estadísticas 📊.

---

## 🧠 Tecnologías utilizadas

- **JavaScript ES6+ (sin frameworks)**
- **HTML5**
- **CSS3 / SCSS**
- **LocalStorage API**
- **Módulos ES (import/export)**
- **Eventos del DOM**
- **Programación Orientada a Objetos (POO)**

---

## 🧩 Arquitectura de clases

| Clase | Responsabilidad principal |
|--------|----------------------------|
| `Timer` | Controla el cronómetro: inicio, parada, reinicio y formateo del tiempo |
| `Cell` | Representa cada celda del tablero: posición, estado y contenido |
| `Board` | Lógica del juego: generación del tablero, bombas, números, apertura recursiva, condiciones de victoria/derrota |
| `BoardView` | Renderiza el tablero en el DOM y maneja eventos visuales |
| `App` | Punto central de la aplicación: selección de dificultad, inicialización del tablero, cambio de nivel y estadísticas |
| `main.js` | Punto de entrada: ejecuta `App.start()` para inicializar todo |

---

## 🧮 Lógica principal del juego

El flujo general del Buscaminas sigue estos pasos:

1. **Selección de dificultad**  
   El usuario selecciona un nivel de juego (fácil, medio o difícil).  
   `App` define filas, columnas y número de bombas.

2. **Construcción del tablero**  
   `Board` genera una matriz bidimensional con bombas (`"B"`) y números (según las bombas vecinas).

3. **Renderizado visual**  
   `BoardView` crea los elementos `.cell` en el DOM y los asocia con las instancias de `Cell`.

4. **Interacción del usuario**  
   - Clic izquierdo → Abre celda  
   - Clic derecho → Coloca o quita una bandera  
   - Las celdas vacías (0) se abren recursivamente con `revealAdjacent()`.

5. **Detección de victoria o derrota**  
   `Board.checkStateGame()` valida si:
   - Se abrió una bomba → pérdida 💥  
   - Se abrieron todas las celdas seguras → victoria 🎉  

6. **Cronómetro y estadísticas**  
   - El cronómetro (`Timer`) inicia al primer clic.  
   - Se detiene al terminar la partida.  
   - El tiempo se guarda en `localStorage` si es un récord.

---

## 📊 Sistema de estadísticas

El sistema guarda el **mejor tiempo por dificultad** usando la API `localStorage`.  
Los datos se muestran en una ventana modal accesible desde el botón **"Estadísticas"**.

Ejemplo de almacenamiento en `localStorage`:

```json
{
  "easy": 12.45,
  "medium": 85.23,
  "hard": 203.17
}
```

### Detalles técnicos
- Los tiempos se comparan en segundos decimales.
- Si el nuevo tiempo es mejor, se reemplaza automáticamente.
- Los récords permanecen incluso tras cerrar o recargar la página.

---

## 🧰 Buenas prácticas aplicadas

- Código totalmente modular con **import/export ES6**
- Uso de **clases con campos privados (`#campo`)** para encapsular datos
- Métodos **getters** y **setters** bien definidos
- Separación clara entre **lógica del juego y vista**
- **Comentarios explicativos detallados** en cada clase
- Nomenclatura coherente y legible (`camelCase` para variables y métodos, `PascalCase` para clases)
- Código compatible con **ESLint** y **Prettier**

---

## 📸 Capturas



---

## 💬 Próximas mejoras

- Añadir modo **"Personalizado"** (filas, columnas y bombas configurables)
- Agregar animaciones visuales al descubrir celdas o perder
- Mejoras visuales y temas oscuros/claro

---

## 🧑‍💻 Autor

👋 **Francisco Navarro Guardiola**  
💼 Desarrollador Full-stack  
📧 [franng96@hotmail.com]  
🔗 [LinkedIn](https://www.linkedin.com/in/francisco-navarro-b19559195/) · [GitHub](https://github.com/fran960828)

---

## 🪪 Licencia

Este proyecto se publica bajo la licencia **MIT**, por lo que puedes usarlo, modificarlo o distribuirlo libremente siempre que mantengas la atribución original.
