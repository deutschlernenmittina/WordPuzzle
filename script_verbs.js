// script_verbs.js - logic for the Verb Trainer (verbslist.html)

import { verbs } from './verblist.js';
import { shuffle } from './utils.js';

export let selectedVerbs = [];
export let currentIdx = 0;
export let score = 0;
export let verbTotal = 0;

export function startQuiz() {
  currentIdx = 0;
  score = 0;
  verbTotal = parseInt(document.getElementById('numWords').value, 10) || 10;
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
  const feedback = document.getElementById('feedback');
  feedback.textContent = '';
  feedback.className = '';

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

export function nextWord() {
  currentIdx++;
  showQuestion();
}

export function showResult() {
  document.getElementById('quiz-section').style.display = 'none';
  document.getElementById('result-section').style.display = 'block';
  let emoji = score === verbTotal ? "🎉" : score >= verbTotal / 2 ? "👍" : "💡";
  const resultScore = document.getElementById('result-score');
  resultScore.innerHTML = `You got <span style="color:#43cea2">${score}</span> out of <span style="color:#7f53ac">${verbTotal}</span> correct! <br>${emoji} ${score === verbTotal ? 'Perfect! Great job!' : (score > verbTotal / 2 ? 'Nice work!' : 'Keep practicing!')}`;
}
