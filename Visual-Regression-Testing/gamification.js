// Gamification layer: milestone messages + completion certificates.
// Requires shared/engine.js's contract to already be loaded first:
//   const PREFIX, const LESSONS, function isLessonCompleted(), function showDialog(), function escapeHtml()
// Called from engine.js's setLessonCompleted() and each track's showGraduationMessage().

// Milestone thresholds — fires once per track when crossed (fire-once guard in localStorage)
const MILESTONES = [
  { pct: 50, label: 'ครึ่งทางแล้ว!' },
  { pct: 75, label: 'อีกนิดเดียว!' },
];

function checkMilestones() {
  const completed = LESSONS.filter(l => isLessonCompleted(l.id));
  const percent = Math.round((completed.length / LESSONS.length) * 100);

  MILESTONES.forEach(({ pct, label }) => {
    const key = `${PREFIX}_milestone_${pct}`;
    if (percent >= pct && localStorage.getItem(key) !== 'true') {
      localStorage.setItem(key, 'true');
      const skills = completed.map(l => `✓ ${l.title}`).join('\n');
      showDialog(`🎯 ${label} (${percent}%)`, `ตอนนี้คุณเขียนโค้ดเรื่องเหล่านี้ได้แล้ว:\n\n${skills}`, false);
    }
  });
}

// Small "certificate" overlay shown when a track hits 100% (game-like reward, no PDF/print dependency)
function showTrackCertificate(trackTitle) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
  overlay.innerHTML = `
    <div style="background:#fff;color:#1a1a2e;border-radius:12px;padding:32px 40px;max-width:420px;text-align:center;border:4px double #f59e0b;box-shadow:0 20px 60px rgba(0,0,0,.4);">
      <div style="font-size:40px;">🏅</div>
      <h2 style="margin:8px 0 4px;font-size:20px;">ใบประกาศจบหลักสูตร</h2>
      <p style="margin:0 0 16px;font-size:13px;opacity:.7;">Certificate of Completion</p>
      <p style="font-size:16px;font-weight:600;margin:0 0 4px;">${escapeHtml(trackTitle)}</p>
      <p style="font-size:13px;opacity:.7;margin:0 0 20px;">${LESSONS.length} บทเรียน ครบทุกบทแล้ว! · ${new Date().toLocaleDateString('th-TH')}</p>
      <button id="cert-close-btn" style="background:#f59e0b;color:#1a1a2e;border:none;border-radius:6px;padding:10px 24px;font-weight:600;cursor:pointer;">เก็บใบประกาศ 🎉</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#cert-close-btn').onclick = () => overlay.remove();
}
