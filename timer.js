// timer.js

let timerElement = document.querySelector('#timer span');
let totalSeconds    = 0;
let intervalId      = null;

function startTimer() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    totalSeconds++;
    const m = String(Math.floor(totalSeconds/60)).padStart(2,'0');
    const s = String(totalSeconds%60).padStart(2,'0');
    timerElement.textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetTimer() {
  stopTimer();
  totalSeconds = 0;
  timerElement.textContent = "00:00";
}

// Новая ф-ция, чтобы вернуть прошедшие секунды
function getElapsedSeconds() {
  return totalSeconds;
}

// Экспорт
window.startTimer        = startTimer;
window.stopTimer         = stopTimer;
window.resetTimer        = resetTimer;
window.getElapsedSeconds = getElapsedSeconds;

// УБРАЛИ вызов startTimer() здесь!
