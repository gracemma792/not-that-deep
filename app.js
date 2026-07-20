const $ = (s) => document.querySelector(s);
const verdicts = {
  general: [
    ['Insufficient grounds for a spiral.', 'After review, this matter has been classified as mildly irritating at most. You are released from further analysis.'],
    ['This has been noted. It has not been elevated.', 'The committee agrees it was a bit strange. The committee also agrees it does not require a response, a subtweet, or a debrief.'],
    ['A normal amount of weirdness has occurred.', 'This finding does not reflect on your character, their character, or the future of civilisation. Please resume your day.'],
    ['The file is being closed for lack of consequence.', 'A brief internal eye-roll has been approved. All further emotional expenditure is declined.']
  ],
  guy: [
    ['Respectfully: he is just a guy.', 'The file does not support reallocating your whole day to a man who may simply be a bit confusing.'],
    ['The gentleman has been assessed.', 'His behaviour may be puzzling. It does not require you to become an unpaid detective in your own life.'],
    ['No emergency meeting about him is required.', 'A guy has done something mildly guy-like. The committee recommends returning your attention to more valuable assets.']
  ],
  girl: [
    ['Respectfully: she is just a girl.', 'The energy may have been unusual. This does not require an internal tribunal or a rewrite of your whole friendship history.'],
    ['The situation has been reviewed.', 'Her tone may have landed oddly. You are permitted to let it be odd without making it your full-time assignment.']
  ],
  friend: [
    ['A friendship administrative matter has been logged.', 'It can wait until everyone is operating at normal emotional capacity. No group-chat forensics are needed today.'],
    ['The friendship is not on trial tonight.', 'One small weird moment is not a complete character reference. Put the file down for now.']
  ],
  internet: [
    ['An internet interaction has occurred.', 'Its jurisdiction ends at the screen. You are not required to carry it into the rest of your actual life.'],
    ['The algorithm will not be receiving your evening.', 'A comment, view, or like has been deemed too flimsy to rent space in your brain.']
  ]
};
const closes = ['You gave it a little less of the whole room. That counts.', 'The feeling was real. You do not have to solve it all from inside the feeling.', 'Nothing needed to be proven just now. You made a little space.'];
const categories = ['Things that are blue', 'Movies you could watch again', 'Things that grow in a garden', 'Cities you know', 'Things with wheels', 'Foods you would order at a café'];
let selected = 'breathing', breathTimer, breathIn = true, categoryIndex = 0, resetTimer;

document.querySelectorAll('.mode').forEach((button) => button.addEventListener('click', () => {
  const mode = button.dataset.mode;
  document.body.dataset.mode = mode;
  document.querySelectorAll('.mode').forEach((b) => b.classList.toggle('active', b === button));
  $('#dismiss-panel').classList.toggle('hidden', mode !== 'dismiss');
  $('#reset-panel').classList.toggle('hidden', mode !== 'reset');
  clearInterval(breathTimer); clearInterval(resetTimer);
}));

$('#incident').addEventListener('input', (e) => { $('#count').textContent = e.target.value.length; });
$('#rule-button').addEventListener('click', issueRuling);
function getVerdictGroup(text) {
  if (/\b(guy|him|he|boyfriend|ex)\b/i.test(text)) return 'guy';
  if (/\b(girl|her|she|girlfriend)\b/i.test(text)) return 'girl';
  if (/\b(friend|bestie|group chat|mate)\b/i.test(text)) return 'friend';
  if (/\b(comment|reel|tiktok|instagram|post|like|dm)\b/i.test(text)) return 'internet';
  return 'general';
}
function issueRuling() {
  const group = getVerdictGroup($('#incident').value);
  const picks = verdicts[group];
  const pick = picks[Math.floor(Math.random() * picks.length)];
  $('#ruling-title').textContent = pick[0]; $('#ruling-copy').textContent = pick[1];
  $('#case-number').textContent = `NTD–${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
  $('#ruling').classList.remove('hidden'); $('#ruling').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
$('#share-ruling').addEventListener('click', async () => { const text = `NOT THAT DEEP — ${$('#ruling-title').textContent}\n${$('#ruling-copy').textContent}`; try { if (navigator.share) await navigator.share({ title: 'Official ruling', text }); else { await navigator.clipboard.writeText(text); $('#share-ruling').textContent = 'Copied'; setTimeout(() => $('#share-ruling').textContent = 'Share ruling', 1400); } } catch {} });
$('#download-ruling').addEventListener('click', () => { const c = document.createElement('canvas'), x = c.getContext('2d'); c.width = 1080; c.height = 1080; x.fillStyle = '#fffef9'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = '#17201b'; x.lineWidth = 5; x.strokeRect(38, 38, 1004, 1004); x.fillStyle = '#17201b'; x.font = '28px monospace'; x.fillText('OFFICE OF PROPORTION & PERSPECTIVE', 85, 120); x.font = 'bold 66px sans-serif'; wrap(x, $('#ruling-title').textContent, 85, 230, 850, 78); x.font = '32px sans-serif'; wrap(x, $('#ruling-copy').textContent, 85, 500, 820, 46); const a = document.createElement('a'); a.download = 'not-that-deep-ruling.png'; a.href = c.toDataURL('image/png'); a.click(); });
function wrap(x, text, left, top, width, line) { let row = '', y = top; for (const word of text.split(' ')) { const test = `${row}${word} `; if (x.measureText(test).width > width && row) { x.fillText(row, left, y); row = `${word} `; y += line; } else row = test; } x.fillText(row, left, y); }

$('#spiral').addEventListener('input', (e) => { const value = e.target.value.trim(); $('#lilypad-text').textContent = value || 'A thought can pass through.'; });
$('#release-button').addEventListener('click', () => { const scene = $('#release-scene'); scene.classList.remove('released'); void scene.offsetWidth; scene.classList.add('released'); $('#release-caption').textContent = 'It can be here without being held.'; });
document.querySelectorAll('.technique').forEach((b) => b.addEventListener('click', () => { selected = b.dataset.technique; document.querySelectorAll('.technique').forEach((x) => x.classList.toggle('selected', x === b)); }));
$('#surprise-me').addEventListener('click', () => { const buttons = [...document.querySelectorAll('.technique')]; const chosen = buttons[Math.floor(Math.random() * buttons.length)]; chosen.click(); $('#start-reset').textContent = `Let’s try ${chosen.querySelector('b').textContent.toLowerCase()} →`; });
$('#start-reset').addEventListener('click', showExercise);
$('#choose-another').addEventListener('click', () => { $('#exercise').classList.add('hidden'); $('#close-message').classList.add('hidden'); clearInterval(breathTimer); clearInterval(resetTimer); window.scrollTo({ top: 0, behavior: 'smooth' }); });

function showExercise() {
  clearInterval(breathTimer); clearInterval(resetTimer); $('#exercise').classList.remove('hidden'); $('#close-message').classList.add('hidden');
  const content = $('#exercise-content'), type = $('#exercise-type');
  const items = {
    breathing: ['PACED BREATHING', '<h2>Let the out-breath be longer.</h2><p>In gently for 4. Out slowly for 6. There is no prize for doing it perfectly.</p><div class="breathing-pacer inhale" id="pacer"><span id="breath-word">Breathe in</span></div><p class="center-note">Follow the circle for four rounds.</p><button class="exercise-action" id="finish-exercise">I’ve done a few rounds</button>'],
    senses: ['5–4–3–2–1 SENSES', '<h2>Come back through your senses.</h2><p>Tap each one after you’ve found it. There’s no need to make it profound.</p><ol class="sensory-list interactive-list"><li><button data-sense><b>5</b><span>things you can see</span><i>○</i></button></li><li><button data-sense><b>4</b><span>things you can feel</span><i>○</i></button></li><li><button data-sense><b>3</b><span>things you can hear</span><i>○</i></button></li><li><button data-sense><b>2</b><span>things you can smell</span><i>○</i></button></li><li><button data-sense><b>1</b><span>thing you can taste</span><i>○</i></button></li></ol><button class="exercise-action" id="finish-exercise">I’m back in the room</button>'],
    defusion: ['A LITTLE DISTANCE', '<h2>Put the thought on the table.</h2><p>You don’t have to agree with it or push it away. Just give it a little space.</p><div class="prompt-card"><p>Is this a fact, or a feeling I’m having right now?</p></div><div class="prompt-card"><p>What would I say to a friend in this exact moment?</p></div><button class="exercise-action" id="finish-exercise">That’s enough for now</button>'],
    category: ['NAME TEN THINGS', '<h2>Give your mind a small, harmless job.</h2><p>Name ten things in this category. Slow is fine. Strange answers are welcome.</p><div class="prompt-card"><p class="category-word" id="category-word">Things you would pack for a road trip</p></div><div class="ten-dots" id="ten-dots">○ ○ ○ ○ ○ ○ ○ ○ ○ ○</div><button class="exercise-action" id="count-one">I thought of one</button><button class="exercise-action" id="new-category">Give me another category</button><button class="exercise-action" id="finish-exercise">I’ve got ten</button>'],
    reset60: ['RESET 60', '<h2>Just one minute.</h2><p>For 60 seconds, put both feet on the floor and notice the next exhale. The clock can hold the time for you.</p><div class="minute-timer" id="minute-timer"><b>1:00</b><span>until this tiny reset is done</span></div><button class="exercise-action" id="start-timer">Start the minute</button><button class="exercise-action" id="finish-exercise">I’m ready to stop</button>']
  };
  type.textContent = items[selected][0]; content.innerHTML = items[selected][1]; $('#exercise').scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (selected === 'breathing') startBreathing();
  $('#finish-exercise')?.addEventListener('click', finish);
  $('#new-category')?.addEventListener('click', newCategory);
  $('#count-one')?.addEventListener('click', markDot);
  $('#start-timer')?.addEventListener('click', startMinute);
  document.querySelectorAll('[data-sense]').forEach((b) => b.addEventListener('click', () => { b.classList.toggle('done'); b.querySelector('i').textContent = b.classList.contains('done') ? '✓' : '○'; }));
}
function startBreathing() { const p = $('#pacer'), w = $('#breath-word'); breathIn = true; breathTimer = setInterval(() => { breathIn = !breathIn; p.classList.toggle('inhale', breathIn); w.textContent = breathIn ? 'Breathe in' : 'Breathe out'; }, 4000); }
function finish() { clearInterval(breathTimer); clearInterval(resetTimer); $('#close-copy').textContent = closes[Math.floor(Math.random() * closes.length)]; $('#close-message').classList.remove('hidden'); $('#close-message').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
function newCategory() { categoryIndex = (categoryIndex + 1) % categories.length; $('#category-word').textContent = categories[categoryIndex]; }
function markDot() { const dots = $('#ten-dots'); const n = (dots.dataset.count ? Number(dots.dataset.count) : 0) + 1; dots.dataset.count = n; dots.textContent = Array.from({ length: 10 }, (_, i) => i < n ? '●' : '○').join(' '); if (n >= 10) $('#count-one').textContent = 'Ten done ✓'; }
function startMinute() { let seconds = 60; const timer = $('#minute-timer'), button = $('#start-timer'); button.disabled = true; button.textContent = 'Keep going…'; resetTimer = setInterval(() => { seconds--; timer.querySelector('b').textContent = `0:${String(seconds).padStart(2, '0')}`; if (seconds <= 0) { clearInterval(resetTimer); timer.querySelector('b').textContent = 'Done'; timer.querySelector('span').textContent = 'You made a little room.'; button.textContent = 'One minute, complete ✓'; } }, 1000); }
