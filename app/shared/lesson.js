/* ======================== GLOBALS (set by lesson page after data fetch) ======================== */
let INTRO={}, V=[], UP=[], FB=[];

/* ======================== AUDIO & IPA ======================== */
function speak(text){
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='en-US';u.rate=0.85;
  speechSynthesis.speak(u);
}

const ipaCache={};

function stemWord(w){
  w=w.toLowerCase();
  if(w.endsWith('ishes'))return w.slice(0,-2);
  if(w.endsWith('ates'))return w.slice(0,-1);
  if(w.endsWith('ies')&&w.length>4)return w.slice(0,-3)+'y';
  if(w.endsWith('ving'))return w.slice(0,-4)+'ve';
  if(w.endsWith('ming')&&w.length>5)return w.slice(0,-4)+'me';
  if(w.endsWith('ning')&&w.length>5)return w.slice(0,-4)+'ne';
  if(w.endsWith('ting')&&w.length>5)return w.slice(0,-4)+'te';
  if(w.endsWith('ing')&&w.length>4)return w.slice(0,-3);
  if(w.endsWith('tion'))return w;
  if(w.endsWith('es')&&w.length>3)return w.slice(0,-1);
  if(w.endsWith('ed')&&w.length>3)return w.slice(0,-2);
  if(w.endsWith('s')&&w.length>3)return w.slice(0,-1);
  return w;
}

async function tryFetchIPA(term){
  try{
    const r=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
    if(!r.ok)return '';
    const d=await r.json();
    return d[0]?.phonetic||d[0]?.phonetics?.find(p=>p.text)?.text||'';
  }catch{return '';}
}

async function fetchIPA(word){
  const key=word.toLowerCase().replace(/[^a-z]/g,'');
  if(ipaCache[key]!==undefined)return ipaCache[key];
  let ipa=await tryFetchIPA(word);
  if(!ipa&&!word.includes(' ')){
    const base=stemWord(word);
    if(base!==word.toLowerCase())ipa=await tryFetchIPA(base);
  }
  ipaCache[key]=ipa;return ipa;
}

function getIPA(word){return ipaCache[word.toLowerCase().replace(/[^a-z]/g,'')]||'';}

/* ======================== TABS ======================== */
document.addEventListener('DOMContentLoaded',()=>{
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
});

/* ======================== GUIDE ======================== */
function renderGuide(){
  document.getElementById('guide-desc').textContent=INTRO.description;
  document.getElementById('guide-format').innerHTML=INTRO.format.map(f=>`<li>${f}</li>`).join('');
  document.getElementById('guide-tips').innerHTML=INTRO.tips.map((t,i)=>`<div class="tip-card"><span class="tip-num">${i+1}.</span>${t}</div>`).join('');
}

/* ======================== VOCAB ======================== */
// CAT_LABELS must be defined by the lesson page before calling renderVocab()
function renderVocab(f='all'){
  const g=document.getElementById('vocab-grid');
  const list=f==='all'?V:V.filter(v=>v.category===f);
  g.innerHTML=list.map(v=>{
    const ipa=getIPA(v.word);
    return `<div class="vc" onclick="this.classList.toggle('open')">
      <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap">
        <div class="vw">${v.word}</div><span class="vipa">${ipa}</span>
        <button class="audio-btn" onclick="event.stopPropagation();speak('${v.word.replace(/'/g,"\\'")}')">🔊</button>
      </div>
      <div class="vp">${v.pos}</div>
      <span class="vtag">${(typeof CAT_LABELS!=='undefined'&&CAT_LABELS[v.category])||v.category}</span><div class="vtap">tap to reveal</div>
      <div class="vb"><div class="ved">${v.definition}</div><div class="vvi">🇻🇳 ${v.vietnamese}</div><div class="vex">${v.example}</div></div>
    </div>`;
  }).join('');
}

function renderVF(){
  const cats=['all',...new Set(V.map(v=>v.category))];
  document.getElementById('vocab-filter').innerHTML=cats.map(c=>`<button class="fb${c==='all'?' active':''}" onclick="fvocab('${c}',this)">${c==='all'?'All ('+V.length+')':(typeof CAT_LABELS!=='undefined'&&CAT_LABELS[c])||c}</button>`).join('');
}

function fvocab(f,btn){document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderVocab(f);}

/* ======================== PHRASES ======================== */
function renderPhrases(){
  if(!UP.length)return;
  document.getElementById('phrases-grid').innerHTML=UP.map(p=>`
    <div class="ph-card" onclick="this.classList.toggle('open')">
      <div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:4px">
        <div class="ph-phrase">${p.phrase}</div>
        <span class="ph-tag">${p.category}</span>
      </div>
      <div class="ph-example-preview">💡 ${p.example} <button class="audio-btn" onclick="event.stopPropagation();speak(\`${p.example.replace(/`/g,'').replace(/'/g,"\\'")}\`)">🔊</button></div>
      <div class="ph-tap">tap to see how to use</div>
      <div class="ph-body">
        <div class="ph-usage"><strong>When to use:</strong> ${p.usage}</div>
        <div class="ph-vi">🇻🇳 ${p.vietnamese}</div>
      </div>
    </div>`).join('');
}

/* ======================== FLASHCARD ======================== */
let fcL=[],fcI=0;
function renderFC(){
  if(!V.length)return;
  if(!fcL.length)fcL=[...V];
  const v=fcL[fcI];
  document.getElementById('fc-word').textContent=v.word;
  document.getElementById('fc-pos').textContent=v.pos;
  document.getElementById('fc-ipa').textContent=getIPA(v.word);
  document.getElementById('fc-def').textContent=v.definition;
  document.getElementById('fc-vi').textContent='🇻🇳 '+v.vietnamese;
  document.getElementById('fc-ex').textContent=v.example;
  document.getElementById('fc-cnt').textContent=`${fcI+1} / ${fcL.length}`;
  document.getElementById('fc-bar').style.width=((fcI+1)/fcL.length*100)+'%';
  document.getElementById('fc-card').classList.remove('flipped');
}
function flipCard(){document.getElementById('fc-card').classList.toggle('flipped');}
function fcNext(){fcI=(fcI+1)%fcL.length;renderFC();}
function fcPrev(){fcI=(fcI-1+fcL.length)%fcL.length;renderFC();}
function shuffleFC(){fcL=[...V];for(let i=fcL.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[fcL[i],fcL[j]]=[fcL[j],fcL[i]];}fcI=0;renderFC();}

/* ======================== FILL BLANK ======================== */
function renderFB2(){
  document.getElementById('fb-ctn').innerHTML=FB.map((q,i)=>{
    const p=q.sentence.split('___');
    return `<div class="card" id="fb-${i}"><div class="qn">${i+1}. <span style="font-size:.78rem;color:var(--vi)">(${q.hint})</span></div>
    <div class="qtx">${p[0]}<input class="bi" id="fbi-${i}" autocomplete="off" spellcheck="false">${p[1]||''}</div>
    <div class="exp" id="fbe-${i}"></div></div>`;
  }).join('');document.getElementById('fb-sc').textContent='';
}
function checkFB(){
  let sc=0;FB.forEach((q,i)=>{
    const inp=document.getElementById(`fbi-${i}`),c=document.getElementById(`fb-${i}`),e=document.getElementById(`fbe-${i}`);
    const v=inp.value.trim().toLowerCase().replace(/[-\s]+/g,' '),a=q.answer.toLowerCase().replace(/[-\s]+/g,' ');
    const ok=v===a;if(ok)sc++;inp.disabled=true;inp.classList.add(ok?'ci':'wi');c.classList.add(ok?'correct':'wrong');
    e.innerHTML=ok?'✅ Correct!':`❌ Answer: <strong>${q.answer}</strong>`;e.classList.add('show',ok?'ce':'we');
  });
  document.getElementById('fb-sc').innerHTML=`<span class="sc">${sc}</span> / ${FB.length} correct`;
  document.getElementById('fbc').style.display='none';document.getElementById('fbr').style.display='inline-block';
}
function resetFB(){renderFB2();document.getElementById('fbc').style.display='inline-block';document.getElementById('fbr').style.display='none';}

/* ======================== MATCH ======================== */
let mP=[],mSel=null,mC=0;
function renderMatch(){
  if(!V.length)return;
  const sh=[...V].sort(()=>Math.random()-.5).slice(0,6);
  mP=sh.map((v,i)=>({id:i,word:v.word,vietnamese:v.vietnamese}));mC=0;mSel=null;
  const L=[...mP].sort(()=>Math.random()-.5),R=[...mP].sort(()=>Math.random()-.5);
  const g=document.getElementById('m-grid');g.innerHTML='';
  L.forEach(p=>{const e=document.createElement('div');e.className='mi';e.dataset.id=p.id;e.dataset.side='l';e.textContent=p.word;e.onclick=()=>hMatch(e);g.appendChild(e);});
  R.forEach(p=>{const e=document.createElement('div');e.className='mi';e.dataset.id=p.id;e.dataset.side='r';e.textContent=p.vietnamese;e.onclick=()=>hMatch(e);g.appendChild(e);});
  document.getElementById('m-sc').textContent='';
}
function hMatch(el){
  if(el.classList.contains('matched'))return;
  if(!mSel){document.querySelectorAll('.mi').forEach(e=>e.classList.remove('sm'));el.classList.add('sm');mSel=el;return;}
  if(el===mSel||el.dataset.side===mSel.dataset.side){document.querySelectorAll('.mi').forEach(e=>e.classList.remove('sm'));el.classList.add('sm');mSel=el;return;}
  if(el.dataset.id===mSel.dataset.id){el.classList.add('matched');el.classList.remove('sm');mSel.classList.add('matched');mSel.classList.remove('sm');mC++;
    if(mC===mP.length)document.getElementById('m-sc').innerHTML='<span class="sc">🎉 Complete!</span>';mSel=null;
  }else{el.classList.add('wf');mSel.classList.add('wf');const s=mSel;
    setTimeout(()=>{el.classList.remove('wf','sm');s.classList.remove('wf','sm');mSel=null;},500);
  }
}
function resetMatch(){renderMatch();}
