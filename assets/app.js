const PAGES = [
  { id:'home',  href:'index.html',   label:'Overview',              icon:'◈',  group:'start' },
  { id:'ch1',   href:'ch1.html',     label:'System Overview',       num:'1',   group:'chapters' },
  { id:'ch2',   href:'ch2.html',     label:'How Forms Are Built',   num:'2',   group:'chapters' },
  { id:'ch3',   href:'ch3.html',     label:'mForm → Frappe',        num:'3',   group:'chapters' },
  { id:'ch4',   href:'ch4.html',     label:'The Web Side',          num:'4',   group:'chapters' },
  { id:'ch5',   href:'ch5.html',     label:'The Mobile App',        num:'5',   group:'chapters' },
  { id:'ch6',   href:'ch6.html',     label:'Data Flow & Sync',      num:'6',   group:'chapters' },
  { id:'ch7',   href:'ch7.html',     label:'Form & Module Reference',num:'7',  group:'chapters' },
  { id:'glos',  href:'glossary.html',label:'Glossary',              icon:'≡',  group:'ref' },
];
const CHAPTERS = PAGES.filter(p => p.num);

function getProgress() {
  try { return JSON.parse(localStorage.getItem('dris_fp') || '[]'); } catch { return []; }
}
function markDone(id) {
  const p = getProgress();
  if (!p.includes(id)) { p.push(id); localStorage.setItem('dris_fp', JSON.stringify(p)); }
  renderProgress();
}
function isDone(id) { return getProgress().includes(id); }
function renderProgress() {
  const done = getProgress().filter(id => CHAPTERS.find(c => c.id === id)).length;
  const pct  = Math.round((done / CHAPTERS.length) * 100);
  const bar  = document.getElementById('sb-fill');
  const val  = document.getElementById('sb-prog-val');
  const top  = document.getElementById('top-prog');
  if (bar) bar.style.width = pct + '%';
  if (val) val.textContent = done + ' / ' + CHAPTERS.length;
  if (top) top.innerHTML = 'Progress: <span>' + done + ' / ' + CHAPTERS.length + '</span>';
  document.querySelectorAll('.sb-link[data-id]').forEach(el => {
    isDone(el.dataset.id) ? el.classList.add('done') : el.classList.remove('done');
  });
}

function buildSidebar(currentId) {
  const el = document.getElementById('sb-nav');
  if (!el) return;
  let h = '';

  // Start
  h += `<div class="sb-section"><div class="sb-section-label">Start</div>`;
  h += `<a href="index.html" class="sb-link${currentId==='home'?' active':''}" data-id="home">
    <span class="sb-ico">◈</span><span>Overview</span><span class="sb-done">✓</span></a>`;
  h += `</div>`;

  // Chapters
  h += `<div class="sb-section"><div class="sb-section-label">Chapters</div>`;
  CHAPTERS.forEach(p => {
    const active = currentId === p.id;
    h += `<a href="${p.href}" class="sb-link${active?' active':''}" data-id="${p.id}">
      <span class="sb-num">${p.num}</span>
      <span>${p.label}</span>
      <span class="sb-done">✓</span>
    </a>`;
  });
  h += `</div>`;

  // Divider + Reference
  h += `<div class="sb-divider"></div>`;
  h += `<div class="sb-section">`;
  h += `<a href="glossary.html" class="sb-link${currentId==='glos'?' active':''}" data-id="glos">
    <span class="sb-ico" style="font-size:16px">≡</span><span>Glossary</span><span class="sb-done">✓</span></a>`;
  h += `</div>`;

  el.innerHTML = h;
  renderProgress();
}

function initAcc() {
  document.querySelectorAll('.acc-hdr').forEach(h => {
    h.addEventListener('click', () => h.closest('.acc-item').classList.toggle('open'));
  });
}

function initTabs() {
  document.querySelectorAll('.tab-btns').forEach(grp => {
    grp.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const tabs = btn.closest('.tabs');
        tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabs.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        tabs.querySelectorAll('.tab-pane')[i].classList.add('active');
      });
    });
  });
}

function initQuiz() {
  document.querySelectorAll('.quiz-opt').forEach(opt => {
    opt.addEventListener('click', function() {
      const q = this.closest('.quiz-q');
      if (q.dataset.answered) return;
      q.dataset.answered = '1';
      const ok = this.dataset.correct === 'true';
      this.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) q.querySelector('[data-correct="true"]')?.classList.add('correct');
      q.querySelectorAll('.quiz-fb').forEach(f => f.classList.remove('show'));
      q.querySelector(ok ? '.quiz-fb.ok' : '.quiz-fb.bad')?.classList.add('show');
    });
  });
}

function initComplete(pageId) {
  const btn = document.getElementById('complete-btn');
  if (!btn) return;
  if (isDone(pageId)) { btn.textContent = '✓ Marked Complete'; btn.disabled = true; }
  btn.addEventListener('click', () => {
    markDone(pageId);
    btn.textContent = '✓ Marked Complete';
    btn.disabled = true;
  });
}

function initMobile() {
  const btn = document.getElementById('mob-btn');
  const sb  = document.getElementById('sidebar');
  if (!btn || !sb) return;
  btn.addEventListener('click', () => sb.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sb.contains(e.target) && e.target !== btn) sb.classList.remove('open');
  });
}

function initPage(pageId) {
  buildSidebar(pageId);
  initAcc();
  initTabs();
  initQuiz();
  initComplete(pageId);
  initMobile();
}
