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
  const level = document.getElementById('levelSelect')?.value || 'A1';
  const kap = document.getElementById('kapitelSelect')?.value;
  const section = document.getElementById('sectionSelect')?.value;
  let pool = [];
  
  console.log('Selected level:', level);  // Debug log
  console.log('Selected kapitel:', kap);  // Debug log
  console.log('Selected section:', section);  // Debug log
  
  if (wordList[level]) {
    console.log('Word list for level exists');  // Debug log
    if (kap && wordList[level][kap]) {
      console.log('Found words for kapitel:', wordList[level][kap].length);  // Debug log
      pool = [...wordList[level][kap]];
      // Apply section filtering if selected
      if (section && section !== 'none') {
        const sectionSize = 50;
        const start = (parseInt(section, 10) - 1) * sectionSize;
        const end = start + sectionSize;
        pool = pool.slice(start, end);
        console.log('After section filtering, pool size:', pool.length);  // Debug log
      }
    } else {
      // merge all kapitels
      Object.values(wordList[level]).forEach(arr => pool.push(...arr));
      console.log('Merged all kapitels, total words:', pool.length);  // Debug log
    }
  }
  words = shuffle(pool).slice(0, Math.max(1, Math.min(100, num)));
  current = 0;
  total = words.length;
  correct = 0;
  
  // Add debug info
  const info = document.getElementById('practiceInfo');
  if (info) {
    info.textContent = `Selected ${total} words from ${level} Kapitel ${kap || 'all'}${section !== 'none' ? ` Section ${section}` : ''}`;
  }

  document.getElementById('setup').style.display = 'none';
  document.getElementById('practice').style.display = '';
  document.getElementById('end').style.display = 'none';

  showQuestion();
}

export function showQuestion() {
  if (current >= total) return endPractice();
  const w = words[current];
  console.log('Current word object:', w);  // Debug log
  
  // Show debug info about the current word
  const info = document.getElementById('practiceInfo');
  if (info) {
    info.textContent = w ? `Word ${current + 1} of ${total}` : 'No word found';
  }
  
  const wordDisplay = document.getElementById('wordDisplay');
  if (wordDisplay) {
    const wordText = w ? w.question || '[No word found]' : '[No word found]';
    console.log('Setting word display to:', wordText);  // Debug log
    wordDisplay.textContent = wordText;
  }
  
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
