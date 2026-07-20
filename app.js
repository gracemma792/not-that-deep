const $ = s => document.querySelector(s);
const verdicts = [
  ['Insufficient grounds for a spiral.', 'After review, this matter has been classified as “mildly irritating at most.” You are released from further analysis.'],
  ['This has been noted. It has not been elevated.', 'The committee agrees it was a bit strange. The committee also agrees it does not require a response, a subtweet, or a debrief.'],
  ['No action is required at this time.', 'The situation may proceed without your supervision. Its outcome is unlikely to improve with additional mental tabbing.'],
  ['A normal amount of weirdness has occurred.', 'This finding does not reflect on your character, their character, or the future of civilization. Please resume your day.'],
  ['The file is being closed for lack of consequence.', 'A brief internal eye-roll has been approved. All further emotional expenditure is declined.'],
  ['The court finds this: not that deep.', 'It may have had a tone. It may even have had a subtext. Neither has met the threshold for occupation of your evening.']
];
const closes = ['You gave it a little less of the whole room. That counts.', 'The feeling was real. You do not have to solve it all from inside the feeling.', 'Nothing needed to be proven just now. You made a little space.'];
let selected = 'breathing', breathTimer, breathIn = true, categoryIndex = 0;

document.querySelectorAll('.mode').forEach(button => button.addEventListener('click', () => {
  const mode = button.dataset.mode;
  document.body.dataset.mode = mode;
  document.querySelectorAll('.mode').forEach(b => b.classList.toggle('active', b === button));
  $('#dismiss-panel').classList.toggle('hidden', mode !== 'dismiss');
  $('#reset-panel').classList.toggle('hidden', mode !== 'reset');
  clearInterval(breathTimer);
}));
$('#incident').addEventListener('input', e => $('#count').textContent = e.target.value.length);
$('#rule-button').addEventListener('click', issueRuling);
function issueRuling(){
  const pick = verdicts[Math.floor(Math.random()*verdicts.length)];
  $('#ruling-title').textContent = pick[0]; $('#ruling-copy').textContent = pick[1];
  $('#case-number').textContent = `NTD–${String(Math.floor(Math.random()*999)+1).padStart(3,'0')}`;
  $('#ruling').classList.remove('hidden'); $('#ruling').scrollIntoView({behavior:'smooth',block:'nearest'});
}
$('#share-ruling').addEventListener('click', async () => { const text=`NOT THAT DEEP — ${$('#ruling-title').textContent}\n${$('#ruling-copy').textContent}`; try{ if(navigator.share) await navigator.share({title:'Official ruling',text}); else {await navigator.clipboard.writeText(text); $('#share-ruling').textContent='Copied'; setTimeout(()=>$('#share-ruling').textContent='Share ruling',1400)} }catch(e){} });
$('#download-ruling').addEventListener('click', () => { const c=document.createElement('canvas'), x=c.getContext('2d');c.width=1080;c.height=1080;x.fillStyle='#fffef9';x.fillRect(0,0,c.width,c.height);x.strokeStyle='#17201b';x.lineWidth=5;x.strokeRect(38,38,1004,1004);x.fillStyle='#17201b';x.font='28px monospace';x.fillText('OFFICE OF PROPORTION & PERSPECTIVE',85,120);x.font='bold 66px sans-serif';wrap(x,$('#ruling-title').textContent,85,230,850,78);x.font='32px sans-serif';wrap(x,$('#ruling-copy').textContent,85,500,820,46);x.strokeStyle='#c53a28';x.lineWidth=9;x.strokeRect(760,760,210,150);x.fillStyle='#c53a28';x.font='bold 31px monospace';x.fillText('NOT THAT',785,815);x.fillText('DEEP',815,855);const a=document.createElement('a');a.download='not-that-deep-ruling.png';a.href=c.toDataURL('image/png');a.click(); });
function wrap(x,text,left,top,width,line){let words=text.split(' '), row='', y=top;for(const word of words){let test=row+word+' ';if(x.measureText(test).width>width&&row){x.fillText(row,left,y);row=word+' ';y+=line}else row=test}x.fillText(row,left,y)}
document.querySelectorAll('.technique').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.technique;document.querySelectorAll('.technique').forEach(x=>x.classList.toggle('selected',x===b))}));
$('#start-reset').addEventListener('click', showExercise); $('#choose-another').addEventListener('click',()=>{$('#exercise').classList.add('hidden');$('#close-message').classList.add('hidden');clearInterval(breathTimer);window.scrollTo({top:0,behavior:'smooth'})});
function showExercise(){clearInterval(breathTimer);$('#exercise').classList.remove('hidden');$('#close-message').classList.add('hidden');const content=$('#exercise-content'), type=$('#exercise-type'); const items={
breathing:['PACED BREATHING','<h2>Let the out-breath be longer.</h2><p>For a few rounds: breathe in gently for 4, then out slowly for 6. There is no prize for doing it perfectly.</p><div class="breathing-pacer inhale" id="pacer"><span id="breath-word">Breathe in</span></div><p style="text-align:center;font:12px DM Mono">Follow the circle for four rounds.</p><button class="exercise-action" id="finish-exercise">I’ve done a few rounds</button>'],
senses:['5–4–3–2–1 SENSES','<h2>Come back through your senses.</h2><p>You can do this silently, out loud, or just notice one thing at a time.</p><ol class="sensory-list"><li><b>5</b> things you can see</li><li><b>4</b> things you can feel</li><li><b>3</b> things you can hear</li><li><b>2</b> things you can smell</li><li><b>1</b> thing you can taste</li></ol><button class="exercise-action" id="finish-exercise">I’m back in the room</button>'],
defusion:['A LITTLE DISTANCE','<h2>Put the thought on the table.</h2><p>You don’t have to agree with it or push it away. Just give it a little space.</p><div class="prompt-card"><p>Is this a fact, or a feeling I’m having right now?</p></div><div class="prompt-card"><p>What would I say to a friend in this exact moment?</p></div><button class="exercise-action" id="finish-exercise">That’s enough for now</button>'],
category:['NAME TEN THINGS','<h2>Give your mind a small, harmless job.</h2><p>Name ten things in this category. Slow is fine. Repeats do not count, but strange answers do.</p><div class="prompt-card"><p class="category-word" id="category-word">Things you would pack for a road trip</p></div><button class="exercise-action" id="new-category">Give me another category</button><button class="exercise-action" id="finish-exercise">I’ve got ten</button>']};
  type.textContent=items[selected][0];content.innerHTML=items[selected][1];$('#exercise').scrollIntoView({behavior:'smooth',block:'start'});
  if(selected==='breathing') startBreathing(); $('#finish-exercise')?.addEventListener('click',finish); $('#new-category')?.addEventListener('click',newCategory);
}
function startBreathing(){const p=$('#pacer'),w=$('#breath-word');breathIn=true;breathTimer=setInterval(()=>{breathIn=!breathIn;p.classList.toggle('inhale',breathIn);w.textContent=breathIn?'Breathe in':'Breathe out'},4000)}
function finish(){clearInterval(breathTimer);$('#close-copy').textContent=closes[Math.floor(Math.random()*closes.length)];$('#close-message').classList.remove('hidden');$('#close-message').scrollIntoView({behavior:'smooth',block:'nearest'})}
function newCategory(){const cats=['Things that are blue','Movies you could watch again','Things that grow in a garden','Cities you know','Things with wheels','Foods you would order at a café'];categoryIndex=(categoryIndex+1)%cats.length;$('#category-word').textContent=cats[categoryIndex]}
