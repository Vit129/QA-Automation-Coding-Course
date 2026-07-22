// Mixed timed exam engine — pulls real LESSONS from window.QA_TRACKS (populated by every
// track's course.js, each loaded as its own <script> tag before this file) and grades answers
// with each lesson's own validate(), exactly like the per-track sandbox does. No separate
// grading logic — this is a thin runner around the same validate() contract every lesson ships.

const EXAM_STATE = {
  questions: [],       // [{ trackId, trackTitle, lesson }]
  currentIndex: 0,
  answers: {},          // key: `${trackId}:${lesson.id}` -> answer text
  results: null,        // set after submit: [{ ...question, passed, error }]
  endTime: null,
  timerHandle: null,
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function questionKey(q) {
  return `${q.trackId}:${q.lesson.id}`;
}

function getSelectedTrackIds() {
  return Array.from(document.querySelectorAll('.track-check:checked')).map(el => el.value);
}

function buildQuestionPool(trackIds, count) {
  const pool = [];
  for (const trackId of trackIds) {
    const track = window.QA_TRACKS[trackId];
    if (!track) continue;
    for (const lesson of track.lessons) {
      pool.push({ trackId, trackTitle: track.title, lesson });
    }
  }
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function initExamPage() {
  renderTrackChecklist();
  const startBtn = document.getElementById('start-exam-btn');
  if (startBtn) startBtn.addEventListener('click', startExam);

  const countInput = document.getElementById('question-count');
  if (countInput) {
    const poolSize = Object.values(window.QA_TRACKS).reduce((sum, t) => sum + t.lessons.length, 0);
    countInput.max = String(poolSize);
  }
}

function renderTrackChecklist() {
  const container = document.getElementById('track-checklist');
  if (!container) return;
  const ids = Object.keys(window.QA_TRACKS);
  container.innerHTML = ids.map(id => {
    const t = window.QA_TRACKS[id];
    return `
      <label class="track-check-item">
        <input type="checkbox" class="track-check" value="${id}" checked>
        <span>${t.title}</span>
        <span class="track-check-count">${t.lessons.length} lessons</span>
      </label>
    `;
  }).join('');
}

function startExam() {
  const trackIds = getSelectedTrackIds();
  if (trackIds.length === 0) {
    alert('เลือกอย่างน้อย 1 หมวดเนื้อหาก่อนเริ่มสอบ');
    return;
  }

  const countInput = document.getElementById('question-count');
  const timeInput = document.getElementById('time-limit');
  const count = Math.max(1, parseInt(countInput.value, 10) || 20);
  const minutes = Math.max(1, parseInt(timeInput.value, 10) || 30);

  EXAM_STATE.questions = buildQuestionPool(trackIds, count);
  EXAM_STATE.currentIndex = 0;
  EXAM_STATE.answers = {};
  EXAM_STATE.results = null;
  EXAM_STATE.endTime = Date.now() + minutes * 60 * 1000;

  document.getElementById('exam-setup-screen').classList.add('hidden');
  document.getElementById('exam-results-screen').classList.add('hidden');
  document.getElementById('exam-runner-screen').classList.remove('hidden');

  renderQuestionNav();
  renderQuestion(0);
  startTimer();
}

function startTimer() {
  if (EXAM_STATE.timerHandle) clearInterval(EXAM_STATE.timerHandle);
  updateTimerDisplay();
  EXAM_STATE.timerHandle = setInterval(() => {
    const remaining = EXAM_STATE.endTime - Date.now();
    if (remaining <= 0) {
      clearInterval(EXAM_STATE.timerHandle);
      submitExam(true);
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('exam-timer');
  if (!el) return;
  const remaining = EXAM_STATE.endTime - Date.now();
  el.textContent = formatTime(remaining);
  el.classList.toggle('exam-timer-low', remaining < 60000);
}

function saveCurrentAnswer() {
  const textarea = document.getElementById('exam-answer-textarea');
  if (!textarea) return;
  const q = EXAM_STATE.questions[EXAM_STATE.currentIndex];
  if (!q) return;
  EXAM_STATE.answers[questionKey(q)] = textarea.value;
}

function renderQuestionNav() {
  const nav = document.getElementById('exam-question-nav');
  if (!nav) return;
  nav.innerHTML = EXAM_STATE.questions.map((q, idx) => {
    const answered = EXAM_STATE.answers[questionKey(q)] !== undefined && EXAM_STATE.answers[questionKey(q)] !== q.lesson.template;
    const active = idx === EXAM_STATE.currentIndex ? 'exam-nav-active' : '';
    const done = answered ? 'exam-nav-answered' : '';
    return `<button class="exam-nav-dot ${active} ${done}" onclick="goToQuestion(${idx})">${idx + 1}</button>`;
  }).join('');
}

function goToQuestion(idx) {
  saveCurrentAnswer();
  EXAM_STATE.currentIndex = idx;
  renderQuestion(idx);
  renderQuestionNav();
}

function goNext() {
  if (EXAM_STATE.currentIndex < EXAM_STATE.questions.length - 1) {
    goToQuestion(EXAM_STATE.currentIndex + 1);
  }
}

function goPrev() {
  if (EXAM_STATE.currentIndex > 0) {
    goToQuestion(EXAM_STATE.currentIndex - 1);
  }
}

function renderQuestion(idx) {
  const q = EXAM_STATE.questions[idx];
  if (!q) return;

  const badge = document.getElementById('exam-question-badge');
  const title = document.getElementById('exam-question-title');
  const task = document.getElementById('exam-question-task');
  const textarea = document.getElementById('exam-answer-textarea');
  const progress = document.getElementById('exam-progress-label');
  const prevBtn = document.getElementById('exam-prev-btn');
  const nextBtn = document.getElementById('exam-next-btn');

  if (badge) badge.textContent = `${q.trackTitle} · ${q.lesson.meta}`;
  if (title) title.textContent = q.lesson.title;
  if (task) task.innerHTML = q.lesson.task;
  if (textarea) textarea.value = EXAM_STATE.answers[questionKey(q)] !== undefined ? EXAM_STATE.answers[questionKey(q)] : q.lesson.template;
  if (progress) progress.textContent = `ข้อ ${idx + 1} / ${EXAM_STATE.questions.length}`;
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === EXAM_STATE.questions.length - 1;
}

function confirmSubmitExam() {
  saveCurrentAnswer();
  const answeredCount = EXAM_STATE.questions.filter(q => {
    const a = EXAM_STATE.answers[questionKey(q)];
    return a !== undefined && a !== q.lesson.template;
  }).length;
  const unanswered = EXAM_STATE.questions.length - answeredCount;
  const msg = unanswered > 0
    ? `ยังไม่ได้ตอบ ${unanswered} ข้อ ต้องการส่งคำตอบเลยหรือไม่?`
    : 'ต้องการส่งคำตอบและดูผลคะแนนหรือไม่?';
  if (confirm(msg)) submitExam(false);
}

async function gradeQuestion(q) {
  const answer = EXAM_STATE.answers[questionKey(q)] !== undefined ? EXAM_STATE.answers[questionKey(q)] : q.lesson.template;
  try {
    await Promise.resolve(q.lesson.validate(answer, () => {}));
    return { ...q, answer, passed: true, error: null };
  } catch (e) {
    return { ...q, answer, passed: false, error: e.message };
  }
}

async function submitExam(timeUp) {
  saveCurrentAnswer();
  if (EXAM_STATE.timerHandle) clearInterval(EXAM_STATE.timerHandle);

  const runnerScreen = document.getElementById('exam-runner-screen');
  const resultsScreen = document.getElementById('exam-results-screen');
  if (runnerScreen) runnerScreen.classList.add('hidden');

  // Grade sequentially (not Promise.all) so DB-Design-SQL's shared in-memory alasql tables
  // (each lesson's own validate() calls resetDatabase() first, but running many alasql queries
  // truly concurrently against one shared engine instance is asking for trouble) never interleave.
  const results = [];
  for (const q of EXAM_STATE.questions) {
    results.push(await gradeQuestion(q));
  }
  EXAM_STATE.results = results;

  renderResults(timeUp);
  if (resultsScreen) resultsScreen.classList.remove('hidden');
}

function renderResults(timeUp) {
  const results = EXAM_STATE.results;
  const passCount = results.filter(r => r.passed).length;
  const total = results.length;
  const percent = total > 0 ? Math.round((passCount / total) * 100) : 0;

  const summary = document.getElementById('exam-results-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="exam-score-big">${passCount} / ${total}</div>
      <div class="exam-score-percent">${percent}%</div>
      ${timeUp ? '<div class="exam-timeup-note">⏱ หมดเวลา — ระบบส่งคำตอบอัตโนมัติ</div>' : ''}
    `;
  }

  const breakdown = document.getElementById('exam-results-breakdown');
  if (breakdown) {
    breakdown.innerHTML = results.map((r, idx) => {
      const statusClass = r.passed ? 'exam-result-pass' : 'exam-result-fail';
      const statusLabel = r.passed ? '✓ ถูกต้อง' : '✗ ไม่ถูกต้อง';
      const errorBlock = r.passed ? '' : `<div class="exam-result-error">${escapeHtmlExam(r.error || '')}</div>`;
      const solutionBlock = r.passed ? '' : `<div class="exam-result-solution"><strong>เฉลย:</strong><pre><code>${escapeHtmlExam(r.lesson.solution)}</code></pre></div>`;
      return `
        <div class="exam-result-item ${statusClass}">
          <div class="exam-result-header">
            <span class="exam-result-index">ข้อ ${idx + 1}</span>
            <span class="exam-result-track">${r.trackTitle} · ${r.lesson.meta}</span>
            <span class="exam-result-status">${statusLabel}</span>
          </div>
          <div class="exam-result-title">${r.lesson.title}</div>
          ${errorBlock}
          ${solutionBlock}
        </div>
      `;
    }).join('');
  }
}

function escapeHtmlExam(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function resetExam() {
  EXAM_STATE.questions = [];
  EXAM_STATE.currentIndex = 0;
  EXAM_STATE.answers = {};
  EXAM_STATE.results = null;
  if (EXAM_STATE.timerHandle) clearInterval(EXAM_STATE.timerHandle);

  document.getElementById('exam-results-screen').classList.add('hidden');
  document.getElementById('exam-runner-screen').classList.add('hidden');
  document.getElementById('exam-setup-screen').classList.remove('hidden');
}

window.onload = initExamPage;
