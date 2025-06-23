document.addEventListener("DOMContentLoaded", () => {
  const mario = document.querySelector(".mario");
  const barrilTemplate = document.querySelector(".barril");
  const contenidoJuego = document.querySelector(".contenido-juego");
  const loseSound = document.getElementById("lose-sound"); // Sonido de derrota
  const ambientSound = document.getElementById("ambient-sound"); // Sonido de ambiente
  const winSound = document.getElementById("win-sound"); // Sonido de victoria
  const princesa = document.querySelector(".princesa"); // Elemento princesa

  let marioPosX = 90; // Posición inicial de Mario (horizontal, porcentaje)
  let marioPosY = 11; // Posición inicial de Mario (vertical, en px)
  let currentPlatform = 1; // Número de la plataforma donde está Mario
  let isJumping = false;
  let isOnLadder = false;

  // Configuración de plataformas
  const platforms = [
    { bottom: 0, left: 0, right: 100 },
    { bottom: 100, left: 20, right: 100 },
    { bottom: 200, left: 0, right: 85 },
    { bottom: 300, left: 10, right: 100 },
    { bottom: 400, left: 0, right: 100 },
  ];

  // Movimiento de Mario
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
      marioPosX += 2; // Mover derecha
      if (marioPosX > platforms[currentPlatform].right) marioPosX = platforms[currentPlatform].right; // Límite derecho
    }
    if (event.code === "ArrowLeft") {
      marioPosX -= 2; // Mover izquierda
      if (marioPosX < platforms[currentPlatform].left) marioPosX = platforms[currentPlatform].left; // Límite izquierdo
    }
    if (event.code === "ArrowUp" && isOnLadder) {
      marioPosY += 10; // Subir escalera
    }
    if (event.code === "ArrowDown" && isOnLadder) {
      marioPosY -= 10; // Bajar escalera
    }
    if (event.code === "Space" && !isJumping) {
      isJumping = true;
      marioPosY += 50; // Salto hacia arriba
      setTimeout(() => {
        marioPosY -= 50; // Caída
        isJumping = false;
        updatePlatform();
      }, 500); // Duración del salto
    }

    // Actualizar posición de Mario
    mario.style.left = `${marioPosX}%`;
    mario.style.bottom = `${marioPosY}px`;

    // Verificar si está en una escalera
    checkLadderCollision();

    // Verificar si Mario toca a la princesa
    if (checkCollision(mario, princesa)) {
      winGame(); // Manejar victoria
    }
  });

  // Verificar colisión con escaleras
  function checkLadderCollision() {
    const escaleras = document.querySelectorAll(".escalera");
    isOnLadder = Array.from(escaleras).some((escalera) => {
      const rectMario = mario.getBoundingClientRect();
      const rectEscalera = escalera.getBoundingClientRect();
      return (
        rectMario.left < rectEscalera.right &&
        rectMario.right > rectEscalera.left &&
        rectMario.bottom >= rectEscalera.top &&
        rectMario.top <= rectEscalera.bottom
      );
    });
  }

  // Actualizar la plataforma actual de Mario
  function updatePlatform() {
    currentPlatform = platforms.findIndex((platform) => marioPosY === platform.bottom);
  }

  // Generar barriles y movimiento dinámico
  function spawnBarril() {
    const newBarril = barrilTemplate.cloneNode(true);
    newBarril.style.left = "5%"; // Inicia desde Donkey Kong
    newBarril.style.bottom = "411px"; // Plataforma superior
    contenidoJuego.appendChild(newBarril);

    let barrilPosX = 5; // Posición horizontal inicial
    let barrilPosY = 411; // Posición vertical inicial
    let currentBarrilPlatform = 4; // Barril inicia en la plataforma 5 (índice 4)

    const interval = setInterval(() => {
      barrilPosX += 1; // Rodar hacia derecha
      if (barrilPosX > platforms[currentBarrilPlatform].right) {
        barrilPosY -= 100; // Caer a la siguiente plataforma
        barrilPosX = platforms[currentBarrilPlatform - 1].left; // Reiniciar posición horizontal en la nueva plataforma
        currentBarrilPlatform--; // Actualizar plataforma del barril
      }

      newBarril.style.left = `${barrilPosX}%`;
      newBarril.style.bottom = `${barrilPosY}px`;

      // Verificar colisión con Mario
      if (checkCollision(mario, newBarril)) {
        clearInterval(interval);
        loseGame(); // Manejar derrota
      }

      // Eliminar barril si llega al vacío
      if (barrilPosY < 0) {
        contenidoJuego.removeChild(newBarril);
        clearInterval(interval);
      }
    }, 50);
  }

  // Detección de colisión
  function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  // Manejar la derrota
  function loseGame() {
    ambientSound.pause(); // Detener el sonido de ambiente
    ambientSound.currentTime = 0; // Reiniciar el sonido de ambiente
    loseSound.play(); // Reproducir el sonido de derrota
    setTimeout(() => {
      alert("¡Has perdido! El barril tocó a Mario.");
      location.reload();
    }, 500); // Esperar a que termine el sonido antes de recargar
  }

  // Manejar la victoria
  function winGame() {
    ambientSound.pause(); // Detener el sonido de ambiente
    ambientSound.currentTime = 0; // Reiniciar el sonido de ambiente
    winSound.play(); // Reproducir el sonido de victoria
    setTimeout(() => {
      alert("¡Has ganado! Mario rescató a la princesa.");
      location.reload();
    }, 500); // Esperar a que termine el sonido antes de recargar
  }

  // Crear barriles periódicamente
  setInterval(spawnBarril, 3000);
});
