// gameOver.js

;(function(){
  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function createOverlay(){
    let existing = document.getElementById('game-over-screen');
    if (existing) return existing;

    const overlay = document.createElement('div');
    overlay.id = 'game-over-screen';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="content">
        <h2>Игра окончена!</h2>
        <p id="final-score"></p>
        <p id="final-time"></p>
        <button id="go-restart">Играть снова</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Обработчик кнопки "Играть снова"
    overlay.querySelector('#go-restart').addEventListener('click', () => {
      overlay.style.display = 'none';
      if (typeof window.resetTimer === 'function') resetTimer();
      if (typeof window.startTimer === 'function') startTimer();
      if (typeof window.initGame === 'function') initGame();
    });

    return overlay;
  }

  // Глобальная функция
  window.showGameOver = function(score, secondsElapsed) {
    if (typeof window.stopTimer === 'function') stopTimer();

    const overlay = createOverlay();
    overlay.querySelector('#final-score').textContent = `Счёт: ${score} очков`;
    overlay.querySelector('#final-time').textContent = `Время: ${formatTime(secondsElapsed)}`;

    overlay.style.display = 'flex';
  };
})();
