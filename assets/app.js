// ── NAV STRUCTURE ──
const PAGES = [
  { id:'home',  href:'index.html',  label:'Welcome',              icon:'🏠',  group:'start' },
  { id:'ch1',   href:'ch1.html',    label:'System Overview',       num:'1',   group:'chapters' },
  { id:'ch2',   href:'ch2.html',    label:'How Forms Are Built',   num:'2',   group:'chapters' },
  { id:'ch3',   href:'ch3.html',    label:'mForm → Frappe Mapping',num:'3',   group:'chapters' },
  { id:'ch4',   href:'ch4.html',    label:'The Web Side',          num:'4',   group:'chapters' },
  { id:'ch5',   href:'ch5.html',    label:'The Mobile App',        num:'5',   group:'chapters' },
  { id:'ch6',   href:'ch6.html',    label:'Data Flow & Sync',      num:'6',   group:'chapters' },
  { id:'ch7',   href:'ch7.html',    label:'Form & Module Reference',num:'7',  group:'chapters' },
  { id:'glos',  href:'glossary.html', label:'Glossary', icon:'📖', group:'ref' },
];

const CHAPTERS = PAGES.filter(p => p.num);

// ── PROGRESS ──
function getProgress() {
  try { return JSON.parse(localStorage.getItem('fp2') || '[]'); } catch { return []; }
}
function markDone(id) {
  const p = getProgress();
  if (!p.includes(id)) { p.push(id); localStorage.setItem('fp2', JSON.stringify(p)); }
  updateProgress();
}
function isDone(id) { return getProgress().includes(id); }
function updateProgress() {
  const done = getProgress().filter(id => CHAPTERS.find(c => c.id === id)).length;
  const pct = Math.round((done / CHAPTERS.length) * 100);
  const bar = document.getElementById('sb-fill');
  const lbl = document.getElementById('sb-prog-done');
  const top = document.getElementById('top-prog');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = done + ' / ' + CHAPTERS.length;
  if (top) top.textContent = done + ' / ' + CHAPTERS.length + ' chapters';
  document.querySelectorAll('.sb-link').forEach(el => {
    const id = el.dataset.id;
    if (id && isDone(id)) el.classList.add('done');
    else el.classList.remove('done');
  });
}

// ── BUILD SIDEBAR ──
function buildSidebar(currentId) {
  const sb = document.getElementById('sb-nav');
  if (!sb) return;

  // Start group
  let html = `<div class="sb-group"><div class="sb-group-label">Start</div>`;
  html += `<a href="index.html" class="sb-link${currentId==='home'?' active':''}" data-id="home">
    <span class="sb-ico">🏠</span><span>Welcome</span><span class="sb-check">✓</span></a>`;
  html += `</div>`;

  // Chapters
  html += `<div class="sb-group"><div class="sb-group-label">Chapters</div>`;
  CHAPTERS.forEach((p, i) => {
    const isActive = currentId === p.id;
    const isNext = i === CHAPTERS.findIndex(c => !isDone(c.id)) && !isDone(p.id);
    html += `<a href="${p.href}" class="sb-link${isActive?' active':''}" data-id="${p.id}">
      <span class="sb-num">${p.num}</span>
      <span>${p.label}</span>
      <span class="sb-check">✓</span>
    </a>`;
  });
  html += `</div>`;

  // Reference
  html += `<div class="sb-group"><div class="sb-group-label">Reference</div>`;
  html += `<a href="glossary.html" class="sb-link${currentId==='glos'?' active':''}" data-id="glos">
    <span class="sb-ico">📖</span><span>Glossary</span><span class="sb-check">✓</span></a>`;
  html += `</div>`;

  sb.innerHTML = html;
  updateProgress();
}

// ── ACCORDION ──
function initAcc() {
  document.querySelectorAll('.acc-hdr').forEach(h => {
    h.addEventListener('click', () => h.closest('.acc-item').classList.toggle('open'));
  });
}

// ── TABS ──
function initTabs() {
  document.querySelectorAll('.tab-btns').forEach(grp => {
    grp.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.tabs');
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        parent.querySelectorAll('.tab-pane')[i].classList.add('active');
      });
    });
  });
}

// ── QUIZ ──
function initQuiz() {
  document.querySelectorAll('.quiz-opt').forEach(opt => {
    opt.addEventListener('click', function() {
      const q = this.closest('.quiz-q');
      if (q.dataset.answered) return;
      q.dataset.answered = '1';
      const ok = this.dataset.correct === 'true';
      this.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) q.querySelector('[data-correct="true"]')?.classList.add('correct');
      const fb = q.querySelectorAll('.quiz-fb');
      fb.forEach(f => f.classList.remove('show'));
      const target = q.querySelector(ok ? '.quiz-fb.ok' : '.quiz-fb.bad');
      if (target) target.classList.add('show');
    });
  });
}

// ── MARK COMPLETE ──
function initComplete(pageId) {
  const btn = document.getElementById('complete-btn');
  if (!btn) return;
  if (isDone(pageId)) { btn.textContent = '✓ Completed'; btn.disabled = true; }
  btn.addEventListener('click', () => {
    markDone(pageId);
    btn.textContent = '✓ Completed';
    btn.disabled = true;
    updateProgress();
  });
}

// ── MOBILE TOGGLE ──
function initMobile() {
  const btn = document.getElementById('mob-toggle');
  const sb = document.getElementById('sidebar');
  if (!btn || !sb) return;
  btn.addEventListener('click', () => sb.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sb.contains(e.target) && e.target !== btn) sb.classList.remove('open');
  });
}

// ── INIT ──
function initPage(pageId) {
  buildSidebar(pageId);
  initAcc();
  initTabs();
  initQuiz();
  initComplete(pageId);
  initMobile();
}
