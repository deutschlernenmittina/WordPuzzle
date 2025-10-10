// Word Practice Tool logic

// Import word list from separate file
import { wordList } from './wordlist.js';

let words = [];
let current = 0;
let total = 0;
let correct = 0;

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function startPractice() {
  let n = parseInt(document.getElementById('numWords').value, 10);
  if (n > wordList.length) n = wordList.length;
  words = shuffle([...wordList]).slice(0, n);
  current = 0;
  correct = 0;
  total = n;

  document.getElementById('setup').style.display = 'none';
  document.getElementById('practice').style.display = '';
  document.getElementById('end').style.display = 'none';
  document.getElementById('feedback').textContent = '';
  document.getElementById('answerInput').value = '';
  // Reset progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = '0%';
  showWord();
}

export function showWord() {
  if (current < total) {
    document.getElementById('wordDisplay').textContent = words[current].question;
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    document.getElementById('progress').textContent = `Word ${current + 1} of ${total}`;
    document.getElementById('feedback').textContent = '';
    // Update progress bar (show progress for current word)
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = `${((current) / total) * 100}%`;
    }
  } else {
    // Fill progress bar at end
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = '100%';
    }
    endPractice();
  }
}

export function checkAnswer() {
  const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
  const correctAnswer = words[current].answer.trim().toLowerCase();
  if (userAnswer === correctAnswer) {
    document.getElementById('feedback').textContent = '✅ Correct!';
    correct++;
  } else {
    document.getElementById('feedback').textContent = `❌ Wrong! Correct answer: ${words[current].answer}`;
  }
  current++;
  // Update progress bar immediately after answer
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    let percent = (current / total) * 100;
    if (percent > 100) percent = 100;
    progressBar.style.width = `${percent}%`;
  }
  setTimeout(showWord, 1000);
}

export function endPractice() {
  document.getElementById('practice').style.display = 'none';
  document.getElementById('end').style.display = '';
  document.getElementById('score').textContent = `You got ${correct} out of ${total} correct!`;
}

export function restart() {
  document.getElementById('setup').style.display = '';
  document.getElementById('end').style.display = 'none';
}

// Allow pressing Enter to check answer
export function setupEnterKey() {
  document.getElementById('answerInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') checkAnswer();
  });
}
