// script_words.js - logic for the Word Practice Tool (index.html)

import { wordList } from './wordlist.js';
import { shuffle } from './utils.js';

let words = [];
let current = 0;
let total = 0;
let correct = 0;

// Dynamically update Kapitel options based on selected level
export function updateKapitelOptions() {
  const level = document.getElementById('levelSelect').value;
  const kapitelSelect = document.getElementById('kapitelSelect');
  if (!kapitelSelect) return;
  // Remove all options
  kapitelSelect.innerHTML = '';
  if (wordList[level]) {
    const kapitels = Object.keys(wordList[level]).sort((a, b) => Number(a) - Number(b));
    kapitels.forEach(kap => {
      const opt = document.createElement('option');
      opt.value = kap;
      opt.textContent = `Kapitel ${kap}`;
      kapitelSelect.appendChild(opt);
    });
  }
}

export function startPractice() {
  const num = parseInt(document.getElementById('numWords').value, 10) || 5;
  // Flatten selected list (naive: take all words from selected level/kapitel/section if implemented)
  const level = document.getElementById('levelSelect')?.value || 'A1';
  const kap = document.getElementById('kapitelSelect')?.value;
  let pool = [];
  if (wordList[level]) {
    if (kap && wordList[level][kap]) pool = wordList[level][kap];
    else {
      // merge all kapitels
      Object.values(wordList[level]).forEach(arr => pool.push(...arr));
    }
  }
  words = shuffle(pool).slice(0, Math.max(1, Math.min(100, num)));
  current = 0;
  total = words.length;
  correct = 0;

  document.getElementById('setup').style.display = 'none';
  document.getElementById('practice').style.display = '';
  document.getElementById('end').style.display = 'none';

  showQuestion();
}

export function showQuestion() {
  if (current >= total) return endPractice();
  const w = words[current];
  document.getElementById('practiceInfo').textContent = '';
  document.getElementById('wordDisplay').textContent = w ? w.de || w.word || '' : '';
  document.getElementById('answerInput').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('checkBtn').disabled = false;
  document.getElementById('nextBtn').style.display = 'none';
  updateProgress();
  setTimeout(() => document.getElementById('answerInput').focus(), 50);
}

export function checkAnswer() {
  const user = document.getElementById('answerInput').value.trim().toLowerCase();
  const w = words[current] || {};
  const correctAnswer = (w.en || w.answer || '').toLowerCase();
  const fb = document.getElementById('feedback');
  if (!user) return;
  if (user === correctAnswer) {
    fb.textContent = '✅ Correct!';
    correct++;
  } else {
    fb.innerHTML = `❌ Incorrect. Answer: <b>${w.en || w.answer || '-'}</b>`;
  }
  document.getElementById('checkBtn').disabled = true;
  document.getElementById('nextBtn').style.display = '';
}

export function nextWord() {
  current++;
  if (current >= total) return endPractice();
  showQuestion();
}

export function endPractice() {
  document.getElementById('practice').style.display = 'none';
  document.getElementById('end').style.display = '';
  document.getElementById('score').textContent = `Score: ${correct} / ${total}`;
}

export function restart() {
  document.getElementById('setup').style.display = '';
  document.getElementById('practice').style.display = 'none';
  document.getElementById('end').style.display = 'none';
}

export function setupEnterKey() {
  const input = document.getElementById('answerInput');
  if (!input) return;
  input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const checkBtn = document.getElementById('checkBtn');
      if (!checkBtn.disabled) checkAnswer();
    }
  });
}

function updateProgress() {
  const progress = document.getElementById('progressBar');
  if (!progress) return;
  const pct = total ? Math.round((current / total) * 100) : 0;
  progress.style.width = `${pct}%`;
}
