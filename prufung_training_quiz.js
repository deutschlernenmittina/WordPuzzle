import { prufungWordList } from './prufung_wordlist.js';
import { shuffle } from './utils.js';

let words = [];
let current = 0;
let total = 0;
let correct = 0;

function updateChapterOptions() {
  const level = document.getElementById('levelSelect').value;
  const chapterSelect = document.getElementById('chapterSelect');
  chapterSelect.innerHTML = '';
  if (prufungWordList[level]) {
    const chapters = Object.keys(prufungWordList[level]).sort((a, b) => Number(a) - Number(b));
    chapters.forEach(chap => {
      const opt = document.createElement('option');
      opt.value = chap;
      opt.textContent = `Chapter ${chap}`;
      chapterSelect.appendChild(opt);
    });
  }
}

export function startCustomQuiz() {
  const num = parseInt(document.getElementById('numWords').value, 10) || 5;
  const level = document.getElementById('levelSelect').value;
  const chap = document.getElementById('chapterSelect').value;
  let pool = [];
  if (prufungWordList[level] && prufungWordList[level][chap]) {
    pool = [...prufungWordList[level][chap]];
  }
  words = shuffle(pool).slice(0, Math.max(1, Math.min(20, num)));
  current = 0;
  total = words.length;
  correct = 0;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('quiz').style.display = '';
  document.getElementById('end').style.display = 'none';
  showCustomQuestion();
}

function showCustomQuestion() {
  if (current >= total) return endCustomQuiz();
  const w = words[current];
  document.getElementById('wordDisplay').textContent = w ? w.question : '[No word found]';
  document.getElementById('answerInput').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('checkBtn').disabled = false;
  document.getElementById('nextBtn').style.display = 'none';
  updateProgress();
  setTimeout(() => document.getElementById('answerInput').focus(), 50);
}

export function checkCustomAnswer() {
  const user = document.getElementById('answerInput').value.trim().toLowerCase();
  const w = words[current] || {};
  const correctAnswer = (w.answer || '').toLowerCase();
  const fb = document.getElementById('feedback');
  if (!user) return;
  if (user === correctAnswer) {
    fb.textContent = '✅ Correct!';
    correct++;
  } else {
    fb.innerHTML = `❌ Incorrect. Answer: <b>${w.answer || '-'}</b>`;
  }
  document.getElementById('checkBtn').disabled = true;
  document.getElementById('nextBtn').style.display = '';
}

export function nextCustomWord() {
  current++;
  if (current >= total) return endCustomQuiz();
  showCustomQuestion();
}

function endCustomQuiz() {
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('end').style.display = '';
  document.getElementById('score').textContent = `Score: ${correct} / ${total}`;
}

export function restartCustomQuiz() {
  document.getElementById('setup').style.display = '';
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('end').style.display = 'none';
}

function updateProgress() {
  const progress = document.getElementById('progressBar');
  if (!progress) return;
  const pct = total ? Math.round((current / total) * 100) : 0;
  progress.style.width = `${pct}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateChapterOptions();
  document.getElementById('levelSelect').addEventListener('change', updateChapterOptions);
  // Plus/minus logic for numWords
  const numInput = document.getElementById('numWords');
  document.getElementById('decreaseNumWords').onclick = () => {
    let v = parseInt(numInput.value, 10);
    if (v > parseInt(numInput.min, 10)) numInput.value = v - 1;
  };
  document.getElementById('increaseNumWords').onclick = () => {
    let v = parseInt(numInput.value, 10);
    if (v < parseInt(numInput.max, 10)) numInput.value = v + 1;
  };
  // Enter key for answer
  document.getElementById('answerInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const checkBtn = document.getElementById('checkBtn');
      if (!checkBtn.disabled) checkCustomAnswer();
    }
  });
});

window.startCustomQuiz = startCustomQuiz;
window.checkCustomAnswer = checkCustomAnswer;
window.nextCustomWord = nextCustomWord;
window.restartCustomQuiz = restartCustomQuiz;
