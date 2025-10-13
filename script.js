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

export function startQuiz() {
  currentIdx = 0;
  score = 0;
  verbTotal = parseInt(document.getElementById('numWords').value, 10);
  selectedVerbs = shuffle(verbs).slice(0, verbTotal);

  document.getElementById('setup').style.display = 'none';
  document.getElementById('quiz-section').style.display = 'block';
  document.getElementById('result-section').style.display = 'none';

  // Reset progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = '0%';

  showQuestion();
}

export function showQuestion() {
  if (currentIdx >= selectedVerbs.length) {
    showResult();
    return;
  }
  document.getElementById('progress').textContent = `Verb ${currentIdx + 1} of ${selectedVerbs.length}`;
  const v = selectedVerbs[currentIdx];
  document.getElementById('english-verb').textContent = v.en;
  document.getElementById('present').value = '';
  document.getElementById('perfect').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  
  // Show submit button and hide next button
  document.getElementById('submit-btn').style.display = 'inline-block';
  document.getElementById('next-btn').style.display = 'none';
  
  // Update progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const percent = (currentIdx / selectedVerbs.length) * 100;
    progressBar.style.width = `${percent}%`;
  }
  
  setTimeout(() => document.getElementById('present').focus(), 50);
}

export function nextWord() {
  currentIdx++;
  showQuestion();
}

export function endPractice() {
  document.getElementById('quiz-section').style.display = 'none';
  document.getElementById('result-section').style.display = 'block';
  showResult();
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

import { verbs } from './verblist.js';

export let selectedVerbs = [];
export let currentIdx = 0;
export let score = 0;
export let verbTotal = 0;

const setupSection = document.getElementById('setup-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const numQuestionsSelect = document.getElementById('num-questions');

const progress = document.getElementById('progress');
const quizForm = document.getElementById('quiz-form');
const englishVerb = document.getElementById('english-verb');
const presentInput = document.getElementById('present');
const perfectInput = document.getElementById('perfect');
const feedback = document.getElementById('feedback');
const resultScore = document.getElementById('result-score');

// --- Quiz Logic ---
export function startQuiz() {
  currentIdx = 0;
  score = 0;
  verbTotal = parseInt(document.getElementById('numWords').value, 10);
  selectedVerbs = shuffle(verbs).slice(0, verbTotal);

  document.getElementById('setup').style.display = 'none';
  document.getElementById('quiz-section').style.display = 'block';
  document.getElementById('result-section').style.display = 'none';

  showQuestion();
}

export function showQuestion() {
  if (currentIdx >= selectedVerbs.length) {
    showResult();
    return;
  }
  document.getElementById('progress').textContent = `Verb ${currentIdx + 1} of ${selectedVerbs.length}`;
  const v = selectedVerbs[currentIdx];
  document.getElementById('english-verb').textContent = v.en;
  document.getElementById('present').value = '';
  document.getElementById('perfect').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  
  // Show submit button and hide next button
  document.getElementById('submit-btn').style.display = 'inline-block';
  document.getElementById('next-btn').style.display = 'none';
  
  // Update progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const percent = (currentIdx / selectedVerbs.length) * 100;
    progressBar.style.width = `${percent}%`;
  }
  
  setTimeout(() => document.getElementById('present').focus(), 50);
}

export function handleSubmit(userPresent, userPerfect) {
  const v = selectedVerbs[currentIdx];
  const correctPresent = v.pr.toLowerCase();
  const correctPerfect = v.pe.toLowerCase();

  let isCorrect = (userPresent === correctPresent) && (userPerfect === correctPerfect);
  const feedback = document.getElementById('feedback');
  const submitBtn = document.getElementById('submit-btn');
  const nextBtn = document.getElementById('next-btn');

  if (isCorrect) {
    feedback.textContent = '✅ Correct!';
    feedback.className = 'correct';
    score++;
  } else {
    feedback.innerHTML = `❌ Incorrect.<br><br>
      <span style="color:#647dee">Präsens:</span> <b>${v.pr}</b><br>
      <span style="color:#43cea2">Perfekt:</span> <b>${v.pe}</b>`;
    feedback.className = 'incorrect';
  }

  // Hide submit button and show next button
  submitBtn.style.display = 'none';
  nextBtn.style.display = 'inline-block';
}

export function showResult() {
  quizSection.style.display = 'none';
  resultSection.style.display = 'block';
  let emoji = score === verbTotal ? "🎉" : score >= verbTotal / 2 ? "👍" : "💡";
  resultScore.innerHTML = `You got <span style="color:#43cea2">${score}</span> out of <span style="color:#7f53ac">${verbTotal}</span> correct! <br>${emoji} ${score === verbTotal ? 'Perfect! Great job!' : (score > verbTotal / 2 ? 'Nice work!' : 'Keep practicing!')}`;
}

// Event listeners will be set up in the HTML file
