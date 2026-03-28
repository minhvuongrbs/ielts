/* ======================== LISTENING LESSON — SHARED JS ======================== */
/* Requires: shared/lesson.js loaded first, CAT_LABELS set by lesson page */

/* ======================== UTILITIES ======================== */
function normalize(s){return s.trim().toLowerCase().replace(/[\s]+/g,' ');}

/* ======================== HTML TEMPLATE ======================== */
function renderListeningPage(cfg){
  /* cfg: { title, sub, guideWhat, phrasesIntro, practiceTab:{audioSrc}, visualTab:bool } */

  let secondTab = '';
  let secondPane = '';

  if(cfg.practiceTab){
    secondTab = `<button class="tab-btn" data-tab="practice">📋 Practice</button>`;
    secondPane = `
      <div id="practice" class="tp">
        <div class="audio-card">
          <div class="label">🔊 Listen to the audio</div>
          <audio controls src="${cfg.practiceTab.audioSrc}" style="flex:1;min-width:200px"></audio>
        </div>
        <div id="practice-content"></div>
        <div class="practice-score" id="practice-score"></div>
        <div class="ctrls">
          <button class="btn bp" id="pcheck" onclick="checkPractice()">Check Answers</button>
          <button class="btn bs" id="preset" onclick="resetPractice()" style="display:none">Try Again</button>
        </div>
      </div>`;
  } else if(cfg.visualTab){
    secondTab = `<button class="tab-btn" data-tab="visual">🗺️ Visual</button>`;
    secondPane = `
      <div id="visual" class="tp">
        <p style="text-align:center;color:#8a7a66;margin-bottom:16px;font-size:.9rem">Tap a card to see the Vietnamese meaning and example sentence.</p>
        <div class="vv-grid" id="vv-grid"></div>
      </div>`;
  }

  document.getElementById('app').innerHTML = `
  <div class="container">
    <header>
      <h1>${cfg.title}</h1>
      <div class="sub">${cfg.sub}</div>
    </header>

    <div class="tabs">
      <button class="tab-btn active" data-tab="guide">📖 Guide</button>
      ${secondTab}
      <button class="tab-btn" data-tab="vocab">📝 Vocab</button>
      <button class="tab-btn" data-tab="phrases">💬 Phrases</button>
      <button class="tab-btn" data-tab="quiz">❓ Quiz</button>
    </div>

    <div id="guide" class="tp active">
      <div class="card"><div class="guide-title">📋 What is ${cfg.guideWhat||'this question type'}?</div><p id="guide-desc" style="font-size:.92rem;margin-bottom:16px"></p></div>
      <div class="card"><div class="guide-title">📝 Exam Format</div><ul class="guide-list" id="guide-format"></ul></div>
      <div class="card"><div class="guide-title">💡 Tips & Strategies</div><div id="guide-tips"></div></div>
    </div>

    ${secondPane}

    <div id="vocab" class="tp">
      <div class="vf" id="vocab-filter"></div>
      <div class="vg" id="vocab-grid"></div>
    </div>

    <div id="phrases" class="tp">
      <p style="text-align:center;color:#8a7a66;margin-bottom:16px;font-size:.9rem">${cfg.phrasesIntro||'Useful phrases from this lesson that you can reuse in IELTS Writing & Speaking.'}</p>
      <div class="ph-grid" id="phrases-grid"></div>
    </div>

    <div id="quiz" class="tp">
      <div class="stabs">
        <button class="stab active" data-sub="flashcard">🃏 Flashcard</button>
        <button class="stab" data-sub="fillblank">✏️ Fill in Blank</button>
        <button class="stab" data-sub="match">🔗 Matching</button>
      </div>
      <div id="flashcard" class="sp active">
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
  </div>`;

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

/* ======================== INIT LISTENING ======================== */
function initListening(data){
  INTRO = data.intro;
  V = data.vocabulary;
  UP = (data.usefulPhrases||[]).map(p=>({...p, cat: p.cat || p.section}));
  FB = data.fillBlanks || [];

  renderGuide();
  renderVF(); renderVocab();
  renderPhrases();
  renderFC(); renderFB2(); renderMatch();

  Promise.all(V.map(v=>fetchIPA(v.w))).then(()=>{renderVocab();renderFC();});
}
