// Word Practice Tool logic

// Import word list from separate file
import { wordList } from './wordlist.js';

let words = [];
let current = 0;
let total = 0;
let correct = 0;

// Dynamically update Kapitel options based on selected level
function updateKapitelOptions() {
  const level = document.getElementById('levelSelect').value;
  const kapitelSelect = document.getElementById('kapitelSelect');
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

// Attach change event to levelSelect on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const levelSelect = document.getElementById('levelSelect');
  if (levelSelect) {
    levelSelect.addEventListener('change', updateKapitelOptions);
    updateKapitelOptions(); // Initial population
  }
});

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setCheckNextState({checkEnabled, nextEnabled}) {
  const checkBtn = document.getElementById('checkBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (checkBtn) checkBtn.disabled = !checkEnabled;
  if (nextBtn) nextBtn.style.display = nextEnabled ? '' : 'none';
}

export function startPractice() {

  const level = document.getElementById('levelSelect').value;
  const kapitel = document.getElementById('kapitelSelect').value;
  const section = document.getElementById('sectionSelect') ? document.getElementById('sectionSelect').value : 'none';
  let n = parseInt(document.getElementById('numWords').value, 10);
  let selectedWords = [];
  if (wordList[level] && wordList[level][kapitel]) {
    let allWords = [...wordList[level][kapitel]];
    if (section && section !== 'none') {
      const sectionNum = parseInt(section, 10);
      const startIdx = (sectionNum - 1) * 50;
      let endIdx = startIdx + 50;
      // Clamp endIdx to array length
      if (startIdx >= allWords.length) {
        selectedWords = [];
      } else {
        endIdx = Math.min(endIdx, allWords.length);
        selectedWords = allWords.slice(startIdx, endIdx);
      }
    } else {
      selectedWords = allWords;
    }
  }
  if (n > selectedWords.length) n = selectedWords.length;
  words = shuffle(selectedWords).slice(0, n);
  current = 0;
  correct = 0;
  total = n;

  // Show practice info
  const infoDiv = document.getElementById('practiceInfo');
  if (infoDiv) {
    let infoText = 'Now Practicing: ';
    const level = document.getElementById('levelSelect').value;
    const kapitel = document.getElementById('kapitelSelect').value;
    const sectionEl = document.getElementById('sectionSelect');
    const section = sectionEl ? sectionEl.value : 'none';
    const numWords = document.getElementById('numWords').value;
    infoText += `Level ${level}, Kapitel ${kapitel}`;
    if (section && section !== 'none') {
      infoText += `, Section ${section}`;
    }
    infoText += `, ${numWords} word${numWords == 1 ? '' : 's'}`;
    infoDiv.textContent = infoText;
  }

  document.getElementById('setup').style.display = 'none';
  document.getElementById('practice').style.display = '';
  document.getElementById('end').style.display = 'none';
  document.getElementById('feedback').textContent = '';
  document.getElementById('answerInput').value = '';
  // Reset progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = '0%';
  setCheckNextState({checkEnabled: true, nextEnabled: false});
  showWord();
}

export function showWord() {
  if (current < total) {
    document.getElementById('wordDisplay').textContent = words[current].question;
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    document.getElementById('progress').textContent = `Word ${current + 1} of ${total}`;
    document.getElementById('feedback').textContent = '';
    setCheckNextState({checkEnabled: true, nextEnabled: false});
    // Update progress bar to reflect the word being answered (current+1)
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      let percent = ((current) / total) * 100;
      progressBar.style.width = `${percent}%`;
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
  setCheckNextState({checkEnabled: false, nextEnabled: true});
}

export function nextWord() {
  current++;
  showWord();
}

export function endPractice() {
  document.getElementById('practice').style.display = 'none';
  document.getElementById('end').style.display = '';
  document.getElementById('score').textContent = `You got ${correct} out of ${total} correct!`;
  // Clear practice info
  const infoDiv = document.getElementById('practiceInfo');
  if (infoDiv) infoDiv.textContent = '';
}

export function restart() {
  document.getElementById('setup').style.display = '';
  document.getElementById('end').style.display = 'none';
  // Clear practice info
  const infoDiv = document.getElementById('practiceInfo');
  if (infoDiv) infoDiv.textContent = '';
}

// Allow pressing Enter to check answer
export function setupEnterKey() {
  document.getElementById('answerInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const checkBtn = document.getElementById('checkBtn');
      if (!checkBtn.disabled) checkAnswer();
    }
  });
}
