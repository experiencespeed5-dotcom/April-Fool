/* ═══════════════════════════════════════════
   AI Personality Analyzer — script.js
   ═══════════════════════════════════════════ */

/* ── Shared state ── */
let userData = { name: '', personality: '', strengths: '', weaknesses: [] };

/* Selected weakness chips */
const selectedWeaknesses = new Set();
let otherWeaknessText = '';

/* ══════════════════════════════════════
   CHIP TOGGLE (for the 4 fixed chips)
══════════════════════════════════════ */
function toggleChip(el, value) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    selectedWeaknesses.add(value);
  } else {
    selectedWeaknesses.delete(value);
  }
}

/* ══════════════════════════════════════
   OTHER CHIP TOGGLE
══════════════════════════════════════ */
function toggleOther(el) {
  el.classList.toggle('selected');
  const otherBox = document.getElementById('other-box');

  if (el.classList.contains('selected')) {
    otherBox.classList.remove('hidden');
    document.getElementById('other-weakness').focus();
  } else {
    otherBox.classList.add('hidden');
    document.getElementById('other-weakness').value = '';
    otherWeaknessText = '';
    selectedWeaknesses.delete('__other__');
  }
}

/* ── Keep "Other" value in sync ── */
function syncOtherChip() {
  otherWeaknessText = document.getElementById('other-weakness').value.trim();
  if (otherWeaknessText) {
    selectedWeaknesses.add('__other__');
  } else {
    selectedWeaknesses.delete('__other__');
  }
}

/* ══════════════════════════════════════
   PAGE 1 → 2  |  Start Analysis
══════════════════════════════════════ */
function startAnalysis() {
  const name        = document.getElementById('name').value.trim();
  const personality = document.getElementById('personality').value;
  const strengths   = document.getElementById('strengths').value.trim();

  if (!name)        { shake('name');        return; }
  if (!personality) { shake('personality'); return; }
  if (!strengths)   { shake('strengths');   return; }

  /* Build final weaknesses array */
  const weaknesses = [];
  selectedWeaknesses.forEach(w => {
    if (w === '__other__') {
      if (otherWeaknessText) weaknesses.push(otherWeaknessText);
    } else {
      weaknesses.push(w);
    }
  });

  userData = { name, personality, strengths, weaknesses };

  transitionTo('page-1', 'page-2');
  runLoadingSequence();
}

/* ══════════════════════════════════════
   Fake Loading Sequence (3 steps)
══════════════════════════════════════ */
function runLoadingSequence() {
  const stepIds    = ['step-1', 'step-2', 'step-3'];
  const labels     = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights'
  ];
  const activateAt = [0, 900, 1900];
  const doneAt     = [800, 1800, 2700];
  const showAt     = 3100;

  stepIds.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) document.getElementById(stepIds[i - 1]).classList.remove('active');
      document.getElementById(id).classList.add('active');
    }, activateAt[i]);

    setTimeout(() => {
      const el = document.getElementById(id);
      el.classList.remove('active');
      el.classList.add('done');
      el.textContent = '✔ ' + labels[i].replace(/^[^\s]+\s/, '');
    }, doneAt[i]);
  });

  setTimeout(showResult, showAt);
}

/* ══════════════════════════════════════
   Populate & Reveal Results
══════════════════════════════════════ */
function showResult() {
  /* Avatar & header */
  document.getElementById('avatar-initial').textContent =
    userData.name.charAt(0).toUpperCase();
  document.getElementById('result-name').textContent        = userData.name;
  document.getElementById('result-personality').textContent = userData.personality;

  /* Strengths list */
  const sList = document.getElementById('strengths-list');
  sList.innerHTML = '';
  const sItems = userData.strengths.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  sItems.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.animationDelay = `${i * 0.13}s`;
    sList.appendChild(li);
  });
  /* Funny fixed strength */
  const funnyLi = document.createElement('li');
  funnyLi.textContent = 'Hmmm, after 2 hours of overthinking 💬';
  funnyLi.style.animationDelay = `${sItems.length * 0.13}s`;
  sList.appendChild(funnyLi);

  /* Weaknesses list */
  const wList = document.getElementById('weakness-list');
  wList.innerHTML = '';

  /* If user picked weaknesses, show them; else show defaults */
  const weaknessesToShow = userData.weaknesses.length > 0
    ? userData.weaknesses
    : ['Falls for mask girl / cute voice 😏', 'Overthinks at 3 AM 🌙', 'Says "I\'m fine" but clearly not 💀'];

  weaknessesToShow.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.animationDelay = `${i * 0.13}s`;
    wList.appendChild(li);
  });

  /* Swap loading ↔ result */
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('result-state').classList.remove('hidden');

  /* Animate confidence bar */
  setTimeout(() => {
    document.querySelector('.confidence-fill').style.width = '94%';
  }, 300);
}

/* ══════════════════════════════════════
   PAGE 2 → 3  |  Show Prank Screen
══════════════════════════════════════ */
function showReport() {
  transitionTo('page-2', 'page-3');

  setTimeout(() => {
    document.getElementById('prank-footer').classList.remove('hidden');
  }, 400);

  setTimeout(() => {
    document.getElementById('popup-overlay').classList.remove('hidden');
  }, 600);

  setTimeout(launchConfetti, 300);
}

/* ══════════════════════════════════════
   Close Popup → scroll to footer
══════════════════════════════════════ */
function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay.style.animation = 'fadeOverlayOut 0.3s ease forwards';
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.style.animation = '';
    document.getElementById('prank-footer').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 280);
}

/* ══════════════════════════════════════
   Restart — reset everything → page 1
══════════════════════════════════════ */
function restart() {
  /* Clear form */
  document.getElementById('name').value        = '';
  document.getElementById('personality').value = '';
  document.getElementById('strengths').value   = '';

  /* Reset chips */
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  selectedWeaknesses.clear();
  otherWeaknessText = '';
  document.getElementById('other-box').classList.add('hidden');
  document.getElementById('other-weakness').value = '';

  /* Reset loading steps */
  const labels = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights'
  ];
  ['step-1', 'step-2', 'step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = 'step';
    el.textContent = labels[i];
  });
  document.getElementById('step-1').classList.add('active');

  document.querySelector('.confidence-fill').style.width = '0%';
  document.getElementById('loading-state').classList.remove('hidden');
  document.getElementById('result-state').classList.add('hidden');
  document.getElementById('confetti').innerHTML = '';
  document.getElementById('prank-footer').classList.add('hidden');
  document.getElementById('popup-overlay').classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  transitionTo('page-3', 'page-1');
}

/* ══════════════════════════════════════
   Smooth Page Transition
══════════════════════════════════════ */
function transitionTo(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  from.style.animation = 'cardOut 0.3s cubic-bezier(0.22,1,0.36,1) forwards';
  setTimeout(() => {
    from.classList.add('hidden');
    from.style.animation = '';
    to.classList.remove('hidden');
    to.style.animation = 'cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both';
  }, 290);
}

/* ══════════════════════════════════════
   Shake on Validation Error
══════════════════════════════════════ */
function shake(fieldId) {
  const el = document.getElementById(fieldId);
  el.classList.remove('shake-anim');
  void el.offsetWidth;
  el.classList.add('shake-anim');
  el.addEventListener('animationend', () => el.classList.remove('shake-anim'), { once: true });
  el.focus();
}

/* ══════════════════════════════════════
   Confetti (2 waves)
══════════════════════════════════════ */
function launchConfetti() {
  spawnConfetti(65, 0);
  setTimeout(() => spawnConfetti(45, 0), 900);
}
function spawnConfetti(count, baseDelay) {
  const wrap   = document.getElementById('confetti');
  const colors = ['#a78bfa','#f472b6','#34d399','#fbbf24','#60a5fa','#fb923c','#f87171'];
  for (let i = 0; i < count; i++) {
    const piece    = document.createElement('div');
    piece.className = 'confetti-piece';
    const size     = Math.random() * 9 + 5;
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const left     = Math.random() * 100;
    const delay    = baseDelay + Math.random() * 1.4;
    const dur      = Math.random() * 2 + 2.2;
    const isCircle = Math.random() > 0.55;
    piece.style.cssText = `
      width:${size}px; height:${size}px; background:${color};
      left:${left}%; top:-10px;
      border-radius:${isCircle ? '50%' : '3px'};
      animation-duration:${dur}s; animation-delay:${delay}s; opacity:0;
    `;
    piece.addEventListener('animationstart', () => { piece.style.opacity = '1'; }, { once: true });
    wrap.appendChild(piece);
  }
}
