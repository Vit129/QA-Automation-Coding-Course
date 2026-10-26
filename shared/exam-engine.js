// Mixed timed exam engine. Two modes share one runner (timer, navigation, results):
//   code - pulls real LESSONS from window.QA_TRACKS (populated by every track's course.js, each
//          loaded as its own <script> tag before this file) and grades answers with each
//          lesson's own validate(), exactly like the per-track sandbox does. No separate grading
//          logic - this is a thin runner around the same validate() contract every lesson ships.
//   mcq  - multiple-choice questions from window.MCQ_BANKS (exam/security-plus-mcq.js). Sampling
//          and grading are pure functions in exam/mcq-logic.js (window.McqLogic); this file only
//          draws the UI around them.

const EXAM_STATE = {
  mode: 'code',        // 'code' | 'mcq'
  // code: { trackId, trackTitle, lesson }   mcq: { kind: 'mcq', question, order }
  questions: [],
  currentIndex: 0,
  answers: {},          // code: key -> answer text   mcq: key -> [original choice indices]
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

function isMcq(q) {
  return q.kind === 'mcq';
}

function questionKey(q) {
  return isMcq(q) ? `mcq:${q.question.id}` : `${q.trackId}:${q.lesson.id}`;
}

// Answered = the learner changed the starter code (code) or picked at least one choice (mcq).
function isAnswered(q) {
  const a = EXAM_STATE.answers[questionKey(q)];
  if (isMcq(q)) return Array.isArray(a) && a.length > 0;
  return a !== undefined && a !== q.lesson.template;
}

function getExamMode() {
  const el = document.querySelector('input[name="exam-mode"]:checked');
  return el ? el.value : 'code';
}

function getMcqBank() {
  const bank = window.MCQ_BANKS && window.MCQ_BANKS['security-plus'];
  return bank ? bank.questions : [];
}

function getCodePoolSize() {
  return Object.values(window.QA_TRACKS).reduce((sum, t) => sum + t.lessons.length, 0);
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

  document.querySelectorAll('input[name="exam-mode"]').forEach(el => el.addEventListener('change', updateModeUI));
  updateModeUI();

  // engine.js's own textarea wiring lives inside initApp(), which never runs on this page
  // (its window.onload=initApp assignment gets overwritten by this file's window.onload
  // below - intentional, initApp() assumes a single-track LESSONS array this page doesn't
  // have). Replicate just the textarea event wiring so the shared keydown behaviors
  // (auto-close pairs, smart-enter, tab-indent) still work here.
  const textarea = document.getElementById('editor-textarea');
  if (textarea && typeof handleTextareaKeydown === 'function') {
    textarea.addEventListener('keydown', handleTextareaKeydown);
    textarea.addEventListener('input', () => {
      if (typeof updateGutter === 'function') updateGutter();
      if (typeof updateEditorAutocomplete === 'function') updateEditorAutocomplete();
    });
    textarea.addEventListener('scroll', () => {
      const gutter = document.getElementById('editor-gutter');
      if (gutter) gutter.scrollTop = textarea.scrollTop;
      if (typeof hideEditorAutocomplete === 'function') hideEditorAutocomplete();
    });
  }
}

// Setup screen follows the chosen mode: the track checklist is code-only, the MCQ note is
// MCQ-only, and the count/time defaults and the count cap follow the pool being drawn from.
function updateModeUI() {
  const mcq = getExamMode() === 'mcq';
  const codeSetup = document.getElementById('code-setup');
  const mcqSetup = document.getElementById('mcq-setup');
  if (codeSetup) codeSetup.classList.toggle('hidden', mcq);
  if (mcqSetup) mcqSetup.classList.toggle('hidden', !mcq);

  const countInput = document.getElementById('question-count');
  const timeInput = document.getElementById('time-limit');
  if (countInput) {
    countInput.max = String(mcq ? getMcqBank().length : getCodePoolSize());
    countInput.value = mcq ? '30' : '20';
  }
  if (timeInput) timeInput.value = mcq ? '40' : '30';

  const countLabel = document.getElementById('mcq-bank-count');
  if (countLabel) countLabel.textContent = String(getMcqBank().length);
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
  const mode = getExamMode();
  const countInput = document.getElementById('question-count');
  const timeInput = document.getElementById('time-limit');
  const count = Math.max(1, parseInt(countInput.value, 10) || 20);
  const minutes = Math.max(1, parseInt(timeInput.value, 10) || 30);

  if (mode === 'mcq') {
    if (!window.McqLogic || getMcqBank().length === 0) {
      alert('โหลดคลังข้อสอบ MCQ ไม่สำเร็จ ลองรีเฟรชหน้านี้อีกครั้ง');
      return;
    }
    EXAM_STATE.questions = window.McqLogic.buildMcqExam(getMcqBank(), count).map(e => ({ kind: 'mcq', ...e }));
  } else {
    const trackIds = getSelectedTrackIds();
    if (trackIds.length === 0) {
      alert('เลือกอย่างน้อย 1 หมวดเนื้อหาก่อนเริ่มสอบ');
      return;
    }
    EXAM_STATE.questions = buildQuestionPool(trackIds, count);
  }

  EXAM_STATE.mode = mode;
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

// Code answers live in the textarea until we navigate away; MCQ selections are stored the
// moment a choice changes (saveMcqSelection), so there is nothing to flush for them.
function saveCurrentAnswer() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;
  const q = EXAM_STATE.questions[EXAM_STATE.currentIndex];
  if (!q || isMcq(q)) return;
  EXAM_STATE.answers[questionKey(q)] = textarea.value;
}

function renderQuestionNav() {
  const nav = document.getElementById('exam-question-nav');
  if (!nav) return;
  nav.innerHTML = EXAM_STATE.questions.map((q, idx) => {
    const active = idx === EXAM_STATE.currentIndex ? 'exam-nav-active' : '';
    const done = isAnswered(q) ? 'exam-nav-answered' : '';
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
  const editorBox = document.getElementById('exam-editor-container');
  const mcqBox = document.getElementById('exam-mcq-choices');
  const textarea = document.getElementById('editor-textarea');
  const progress = document.getElementById('exam-progress-label');
  const prevBtn = document.getElementById('exam-prev-btn');
  const nextBtn = document.getElementById('exam-next-btn');

  if (editorBox) editorBox.classList.toggle('hidden', isMcq(q));
  if (mcqBox) mcqBox.classList.toggle('hidden', !isMcq(q));

  if (isMcq(q)) {
    const meta = q.question;
    if (badge) badge.textContent = `Domain ${meta.domain} · ${window.McqLogic.DOMAIN_NAMES[meta.domain]} · Objective ${meta.objective}`;
    if (title) title.textContent = meta.type === 'multi' ? 'เลือกได้มากกว่า 1 คำตอบ' : 'เลือก 1 คำตอบ';
    if (task) task.textContent = meta.stem;
    renderMcqChoices(q);
  } else {
    if (badge) badge.textContent = `${q.trackTitle} · ${q.lesson.meta}`;
    if (title) title.textContent = q.lesson.title;
    if (task) task.innerHTML = q.lesson.task;
    if (textarea) {
      textarea.value = EXAM_STATE.answers[questionKey(q)] !== undefined ? EXAM_STATE.answers[questionKey(q)] : q.lesson.template;
      if (typeof updateGutter === 'function') updateGutter();
      if (typeof hideEditorAutocomplete === 'function') hideEditorAutocomplete();
    }
  }
  if (progress) progress.textContent = `ข้อ ${idx + 1} / ${EXAM_STATE.questions.length}`;
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === EXAM_STATE.questions.length - 1;
}

// Choices are shown in q.order (a per-attempt shuffle) but the stored answer and the grader
// both use the ORIGINAL indices, so shuffling can never change what counts as correct.
function renderMcqChoices(q) {
  const box = document.getElementById('exam-mcq-choices');
  if (!box) return;
  const type = q.question.type === 'multi' ? 'checkbox' : 'radio';
  const picked = EXAM_STATE.answers[questionKey(q)] || [];
  box.innerHTML = q.order.map(origIdx => `
    <label class="mcq-choice">
      <input type="${type}" name="mcq-choice" value="${origIdx}" ${picked.includes(origIdx) ? 'checked' : ''}>
      <span>${escapeHtmlExam(q.question.choices[origIdx])}</span>
    </label>
  `).join('');
  box.querySelectorAll('input').forEach(el => el.addEventListener('change', () => saveMcqSelection(q)));
}

function saveMcqSelection(q) {
  const box = document.getElementById('exam-mcq-choices');
  if (!box) return;
  EXAM_STATE.answers[questionKey(q)] = Array.from(box.querySelectorAll('input:checked')).map(el => Number(el.value));
  renderQuestionNav();
}

function confirmSubmitExam() {
  saveCurrentAnswer();
  const answeredCount = EXAM_STATE.questions.filter(isAnswered).length;
  const unanswered = EXAM_STATE.questions.length - answeredCount;
  const msg = unanswered > 0
    ? `ยังไม่ได้ตอบ ${unanswered} ข้อ ต้องการส่งคำตอบเลยหรือไม่?`
    : 'ต้องการส่งคำตอบและดูผลคะแนนหรือไม่?';
  if (confirm(msg)) submitExam(false);
}

async function gradeQuestion(q) {
  if (isMcq(q)) {
    const selected = EXAM_STATE.answers[questionKey(q)] || [];
    return { ...q, selected, passed: window.McqLogic.gradeMcq(q.question, selected), error: null };
  }
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
      ${EXAM_STATE.mode === 'mcq' ? renderDomainBreakdown(results) : ''}
    `;
  }

  const breakdown = document.getElementById('exam-results-breakdown');
  if (breakdown) {
    breakdown.innerHTML = results.map((r, idx) => (isMcq(r) ? renderMcqResult(r, idx) : renderCodeResult(r, idx))).join('');
  }
}

// Per-domain score so a learner can see which SY0-701 domain to study next.
function renderDomainBreakdown(results) {
  const rows = Object.keys(window.McqLogic.DOMAIN_NAMES).map(d => {
    const inDomain = results.filter(r => r.question.domain === Number(d));
    if (inDomain.length === 0) return '';
    const right = inDomain.filter(r => r.passed).length;
    return `<div class="domain-row"><span>Domain ${d} · ${window.McqLogic.DOMAIN_NAMES[d]}</span><span>${right} / ${inDomain.length}</span></div>`;
  }).join('');
  return `<div class="domain-breakdown">${rows}</div>`;
}

function renderCodeResult(r, idx) {
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
}

// MCQ results always show the explanation (right or wrong): the explanation is where the
// learning is, including why the most tempting wrong choice is wrong.
function renderMcqResult(r, idx) {
  const q = r.question;
  const statusClass = r.passed ? 'exam-result-pass' : 'exam-result-fail';
  const statusLabel = r.passed ? '✓ ถูกต้อง' : '✗ ไม่ถูกต้อง';
  const list = (indices) => indices.length === 0
    ? '<em>ไม่ได้ตอบ</em>'
    : indices.map(i => escapeHtmlExam(q.choices[i])).join(' &nbsp;|&nbsp; ');
  return `
    <div class="exam-result-item ${statusClass}">
      <div class="exam-result-header">
        <span class="exam-result-index">ข้อ ${idx + 1}</span>
        <span class="exam-result-track">Domain ${q.domain} · Objective ${q.objective}</span>
        <span class="exam-result-status">${statusLabel}</span>
      </div>
      <div class="exam-result-title">${escapeHtmlExam(q.stem)}</div>
      <div class="mcq-result-line"><strong>คำตอบของคุณ:</strong> ${list(r.selected)}</div>
      ${r.passed ? '' : `<div class="mcq-result-line"><strong>เฉลย:</strong> ${list(q.answer)}</div>`}
      <div class="mcq-explanation">${escapeHtmlExam(q.explanation)}</div>
    </div>
  `;
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
