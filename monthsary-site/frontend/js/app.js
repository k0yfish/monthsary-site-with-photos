/* ===== helpers ===== */
const fill = s => s.replaceAll("{name}", CONFIG.name).replaceAll("{month}", CONFIG.month);
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nl2br = s => s.replace(/\n/g,'<br>');

/* ===== hero ===== */
document.getElementById('heroHeading').textContent = fill(`Happy ${CONFIG.month} Monthsary, ${CONFIG.name}!`);
document.getElementById('heroTagline').textContent = CONFIG.heroTagline;
document.getElementById('ctaBtn').textContent = CONFIG.ctaLabel;

/* ===== floating hearts ===== */
const heartsEl = document.getElementById('hearts');
for (let i = 0; i < 14; i++) {
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = '❤';
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = (12 + Math.random() * 18) + 'px';
  h.style.animationDuration = (8 + Math.random() * 10) + 's';
  h.style.animationDelay = (Math.random() * 10) + 's';
  heartsEl.appendChild(h);
}

/* ===== countdown ticker ===== */
const since = new Date(CONFIG.since).getTime();
const tickerEl = document.getElementById('ticker');
function renderTicker(){
  const diff = Math.max(0, Date.now() - since);
  const s = Math.floor(diff/1000), m = Math.floor(s/60), h = Math.floor(m/60), d = Math.floor(h/24);
  const units = [[d,'days'],[h%24,'hours'],[m%60,'minutes'],[s%60,'seconds']];
  tickerEl.innerHTML = units.map(([v,l]) => `<div class="tunit"><span class="tnum">${v}</span><span class="tlabel">${l}</span></div>`).join('');
}
renderTicker();
setInterval(renderTicker, 1000);

/* ===== letter ===== */
document.getElementById('page1').innerHTML = CONFIG.letterPage1.map(p => `<p>${nl2br(esc(fill(p)))}</p>`).join('');
document.getElementById('page2').innerHTML = CONFIG.letterPage2.map(p => `<p>${nl2br(esc(fill(p)))}</p>`).join('');
const letterInner = document.getElementById('letterInner');
const prevBtn = document.getElementById('prevBtn'), nextBtn = document.getElementById('nextBtn');
function syncLetterBtns(){
  const flipped = letterInner.classList.contains('flipped');
  prevBtn.disabled = !flipped; nextBtn.disabled = flipped;
}
nextBtn.addEventListener('click', () => { letterInner.classList.add('flipped'); syncLetterBtns(); });
prevBtn.addEventListener('click', () => { letterInner.classList.remove('flipped'); syncLetterBtns(); });
syncLetterBtns();

/* ===== gallery ===== */
document.getElementById('galleryGrid').innerHTML = CONFIG.gallery.map((item, i) => `
  <div class="photo">
    ${item.image
      ? `<img src="${item.image}" alt="${esc(item.caption||'')}">`
      : `<div class="ph" style="background:linear-gradient(135deg,hsl(${340+i*6} 55% 88%),hsl(${350+i*6} 45% 78%))">🤍</div>`}
    ${item.caption ? `<div class="cap">${esc(item.caption)}</div>` : ''}
  </div>`).join('');

/* ===== notes / guestbook — now backed by the MySQL API instead of localStorage ===== */
const noteForm = document.getElementById('noteForm');
const notesListEl = document.getElementById('notesList');

function renderNotes(notes){
  notesListEl.innerHTML = notes.length ? notes.map(n => `
    <div class="note">
      <div class="note-head"><span>${esc(n.name || 'Anonymous love')}</span><span>${new Date(n.created_at).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}</span></div>
      <p>${nl2br(esc(n.message))}</p>
    </div>`).join('') : '<p class="notes-empty">No notes yet — be the first to leave one 💌</p>';
}

async function loadNotes(){
  notesListEl.innerHTML = '<p class="notes-empty">Loading notes…</p>';
  try {
    const res = await fetch(`${API_BASE_URL}/notes`);
    if (!res.ok) throw new Error('Request failed');
    renderNotes(await res.json());
  } catch (err) {
    console.error(err);
    notesListEl.innerHTML = '<p class="notes-empty">Couldn\'t reach the server — is the backend running?</p>';
  }
}

noteForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('noteName').value.trim();
  const text = document.getElementById('noteText').value.trim();
  if (!text) return;

  const submitBtn = noteForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  try {
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message: text })
    });
    if (!res.ok) throw new Error('Request failed');
    noteForm.reset();
    await loadNotes();
  } catch (err) {
    console.error(err);
    alert("Sorry, that note couldn't be sent — please try again.");
  } finally {
    submitBtn.disabled = false;
  }
});

loadNotes();
