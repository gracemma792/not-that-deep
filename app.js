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
const rRatedOutcomes = [
  ['Please find someone who gives a fuck.', 'The undersigned has reviewed the situation and has no further emotional resources to allocate.'],
  ['I have officially run out of fucks to give.', 'Any remaining stock has been reserved for matters with actual consequences.'],
  ['This has exceeded its allotted attention.', 'Further messages may be received, noted, and left entirely unanswered.'],
  ['Please redirect this to someone more available.', 'The person you are looking for is not me, and they are probably tired too.'],
  ['Your urgency has been declined.', 'There is no emergency here. There is only a person who has made themselves very tiring.'],
  ['The last fuck has left the building.', 'It did not leave a forwarding address, and nobody is chasing it.'],
  ['This is no longer my business.', 'It has been returned to sender with absolutely no note attached.'],
  ['Kindly take this elsewhere.', 'Preferably somewhere with less access to my peace, time, and very last nerve.'],
  ['You have mistaken access for entitlement.', 'That confusion has been corrected. Best of luck with the adjustment.'],
  ['The answer is: absolutely not.', 'The question has been archived before it could become a conversation.']
];
const categories = ['Things that are blue', 'Movies you could watch again', 'Things that grow in a garden', 'Cities you know', 'Things with wheels', 'Foods you would order at a café'];
let selected = 'breathing', breathTimer, breathIn = true, categoryIndex = 0, resetTimer;

const hour = new Date().getHours();
$('#time-of-day').textContent = hour < 5 ? 'being awake for?' : hour < 12 ? 'your morning?' : hour < 18 ? 'your afternoon?' : hour < 23 ? 'your evening?' : 'being awake for?';

document.querySelectorAll('.mode').forEach((button) => button.addEventListener('click', () => {
  const mode = button.dataset.mode;
  document.body.dataset.mode = mode;
  document.querySelectorAll('.mode').forEach((b) => b.classList.toggle('active', b === button));
  $('#dismiss-panel').classList.toggle('hidden', mode !== 'dismiss');
  $('#reset-panel').classList.toggle('hidden', mode !== 'reset');
  $('#emergency-panel').classList.toggle('hidden', mode !== 'emergency');
  clearInterval(breathTimer); clearInterval(resetTimer);
}));

$('#incident').addEventListener('input', (e) => { $('#count').textContent = e.target.value.length; });
$('#rule-button').addEventListener('click', issueRuling);
function getVerdictGroup(text) {
  // Specific relationship words come first; this prevents “my friend and her birthday” becoming a girl ruling.
  if (/\b(friend|bestie|group chat|mate|roommate|coworker|colleague)\b/i.test(text)) return 'friend';
  if (/\b(girlfriend|wife|partner|date|crush|situationship|boyfriend|husband)\b/i.test(text)) return /\b(girlfriend|wife)\b/i.test(text) ? 'girl' : 'guy';
  if (/\b(guy|him|he)\b/i.test(text)) return 'guy';
  if (/\b(girl|her|she)\b/i.test(text)) return 'girl';
  if (/\b(comment|reel|tiktok|instagram|post|like|dm)\b/i.test(text)) return 'internet';
  return 'general';
}
function issueRuling() {
  const group = getVerdictGroup($('#incident').value);
  const picks = verdicts[group];
  const pick = picks[Math.floor(Math.random() * picks.length)];
  $('#ruling-title').textContent = pick[0]; $('#ruling-copy').textContent = pick[1];
  $('#case-number').textContent = `NTD–${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
  $('#r-rated').classList.add('hidden'); $('#ruling').classList.remove('hidden'); $('#ruling').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
$('#share-ruling').addEventListener('click', async () => { const text = `NOT THAT DEEP — ${$('#ruling-title').textContent}\n${$('#ruling-copy').textContent}`; try { if (navigator.share) await navigator.share({ title: 'Official ruling', text }); else { await navigator.clipboard.writeText(text); $('#share-ruling').textContent = 'Copied'; setTimeout(() => $('#share-ruling').textContent = 'Share ruling', 1400); } } catch {} });
$('#download-ruling').addEventListener('click', () => { const c = document.createElement('canvas'), x = c.getContext('2d'); c.width = 1080; c.height = 1080; x.fillStyle = '#fffef9'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = '#17201b'; x.lineWidth = 5; x.strokeRect(38, 38, 1004, 1004); x.fillStyle = '#17201b'; x.font = '28px monospace'; x.fillText('OFFICE OF PROPORTION & PERSPECTIVE', 85, 120); x.font = 'bold 66px sans-serif'; wrap(x, $('#ruling-title').textContent, 85, 230, 850, 78); x.font = '32px sans-serif'; wrap(x, $('#ruling-copy').textContent, 85, 500, 820, 46); const a = document.createElement('a'); a.download = 'not-that-deep-ruling.png'; a.href = c.toDataURL('image/png'); a.click(); });
function wrap(x, text, left, top, width, line) { let row = '', y = top; for (const word of text.split(' ')) { const test = `${row}${word} `; if (x.measureText(test).width > width && row) { x.fillText(row, left, y); row = `${word} `; y += line; } else row = test; } x.fillText(row, left, y); }

$('#r-rated-button').addEventListener('click', () => { const pick = rRatedOutcomes[Math.floor(Math.random() * rRatedOutcomes.length)]; $('#rr-title').textContent = pick[0]; $('#rr-detail').textContent = pick[1]; $('#rr-number').textContent = `RR–${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`; $('#r-rated').classList.remove('hidden'); $('#r-rated').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
function rRatedText() { return `FINAL NOTICE\n${$('#rr-title').textContent}\n${$('#rr-detail').textContent}`; }
$('#share-rr').addEventListener('click', async () => { try { if (navigator.share) await navigator.share({ title: 'Final notice', text: rRatedText() }); else { await navigator.clipboard.writeText(rRatedText()); $('#share-rr').textContent = 'Copied'; setTimeout(() => $('#share-rr').textContent = 'Send outcome', 1400); } } catch {} });
$('#download-rr').addEventListener('click', () => { const c = document.createElement('canvas'), x = c.getContext('2d'); c.width = 1080; c.height = 1080; x.fillStyle = '#fbf2e4'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = '#b63129'; x.lineWidth = 8; x.strokeRect(38, 38, 1004, 1004); x.fillStyle = '#8e251e'; x.font = '28px monospace'; x.fillText('FINAL NOTICE — PERSONAL DELIVERY', 85, 120); x.fillStyle = '#17201b'; x.font = 'bold 68px sans-serif'; wrap(x, $('#rr-title').textContent, 85, 245, 830, 80); x.font = '32px sans-serif'; wrap(x, $('#rr-detail').textContent, 85, 530, 820, 48); x.strokeStyle = '#b63129'; x.lineWidth = 10; x.beginPath(); x.arc(855, 815, 86, 0, Math.PI * 2); x.stroke(); x.fillStyle = '#b63129'; x.font = 'bold 30px monospace'; x.fillText('SERVED', 795, 825); const a = document.createElement('a'); a.download = 'served-notice.png'; a.href = c.toDataURL('image/png'); a.click(); });

$('#spiral').addEventListener('input', (e) => { const value = e.target.value.trim(); $('#river-thought-text').textContent = value || 'A thought can pass through.'; });
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
    senses: ['5–4–3–2–1 SENSES', '<h2>Come back through what is here.</h2><p>Tap what fits, or add your own. The ordinary things are exactly the point.</p><div class="sense-group"><h3>SEE</h3><div class="sense-chips"><button class="sense-chip">dog</button><button class="sense-chip">wall</button><button class="sense-chip">phone</button><button class="sense-chip">water</button><button class="sense-chip">floor</button><button class="sense-chip">jacket</button><input class="sense-other" placeholder="other…" /></div></div><div class="sense-group"><h3>FEEL</h3><div class="sense-chips"><button class="sense-chip">chair beneath you</button><button class="sense-chip">feet on the floor</button><button class="sense-chip">air on your face</button><button class="sense-chip">fabric on your skin</button><input class="sense-other" placeholder="other…" /></div></div><div class="sense-group"><h3>HEAR</h3><div class="sense-chips"><button class="sense-chip">your breath</button><button class="sense-chip">a hum</button><button class="sense-chip">outside</button><button class="sense-chip">quiet</button><input class="sense-other" placeholder="other…" /></div></div><div class="sense-group"><h3>SMELL / TASTE</h3><div class="sense-chips"><button class="sense-chip">air</button><button class="sense-chip">coffee</button><button class="sense-chip">mint</button><input class="sense-other" placeholder="other…" /></div></div><button class="exercise-action" id="finish-exercise">I’m back in the room</button>'],
    defusion: ['A LITTLE DISTANCE', '<h2>Put the thought on the table.</h2><p>You don’t have to agree with it or push it away. Just give it a little space.</p><div class="prompt-card"><p>Right now, this is more of a…</p></div><div class="fact-choice"><button data-fact-choice type="button">Fact</button><button data-fact-choice type="button">Feeling</button></div><label class="exercise-label" for="friend-answer">What would you say to a friend in this exact moment?</label><textarea class="friend-answer" id="friend-answer" placeholder="I’d probably say…"></textarea><button class="exercise-action" id="finish-exercise">That’s enough for now</button>'],
    category: ['NAME TEN THINGS', '<h2>Give your mind a small, harmless job.</h2><p>Start with one. A fresh line will wait underneath. Slow is fine; strange answers are welcome.</p><div class="prompt-card"><p class="category-word" id="category-word">Things you would pack for a road trip</p></div><div class="list-maker" id="list-maker"><input class="list-line" autocomplete="off" placeholder="1. Type the first thing…" /></div><div class="ten-dots" id="ten-dots">○ ○ ○ ○ ○ ○ ○ ○ ○ ○</div><button class="exercise-action" id="new-category">Give me another category</button><button class="exercise-action" id="finish-exercise">I’ve got enough</button>'],
    reset60: ['RESET 60', '<h2>Just one minute.</h2><p>For 60 seconds, put both feet on the floor and notice the next exhale. The clock can hold the time for you.</p><div class="minute-timer" id="minute-timer"><b>1:00</b><span>until this tiny reset is done</span></div><button class="exercise-action" id="start-timer">Start the minute</button><button class="exercise-action" id="finish-exercise">I’m ready to stop</button>']
  };
  type.textContent = items[selected][0]; content.innerHTML = items[selected][1]; $('#exercise').scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (selected === 'breathing') startBreathing();
  $('#finish-exercise')?.addEventListener('click', finish);
  $('#new-category')?.addEventListener('click', newCategory);
  $('#start-timer')?.addEventListener('click', startMinute);
  document.querySelectorAll('.sense-chip').forEach((b) => b.addEventListener('click', () => b.classList.toggle('selected')));
  document.querySelectorAll('[data-fact-choice]').forEach((b) => b.addEventListener('click', () => document.querySelectorAll('[data-fact-choice]').forEach((choice) => choice.classList.toggle('selected', choice === b))));
  $('#list-maker')?.addEventListener('input', growList);
}
function startBreathing() { const p = $('#pacer'), w = $('#breath-word'); breathIn = true; breathTimer = setInterval(() => { breathIn = !breathIn; p.classList.toggle('inhale', breathIn); w.textContent = breathIn ? 'Breathe in' : 'Breathe out'; }, 4000); }
function finish() { clearInterval(breathTimer); clearInterval(resetTimer); $('#close-copy').textContent = closes[Math.floor(Math.random() * closes.length)]; $('#close-message').classList.remove('hidden'); $('#close-message').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
function newCategory() { categoryIndex = (categoryIndex + 1) % categories.length; $('#category-word').textContent = categories[categoryIndex]; }
function growList(e) { const input = e.target; const maker = $('#list-maker'); const inputs = [...maker.querySelectorAll('input')]; const index = inputs.indexOf(input); if (input.value.trim() && index === inputs.length - 1 && inputs.length < 10) { const next = document.createElement('input'); next.className = 'list-line'; next.autocomplete = 'off'; next.placeholder = `${inputs.length + 1}. Keep going…`; maker.append(next); } const filled = inputs.filter((line) => line.value.trim()).length; $('#ten-dots').textContent = Array.from({ length: 10 }, (_, i) => i < filled ? '●' : '○').join(' '); }
function startMinute() { let seconds = 60; const timer = $('#minute-timer'), button = $('#start-timer'); timer.classList.add('running'); button.disabled = true; button.textContent = 'Keep going…'; resetTimer = setInterval(() => { seconds--; timer.querySelector('b').textContent = `0:${String(seconds).padStart(2, '0')}`; if (seconds <= 0) { clearInterval(resetTimer); timer.classList.remove('running'); timer.querySelector('b').textContent = 'Done'; timer.querySelector('span').textContent = 'You made a little room.'; button.textContent = 'One minute, complete ✓'; } }, 1000); }
