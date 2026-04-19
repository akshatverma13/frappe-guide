// ─── PAGES CONFIG ───
const PAGES=[
  {id:'home', href:'index.html',  label:'Home',                   ico:'◈', grp:'home'},
  {id:'ch1',  href:'ch1.html',    label:'Introduction to Frappe', num:'1', grp:'chapters'},
  {id:'ch2',  href:'ch2.html',    label:'DocTypes & Data Model',  num:'2', grp:'chapters'},
  {id:'ch3',  href:'ch3.html',    label:'Building Forms',         num:'3', grp:'chapters'},
  {id:'ch4',  href:'ch4.html',    label:'Frappe Desk (Web)',       num:'4', grp:'chapters'},
  {id:'ch5',  href:'ch5.html',    label:'Scripts & Validation',   num:'5', grp:'chapters'},
  {id:'ch6',  href:'ch6.html',    label:'Mobile App & SDK',       num:'6', grp:'chapters'},
  {id:'ch7',  href:'ch7.html',    label:'Sync, Roles & Config',   num:'7', grp:'chapters'},
  {id:'glos', href:'glossary.html',label:'Glossary',              ico:'≡', grp:'ref'},
];
const CHS=PAGES.filter(p=>p.num);

// ─── PROGRESS ───
function getP(){try{return JSON.parse(localStorage.getItem('dris_v3')||'[]')}catch{return[]}}
function mark(id){const p=getP();if(!p.includes(id)){p.push(id);localStorage.setItem('dris_v3',JSON.stringify(p))}renderP()}
function done(id){return getP().includes(id)}
function renderP(){
  const d=getP().filter(id=>CHS.find(c=>c.id===id)).length;
  const pct=Math.round(d/CHS.length*100);
  const bar=document.getElementById('sb-fill');
  const val=document.getElementById('sb-pval');
  const top=document.getElementById('top-prog');
  if(bar)bar.style.width=pct+'%';
  if(val)val.textContent=d+' / '+CHS.length;
  if(top)top.innerHTML='Progress: <span>'+d+' / '+CHS.length+'</span>';
  document.querySelectorAll('.sb-link[data-id]').forEach(el=>{
    done(el.dataset.id)?el.classList.add('done'):el.classList.remove('done');
  });
}

// ─── SIDEBAR ───
function buildSB(cur){
  const el=document.getElementById('sb-nav');
  if(!el)return;
  let h='';
  h+=`<div class="sb-sec"><div class="sb-sec-lbl">Start</div>
    <a href="index.html" class="sb-link${cur==='home'?' active':''}" data-id="home">
      <span class="sb-ico">◈</span><span>Home</span><span class="sb-done">✓</span></a></div>`;
  h+=`<div class="sb-sec"><div class="sb-sec-lbl">Chapters</div>`;
  CHS.forEach(p=>{
    h+=`<a href="${p.href}" class="sb-link${cur===p.id?' active':''}" data-id="${p.id}">
      <span class="sb-num">${p.num}</span><span>${p.label}</span><span class="sb-done">✓</span></a>`;
  });
  h+=`</div><div class="sb-sep"></div>
    <div class="sb-sec">
      <a href="glossary.html" class="sb-link${cur==='glos'?' active':''}" data-id="glos">
        <span class="sb-ico" style="font-size:16px">≡</span><span>Glossary</span><span class="sb-done">✓</span></a>
    </div>`;
  el.innerHTML=h;
  renderP();
}

// ─── DARK MODE ───
function getTheme(){return localStorage.getItem('dris_theme')||'light'}
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('dris_theme',t);
  const ico=document.getElementById('theme-icon');
  if(ico)ico.textContent=t==='dark'?'☀️':'🌙';
}
function initTheme(){
  setTheme(getTheme());
  const btn=document.getElementById('theme-toggle');
  if(btn)btn.addEventListener('click',()=>setTheme(getTheme()==='dark'?'light':'dark'));
}

// ─── ACCORDION ───
function initAcc(){
  document.querySelectorAll('.acc-hdr').forEach(h=>{
    h.addEventListener('click',()=>h.closest('.acc-item').classList.toggle('open'));
  });
}

// ─── TABS ───
function initTabs(){
  document.querySelectorAll('.tab-btns').forEach(grp=>{
    grp.querySelectorAll('.tab-btn').forEach((btn,i)=>{
      btn.addEventListener('click',()=>{
        const t=btn.closest('.tabs');
        t.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        t.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
        btn.classList.add('active');
        t.querySelectorAll('.tab-pane')[i].classList.add('active');
      });
    });
  });
}

// ─── QUIZ with scoring ───
function initQuiz(){
  document.querySelectorAll('.quiz').forEach(quiz=>{
    let score=0, total=0, answered=0;
    const questions=quiz.querySelectorAll('.quiz-q');
    total=questions.length;
    const submitBtn=quiz.querySelector('.quiz-submit');
    const resultEl=quiz.querySelector('.quiz-result');
    const scoreEl=quiz.querySelector('.qs-val');

    questions.forEach((q,qi)=>{
      q.querySelectorAll('.quiz-opt').forEach(opt=>{
        opt.addEventListener('click',function(){
          if(q.dataset.answered)return;
          q.dataset.answered='1';
          answered++;
          const ok=this.dataset.correct==='true';
          if(ok)score++;
          this.classList.add(ok?'correct':'wrong');
          if(!ok)q.querySelector('[data-correct="true"]')?.classList.add('correct');
          q.querySelectorAll('.quiz-fb').forEach(f=>f.classList.remove('show'));
          q.querySelector(ok?'.quiz-fb.ok':'.quiz-fb.bad')?.classList.add('show');
          if(scoreEl)scoreEl.textContent=score+' / '+total;
          if(answered===total&&submitBtn){
            submitBtn.textContent='See Results';
            submitBtn.disabled=false;
          }
        });
      });
    });

    if(submitBtn){
      submitBtn.disabled=true;
      submitBtn.addEventListener('click',()=>{
        if(!resultEl)return;
        const pct=Math.round(score/total*100);
        const msg=pct===100?'Perfect score! 🎉':pct>=70?'Good work! Keep going.':pct>=50?'Getting there — review the chapter.':'Give the chapter another read.';
        const resultScore=resultEl.querySelector('.qr-score');
        const resultMsg=resultEl.querySelector('.qr-msg');
        if(resultScore)resultScore.textContent=score+' / '+total;
        if(resultMsg)resultMsg.textContent=msg+' ('+pct+'%)';
        resultEl.classList.add('show');
        submitBtn.disabled=true;
        submitBtn.textContent='✓ Completed';
      });
    }
  });
}

// ─── DONE BTN ───
function initDone(id){
  const btn=document.getElementById('done-btn');
  if(!btn)return;
  if(done(id)){btn.textContent='✓ Chapter Complete';btn.disabled=true;}
  btn.addEventListener('click',()=>{
    mark(id);
    btn.textContent='✓ Chapter Complete';
    btn.disabled=true;
  });
}

// ─── MOBILE ───
function initMob(){
  const btn=document.getElementById('mob-btn');
  const sb=document.getElementById('sidebar');
  if(!btn||!sb)return;
  btn.addEventListener('click',()=>sb.classList.toggle('open'));
  document.addEventListener('click',e=>{
    if(!sb.contains(e.target)&&e.target!==btn)sb.classList.remove('open');
  });
}

// ─── INIT ───
function init(id){
  buildSB(id);
  initTheme();
  initAcc();
  initTabs();
  initQuiz();
  initDone(id);
  initMob();
}
