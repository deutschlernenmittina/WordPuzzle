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

const verbs = [
  {en: "to go", pr: "gehen", pe: "ist gegangen"},
  {en: "to come", pr: "kommen", pe: "ist gekommen"},
  {en: "to eat", pr: "essen", pe: "hat gegessen"},
  {en: "to drink", pr: "trinken", pe: "hat getrunken"},
  {en: "to see", pr: "sehen", pe: "hat gesehen"},
  {en: "to write", pr: "schreiben", pe: "hat geschrieben"},
  {en: "to speak", pr: "sprechen", pe: "hat gesprochen"},
  {en: "to find", pr: "finden", pe: "hat gefunden"},
  {en: "to give", pr: "geben", pe: "hat gegeben"},
  {en: "to sleep", pr: "schlafen", pe: "hat geschlafen"},
  {en: "to begin", pr: "beginnen", pe: "hat begonnen"},
  {en: "to stay", pr: "bleiben", pe: "ist geblieben"},
  {en: "to help", pr: "helfen", pe: "hat geholfen"},
  {en: "to drive", pr: "fahren", pe: "ist gefahren"},
  {en: "to read", pr: "lesen", pe: "hat gelesen"},
  {en: "to take", pr: "nehmen", pe: "hat genommen"},
  {en: "to call", pr: "rufen", pe: "hat gerufen"},
  {en: "to run", pr: "laufen", pe: "ist gelaufen"},
  {en: "to win", pr: "gewinnen", pe: "hat gewonnen"},
  {en: "to lose", pr: "verlieren", pe: "hat verloren"}
];

let selectedVerbs = [];
let currentIdx = 0;
let score = 0;
let total = 0;

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

// Shuffle helper
function shuffle(array) {
  let a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Quiz Logic ---
function startQuiz() {
  currentIdx = 0;
  score = 0;
  total = parseInt(numQuestionsSelect.value, 10);
  selectedVerbs = shuffle(verbs).slice(0, total);

  setupSection.style.display = 'none';
  quizSection.style.display = 'block';
  resultSection.style.display = 'none';

  showQuestion();
}

function showQuestion() {
  if (currentIdx >= selectedVerbs.length) {
    showResult();
    return;
  }
  progress.textContent = `Verb ${currentIdx + 1} of ${selectedVerbs.length}`;
  const v = selectedVerbs[currentIdx];
  englishVerb.textContent = v.en;
  presentInput.value = '';
  perfectInput.value = '';
  feedback.textContent = '';
  feedback.className = '';
  setTimeout(() => presentInput.focus(), 50);
}

quizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userPresent = presentInput.value.trim().toLowerCase();
  const userPerfect = perfectInput.value.trim().toLowerCase();
  const v = selectedVerbs[currentIdx];
  const correctPresent = v.pr.toLowerCase();
  const correctPerfect = v.pe.toLowerCase();

  let isCorrect = (userPresent === correctPresent) && (userPerfect === correctPerfect);

  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.className = 'correct';
    score++;
  } else {
    feedback.innerHTML = `Incorrect.<br> <span style="color:#647dee">Präsens:</span> <b>${v.pr}</b> &nbsp; <span style="color:#43cea2">Perfekt:</span> <b>${v.pe}</b>`;
    feedback.className = 'incorrect';
  }

  setTimeout(() => {
    currentIdx++;
    showQuestion();
  }, 1050);
});

function showResult() {
  quizSection.style.display = 'none';
  resultSection.style.display = 'block';
  let emoji = score === selectedVerbs.length ? "🎉" : score >= selectedVerbs.length / 2 ? "👍" : "💡";
  resultScore.innerHTML = `You got <span style="color:#43cea2">${score}</span> out of <span style="color:#7f53ac">${selectedVerbs.length}</span> correct! <br>${emoji} ${score === selectedVerbs.length ? 'Perfect! Great job!' : (score > selectedVerbs.length / 2 ? 'Nice work!' : 'Keep practicing!')}`;
}

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => {
  setupSection.style.display = 'block';
  quizSection.style.display = 'none';
  resultSection.style.display = 'none';
  score = 0;
  currentIdx = 0;
});
