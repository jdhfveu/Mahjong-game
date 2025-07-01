// main.js

// 1) Хук на кнопку "Перезапустить"
const btnRestart = document.getElementById('restart');
btnRestart.addEventListener('click', () => {
  // сбрасываем и запускаем таймер заново
  window.resetTimer();
  window.startTimer();

  // ваша логика рестарта игры:
  initGame();       // если у вас есть функция инициализации
  clearSelected();  // или что у вас там
});

// 2) Остановка таймера при окончании игры
function onGameOver() {
  // например, вы вызываете этот метод, когда остались только совпавшие плитки
  window.stopTimer();
  // и выводите поздравление/модалку:
  alert('Поздравляем, вы выиграли!');
}

function checkWinCondition(){
if (tiles.length === 0) {
  const score = getCurrentScore();        // твоя функция получения счёта
  const timeInSeconds = totalSeconds;     // из timer.js
  showGameOver(score, timeInSeconds);
}

}

function initGame() {
  resetTimer();    // сбрасываем старый
  startTimer();    // запускаем новый
  score = 0;
  selected = null;
  document.querySelector('#score span').textContent = score;
  generateRandomLayout();
  renderTiles();
}

// … где-то внутри handleClick, когда пара снята:
if (tilesMatch(selected, tile)) {
  // … твои existing-код для matched, score, renderTiles
  const remaining = tiles.filter(t => !t.matched);
  if (remaining.length === 0) {
    // даём фрейм, чтобы DOM обновился
    setTimeout(() => {
      // остановим таймер
      stopTimer();
      // покажем оверлей, передав очки и время
      showGameOver(score, getElapsedSeconds());
    }, 300);
    return;
  }
  // … остальная логика автоматического перемешивания
}


// И не забудь по ходу игры в нужный момент вызывать checkWinCondition()

