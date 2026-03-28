/* ======================== READING LESSON — SHARED JS ======================== */
/* Requires: shared/lesson.js loaded first, CAT_LABELS + IELTS_OPTIONS set by lesson page */

/* ======================== READING GLOBALS ======================== */
let sections=[], IQ=[], QT=null, SQ=null;
const pia={};

/* ======================== HTML TEMPLATE ======================== */
function renderReadingPage(cfg){
  /* cfg: { title, sub, passageRight:'ielts'|'summary-q'|'none', passageLabel, ieltsInstruction, optsLayout:'wrap'|'column', summaryCards } */
  const optsClass = cfg.optsLayout==='column' ? 'opts-col' : '';
  const stClass = cfg.stPreline ? 'st-preline' : '';

  let passageRightHTML = '';
  if(cfg.passageRight==='ielts'){
    passageRightHTML = `
      <div class="passage-right">
        <div class="card">
          <div style="font-family:'Fraunces',serif;font-weight:700;font-size:1.1rem;color:var(--accent);margin-bottom:4px">${cfg.passageLabel||''}</div>
          <p style="font-size:.85rem;color:#8a7a66;font-style:italic;margin-bottom:12px">${cfg.passageInstruction||''}</p>
          <div id="passage-ielts-ctn"></div>
          <div class="ctrls" style="margin-top:12px">
            <button class="btn bp" id="pic" onclick="checkPassageIELTS()">Check</button>
            <button class="btn bs" id="pir" onclick="resetPassageIELTS()" style="display:none">Redo</button>
          </div>
          <div id="passage-ielts-banner" class="banner" style="margin-top:12px"></div>
        </div>
      </div>`;
  } else if(cfg.passageRight==='summary-q'){
    passageRightHTML = `<div class="passage-right"><div class="sq-card" id="sq-card"></div></div>`;
  }

  document.getElementById('app').innerHTML = `
  <div class="container">
    <header>
      <h1>${cfg.title}</h1>
      <div class="sub">${cfg.sub}</div>
    </header>

    <div class="tabs">
      <button class="tab-btn active" data-tab="passage">📖 Passage</button>
      <button class="tab-btn" data-tab="vocab">📝 Vocabulary</button>
      <button class="tab-btn" data-tab="quiz">❓ Quiz</button>
      <button class="tab-btn" data-tab="phrases">💬 Phrases</button>
      <button class="tab-btn" data-tab="summary">💡 Summary</button>
    </div>

    <div id="passage" class="tp active">
      <div class="vi-bar">
        <label>🇻🇳 Show Vietnamese translation</label>
        <label class="sw"><input type="checkbox" id="vi-toggle" onchange="toggleVI()"><span class="sld"></span></label>
      </div>
      <div class="passage-split">
        <div class="passage-left">
          <div class="card" id="passage-card"></div>
        </div>
        ${passageRightHTML}
      </div>
    </div>

    <div id="vocab" class="tp">
      <div class="vf" id="vocab-filter"></div>
      <div class="vg" id="vocab-grid"></div>
    </div>

    <div id="quiz" class="tp">
      <div class="stabs">
        <button class="stab active" data-sub="ielts">📋 IELTS</button>
        <button class="stab" data-sub="flashcard">🃏 Flashcard</button>
        <button class="stab" data-sub="fillblank">✏️ Fill in Blank</button>
        <button class="stab" data-sub="match">🔗 Matching</button>
      </div>
      <div id="ielts" class="sp active">
        <div id="qt-info-ctn"></div>
        ${cfg.ieltsInstruction ? `<p style="text-align:center;color:#8a7a66;margin-bottom:16px;font-size:.88rem">${cfg.ieltsInstruction}</p>` : ''}
        <div id="ielts-banner" class="banner"></div>
        <div id="ielts-ctn" class="${optsClass}"></div>
        <div class="ctrls">
          <button class="btn bp" id="ic" onclick="checkIELTS()">Check</button>
          <button class="btn bs" id="ir" onclick="resetIELTS()" style="display:none">Redo</button>
        </div>
      </div>
      <div id="flashcard" class="sp">
        <div class="fcc">
          <div class="fcpg"><div class="fcpgb" id="fc-bar"></div></div>
          <div class="fc" id="fc-card" onclick="flipCard()">
            <div class="fci" id="fc-inner">
              <div class="fcf"><div class="fcw" id="fc-word"></div><div class="fcp" id="fc-pos"></div><div class="fcp" id="fc-ipa" style="color:#888"></div><button class="audio-btn" id="fc-audio" onclick="event.stopPropagation();speak(document.getElementById('fc-word').textContent)" style="font-size:1.3rem;margin-top:6px">🔊</button><div class="fch">tap to flip</div></div>
              <div class="fcb"><div class="fcd" id="fc-def"></div><div class="fcvi" id="fc-vi"></div><div class="fce" id="fc-ex"></div></div>
            </div>
          </div>
          <div class="fcn">
            <button class="btn bs" onclick="fcPrev()">← Previous</button>
            <span class="fccnt" id="fc-cnt"></span>
            <button class="btn bp" onclick="fcNext()">Next →</button>
          </div>
          <button class="btn bs" onclick="shuffleFC()" style="margin-top:4px">🔀 Shuffle</button>
        </div>
      </div>
      <div id="fillblank" class="sp">
        <div class="qh"><div class="qt">Fill in the blanks</div><div class="qs" id="fb-sc"></div></div>
        <div id="fb-ctn"></div>
        <div class="ctrls">
          <button class="btn bp" id="fbc" onclick="checkFB()">Check</button>
          <button class="btn bs" id="fbr" onclick="resetFB()" style="display:none">Redo</button>
        </div>
      </div>
      <div id="match" class="sp">
        <div class="qh"><div class="qt">Match words with Vietnamese meanings</div><div class="qs" id="m-sc"></div></div>
        <p style="text-align:center;color:#8a7a66;margin-bottom:12px;font-size:.85rem">Select a word on the left, then select its meaning on the right</p>
        <div class="mg" id="m-grid"></div>
        <div class="ctrls" style="margin-top:16px"><button class="btn bs" onclick="resetMatch()">Play again</button></div>
      </div>
    </div>

    <div id="phrases" class="tp">
      <p style="text-align:center;color:#8a7a66;margin-bottom:16px;font-size:.9rem">${cfg.phrasesIntro||'Useful phrases from this passage that you can reuse in IELTS Writing & Speaking.'}</p>
      <div class="ph-grid" id="phrases-grid"></div>
    </div>

    <div id="summary" class="tp">
      ${cfg.summaryCards||''}
    </div>
  </div>`;

  // Store config for rendering functions
  window._readingCfg = cfg;

  // Setup tab & sub-tab listeners
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tp').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active');
  }));
  document.querySelectorAll('.stab').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.stab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.sp').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');document.getElementById(b.dataset.sub).classList.add('active');
  }));
}

/* ======================== PASSAGE ======================== */
function renderPassage(){
  const stClass = window._readingCfg && window._readingCfg.stPreline ? ' st-preline' : '';
  document.getElementById('passage-card').innerHTML=sections.map(s=>`
    <div class="section" data-section="${s.id}">
      <span class="sl">${s.id}</span>
      <p class="st${stClass}">${s.text}</p>
      <div class="vit" data-vi>${s.vietnamese}</div>
    </div>`).join('');
}

function toggleVI(){const show=document.getElementById('vi-toggle').checked;document.querySelectorAll('[data-vi]').forEach(e=>e.classList.toggle('show',show));}

/* ======================== IELTS QUIZ ======================== */
function renderIELTS(){
  const optsClass = window._readingCfg && window._readingCfg.optsLayout==='column' ? ' opts-col' : '';
  document.getElementById('ielts-ctn').innerHTML=IQ.map((q,i)=>{
    let optsHtml;
    if(typeof IELTS_OPTIONS!=='undefined' && IELTS_OPTIONS){
      // Fixed option set (T/F/NG or letter matching)
      optsHtml = IELTS_OPTIONS.map(o=>`<button class="ob" data-q="${i}" data-v="${o}" onclick="selI(this)">${o}</button>`).join('');
    } else if(q.options){
      // Per-question options (multiple choice)
      optsHtml = q.options.map(o=>`<button class="ob" data-q="${i}" data-v="${o.v}" onclick="selI(this)"><strong>${o.v}</strong>&nbsp; ${o.t}</button>`).join('');
    }
    return `<div class="card" id="iq-${i}"><div class="qn">Question ${q.number}</div><div class="qtx">${q.text}</div>
    <div class="opts${optsClass}">${optsHtml}</div>
    <div class="exp" id="ie-${i}"></div></div>`;
  }).join('');
}

function selI(b){const q=b.dataset.q;document.querySelectorAll(`.ob[data-q="${q}"]`).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ia[q]=b.dataset.v;}

function checkIELTS(){
  let sc=0;IQ.forEach((q,i)=>{
    const c=document.getElementById(`iq-${i}`),e=document.getElementById(`ie-${i}`);
    document.querySelectorAll(`.ob[data-q="${i}"]`).forEach(b=>{b.disabled=true;if(b.dataset.v===q.answer)b.classList.add('ca');if(b.classList.contains('sel')&&b.dataset.v!==q.answer)b.classList.add('wa');});
    const ok=ia[i]===q.answer;if(ok)sc++;c.classList.add(ok?'correct':'wrong');
    e.innerHTML=`<strong>${ok?'✅':'❌'} Answer: ${q.answer}</strong><br>${q.explanation}<br><em style="color:var(--vi)">${q.vietnamese}</em>`;
    e.classList.add('show',ok?'ce':'we');
  });
  const t=IQ.length, pct=sc/t;
  const b=document.getElementById('ielts-banner');b.style.display='block';
  b.style.background=pct>=.7?'var(--correct-bg)':pct>=.4?'var(--accent-light)':'var(--wrong-bg)';
  b.style.color=pct>=.7?'var(--correct)':pct>=.4?'var(--accent)':'var(--wrong)';
  b.textContent=`${sc} / ${t} correct`;b.classList.add('show');
  document.getElementById('ic').style.display='none';document.getElementById('ir').style.display='inline-block';
}

function resetIELTS(){
  Object.keys(ia).forEach(k=>delete ia[k]);
  document.querySelectorAll('#ielts-ctn .card').forEach(c=>c.classList.remove('correct','wrong'));
  document.querySelectorAll('#ielts-ctn .ob').forEach(b=>{b.disabled=false;b.classList.remove('sel','ca','wa');});
  document.querySelectorAll('#ielts-ctn .exp').forEach(e=>{e.classList.remove('show','ce','we');e.innerHTML='';});
  document.getElementById('ielts-banner').style.display='none';
  document.getElementById('ic').style.display='inline-block';document.getElementById('ir').style.display='none';
}

/* ======================== PASSAGE-SIDE IELTS ======================== */
function renderPassageIELTS(){
  const ctn=document.getElementById('passage-ielts-ctn');
  if(!ctn||!IQ.length)return;
  const opts = (typeof IELTS_OPTIONS!=='undefined' && IELTS_OPTIONS) ? IELTS_OPTIONS : null;
  ctn.innerHTML=IQ.map((q,i)=>{
    let optsHtml;
    if(opts){
      optsHtml = opts.map(o=>`<button class="ob" style="padding:6px 12px;font-size:.82rem" data-pq="${i}" data-v="${o}" onclick="selPI(this)">${o}</button>`).join('');
    } else if(q.options){
      optsHtml = q.options.map(o=>`<button class="ob" style="padding:6px 12px;font-size:.82rem" data-pq="${i}" data-v="${o.v}" onclick="selPI(this)"><strong>${o.v}</strong>&nbsp; ${o.t}</button>`).join('');
    }
    return `<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--accent-light)" id="piq-${i}">
      <div class="qn">Q${q.number}</div>
      <div style="font-size:.88rem;font-weight:600;margin-bottom:6px">${q.text}</div>
      <div class="opts" style="flex-direction:row;flex-wrap:wrap;gap:6px">${optsHtml}</div>
      <div class="exp" id="pie-${i}"></div>
    </div>`;
  }).join('');
}

function selPI(b){const q=b.dataset.pq;document.querySelectorAll(`.ob[data-pq="${q}"]`).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');pia[q]=b.dataset.v;}

function checkPassageIELTS(){
  let sc=0;IQ.forEach((q,i)=>{
    const e=document.getElementById(`pie-${i}`);
    document.querySelectorAll(`.ob[data-pq="${i}"]`).forEach(b=>{b.disabled=true;if(b.dataset.v===q.answer)b.classList.add('ca');if(b.classList.contains('sel')&&b.dataset.v!==q.answer)b.classList.add('wa');});
    const ok=pia[i]===q.answer;if(ok)sc++;
    e.innerHTML=`<strong>${ok?'✅':'❌'} ${q.answer}</strong> — ${q.explanation}<br><em style="color:var(--vi)">${q.vietnamese}</em>`;
    e.classList.add('show',ok?'ce':'we');
  });
  const t=IQ.length, pct=sc/t;
  const b=document.getElementById('passage-ielts-banner');b.style.display='block';
  b.style.background=pct>=.7?'var(--correct-bg)':pct>=.4?'var(--accent-light)':'var(--wrong-bg)';
  b.style.color=pct>=.7?'var(--correct)':pct>=.4?'var(--accent)':'var(--wrong)';
  b.textContent=`${sc} / ${t} correct`;b.classList.add('show');
  document.getElementById('pic').style.display='none';document.getElementById('pir').style.display='inline-block';
}

function resetPassageIELTS(){
  Object.keys(pia).forEach(k=>delete pia[k]);
  document.querySelectorAll('#passage-ielts-ctn .ob').forEach(b=>{b.disabled=false;b.classList.remove('sel','ca','wa');});
  document.querySelectorAll('#passage-ielts-ctn .exp').forEach(e=>{e.classList.remove('show','ce','we');e.innerHTML='';});
  document.getElementById('passage-ielts-banner').style.display='none';
  document.getElementById('pic').style.display='inline-block';document.getElementById('pir').style.display='none';
}

/* ======================== QUESTION TYPE INFO ======================== */
function renderQTInfo(){
  if(!QT)return;
  const ctn=document.getElementById('qt-info-ctn');
  if(!ctn)return;
  let html='';
  QT.active.forEach(qt=>{
    html+=`<div class="qt-info open" onclick="this.classList.toggle('open')">
      <div class="qt-info-header">
        <span class="qt-info-type">${qt.icon} Question Type: ${qt.name}</span>
        <span class="qt-info-toggle">▼</span>
      </div>
      <div class="qt-info-body">
        <div class="qt-info-desc">${qt.description}</div>
        <div class="qt-info-vi">🇻🇳 ${qt.vi}</div>
        <ul class="qt-info-tips">${qt.tips.map(t=>'<li>'+t+'</li>').join('')}</ul>
        <div class="qt-types-title">All IELTS Reading Question Types</div>
        <div class="qt-checklist">${QT.allTypes.map(t=>
          `<div class="qt-check-item${t.practiced?' practiced':''}"><span class="qt-mark">${t.practiced?'✅':'○'}</span>${t.name}</div>`
        ).join('')}</div>
      </div>
    </div>`;
  });
  ctn.innerHTML=html;
}

/* ======================== SUMMARY QUESTIONS (video-games style) ======================== */
function renderSummaryQ(){
  if(!SQ)return;
  let html=`<div class="sq-title">📝 Questions ${SQ.groups[0]?.items[0]?.n||''}–${SQ.groups[SQ.groups.length-1]?.items[SQ.groups[SQ.groups.length-1].items.length-1]?.n||''}: Short answer summary</div>
    <div class="sq-inst">${SQ.instruction}</div>`;
  SQ.groups.forEach(g=>{
    html+=`<div class="sq-label">${g.label}</div>`;
    g.items.forEach(item=>{
      html+=`<div class="sq-sentence" id="sq-item-${item.n}">`;
      let blankIdx=0;
      item.parts.forEach(part=>{
        if(part.blank){
          const qn=item.n+blankIdx;
          html+=`<span class="sq-num">${qn}</span> <input type="text" class="sq-bi" id="sq-${qn}" data-answers='${JSON.stringify(part.a)}' placeholder="..." autocomplete="off" autocapitalize="off" spellcheck="false"> <span class="sq-answer" id="sq-ans-${qn}"></span> `;
          blankIdx++;
        }else{
          html+=part.text+' ';
        }
      });
      html+=`</div><div class="sq-exp" id="sq-exp-${item.n}">${item.vi}</div>`;
    });
  });
  html+=`<div class="sq-score" id="sq-score"></div>
    <div class="ctrls" style="margin-top:16px">
      <button class="btn bp" id="sq-check" onclick="checkSummaryQ()">Check</button>
      <button class="btn bs" id="sq-redo" onclick="resetSummaryQ()" style="display:none">Redo</button>
    </div>`;
  document.getElementById('sq-card').innerHTML=html;
}

function checkSummaryQ(){
  let correct=0,total=0;
  SQ.groups.forEach(g=>{
    g.items.forEach(item=>{
      let blankIdx=0;
      item.parts.forEach(part=>{
        if(part.blank){
          total++;
          const qn=item.n+blankIdx;
          const input=document.getElementById(`sq-${qn}`);
          const ansSpan=document.getElementById(`sq-ans-${qn}`);
          const userVal=input.value.trim().toLowerCase();
          const accepted=part.a.map(a=>a.toLowerCase());
          const ok=accepted.some(a=>userVal===a);
          input.classList.add(ok?'ci':'wi');
          input.disabled=true;
          if(ok){correct++;}
          else{ansSpan.textContent='→ '+part.a[0];ansSpan.classList.add('show');}
          blankIdx++;
        }
      });
      document.getElementById(`sq-exp-${item.n}`).classList.add('show');
    });
  });
  const sc=document.getElementById('sq-score');
  sc.textContent=`${correct} / ${total} correct`;
  sc.className='sq-score '+(correct>=total*0.7?'good':correct>=total*0.4?'mid':'bad');
  document.getElementById('sq-check').style.display='none';
  document.getElementById('sq-redo').style.display='';
}

function resetSummaryQ(){
  document.querySelectorAll('.sq-bi').forEach(i=>{i.value='';i.disabled=false;i.classList.remove('ci','wi');});
  document.querySelectorAll('.sq-answer').forEach(s=>{s.textContent='';s.classList.remove('show');});
  document.querySelectorAll('.sq-exp').forEach(e=>e.classList.remove('show'));
  document.getElementById('sq-score').textContent='';
  document.getElementById('sq-check').style.display='';
  document.getElementById('sq-redo').style.display='none';
}

/* ======================== INIT READING ======================== */
function initReading(data){
  sections = data.sections || [];
  V = data.vocabulary || [];
  IQ = data.ieltsQuestions || [];
  FB = data.fillBlanks || [];
  UP = data.usefulPhrases || [];
  QT = data.questionTypes || null;
  SQ = data.summaryQuestions || null;

  renderPassage();
  renderVF(); renderVocab();
  renderIELTS();
  renderFC(); renderFB2(); renderMatch(); renderPhrases();
  if(QT) renderQTInfo();
  if(document.getElementById('passage-ielts-ctn')) renderPassageIELTS();
  if(SQ && document.getElementById('sq-card')) renderSummaryQ();
  if(SQ && !IQ.length){
    document.getElementById('ielts-ctn').innerHTML='<div class="card" style="text-align:center;padding:32px"><p style="font-size:1rem;margin-bottom:12px">✏️ Sentence completion questions are shown alongside the passage.</p><button class="btn bp" onclick="document.querySelector(\'[data-tab=passage]\').click()">Go to Passage</button></div>';
    document.getElementById('ic').style.display='none';
  }

  Promise.all(V.map(v=>fetchIPA(v.word))).then(()=>{renderVocab();renderFC();});
}
