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

// Downloads a DOM node as a PNG via html2canvas (loaded from CDN in each track's index.html).
// A plain SVG-foreignObject→canvas rasterization taints the canvas in modern browsers
// (SecurityError on toBlob/toDataURL) — html2canvas avoids that by painting the DOM onto
// canvas itself with Canvas 2D primitives instead of rasterizing an SVG image.
function downloadElementAsImage(el, filename) {
  html2canvas(el, { backgroundColor: null, scale: 2 }).then((canvas) => {
    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
    });
  });
}

// Small "certificate" overlay shown when a track hits 100% (game-like reward, no PDF/print dependency)
function showTrackCertificate(trackTitle) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
  overlay.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
      <div id="cert-card" style="background:#fff;color:#1a1a2e;border-radius:12px;padding:32px 40px;max-width:420px;text-align:center;border:4px double #f59e0b;box-shadow:0 20px 60px rgba(0,0,0,.4);font-family:'Inter',sans-serif;">
        <div style="font-size:40px;">🏅</div>
        <h2 style="margin:8px 0 4px;font-size:20px;">ใบประกาศจบหลักสูตร</h2>
        <p style="margin:0 0 16px;font-size:13px;opacity:.7;">Certificate of Completion</p>
        <p style="font-size:16px;font-weight:600;margin:0 0 4px;">${escapeHtml(trackTitle)}</p>
        <p style="font-size:13px;opacity:.7;margin:0 0 20px;">${LESSONS.length} บทเรียน ครบทุกบทแล้ว! · ${new Date().toLocaleDateString('th-TH')}</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button id="cert-download-btn" style="background:#fff;color:#f59e0b;border:2px solid #f59e0b;border-radius:6px;padding:10px 20px;font-weight:600;cursor:pointer;">📥 ดาวน์โหลด</button>
        <button id="cert-close-btn" style="background:#f59e0b;color:#1a1a2e;border:none;border-radius:6px;padding:10px 24px;font-weight:600;cursor:pointer;">เก็บใบประกาศ 🎉</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#cert-close-btn').onclick = () => overlay.remove();
  overlay.querySelector('#cert-download-btn').onclick = () => {
    downloadElementAsImage(overlay.querySelector('#cert-card'), `certificate-${trackTitle.replace(/\s+/g, '-')}.png`);
  };
}
