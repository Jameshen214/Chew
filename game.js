/* CHEW Rooftops: endless survival shooter. Scores are validated on the server (Supabase), never trusted from the browser. */
(async()=>{
const profile=await CHEW.boot();const sb=CHEW.sb,esc=CHEW.esc,fmt=CHEW.fmt;
const $=s=>document.querySelector(s),cv=$('#gc'),g=cv.getContext('2d'),ui=$('#gui');
const W=800,H=400,GY=338,MAXHP=200,FONT='"Anton",Impact,sans-serif';
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let mute=LS('chew_mute',false);
const hash=n=>{n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
// ---------- sound (synthesised, no files) ----------
let AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f1,f2,d,type,vol,dl){if(mute||!AC)return;const t=AC.currentTime+(dl||0),o=AC.createOscillator(),n=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,f2),t+d);n.gain.setValueAtTime(vol||.08,t);n.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(n);n.connect(AC.destination);o.start(t);o.stop(t+d+.03)}
function noise(d,vol){if(mute||!AC)return;const len=Math.floor(AC.sampleRate*d),b=AC.createBuffer(1,len,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<len;i++)a[i]=(Math.random()*2-1)*(1-i/len);const s=AC.createBufferSource(),n=AC.createGain();s.buffer=b;n.gain.value=vol||.1;s.connect(n);n.connect(AC.destination);s.start()}
const SFX={shoot:()=>tone(900,200,.07,'square',.045),jump:()=>tone(250,620,.14,'sine',.12),hit:()=>tone(220,90,.08,'sawtooth',.07),kill:()=>{tone(300,720,.13,'triangle',.14);noise(.1,.08)},hurt:()=>{tone(180,50,.3,'sawtooth',.18);noise(.18,.12)},eshoot:()=>tone(420,160,.1,'square',.035),pick:()=>{tone(500,500,.07,'square',.08);tone(850,850,.1,'square',.08,.07)},block:()=>tone(1200,600,.1,'triangle',.1),boss:()=>{tone(90,40,.5,'sawtooth',.2);noise(.4,.15)},over:()=>[400,320,250,160].forEach((f,i)=>tone(f,f*.8,.25,'sawtooth',.14,i*.18)),clear:()=>[523,659,784,1047].forEach((f,i)=>tone(f,f,.16,'square',.1,i*.1)),click:()=>tone(700,900,.05,'square',.06)};
const sfx=k=>{try{SFX[k]()}catch(e){}};
function muteBtn(){$('#gmute').textContent=mute?'🔇':'🔊'}
const stars=Array.from({length:45},(_,i)=>({x:hash(i)*W,y:hash(i+99)*200,s:hash(i+7)<.2?2:1}));
function city(off,bw,base,minH,rng,col,win,prob){const i0=Math.floor(off/bw);for(let i=i0;i<i0+Math.ceil(W/bw)+2;i++){const h=minH+hash(i*3+base)*rng,x=i*bw-off,w=bw-4;R(col,x,base-h,w,h+H);for(let r=0;r<h/13;r++)for(let k=0;k<w/12;k++)if(hash(i*57+r*13+k*7)<prob)R(win,x+5+k*12,base-h+7+r*13,3,4)}}
function bear(e,t){const s=e.s||1,k=e.hit>0?'#fff':e.col;g.save();g.translate(Math.round(e.x),Math.round(e.y));g.scale(s,s);R(k,2,12,24,20);R(k,4,2,18,14);R(k,3,0,5,5);R(k,19,0,5,5);R('#ff2020',6,6,3,3);R('#ff2020',14,6,3,3);R('#d9a47a',8,10,9,5);R('#000',11,10,3,2);R('#3f7a2f',16,18,6,6);R('#777',-4,16,10,3);const w=e.g?Math.floor(t*8+e.x*.05)%2:0;R(k,5,32,6,4-w);R(k,15,32,6,3+w);g.restore()}
function boss(B){const k=B.hit>0?'#fff':B.king?'#7a1f2b':'#6b2a22';g.save();g.translate(Math.round(B.x),Math.round(B.y));g.scale(3,3);R(k,2,12,24,20);R(k,4,2,18,14);R(k,3,0,5,5);R(k,19,0,5,5);R('#ff2020',6,6,3,3);R('#ff2020',14,6,3,3);R('#d9a47a',8,10,9,5);R('#000',11,10,3,2);R('#fff',9,15,2,2);R('#fff',13,15,2,2);R('#3f7a2f',16,18,6,6);R(k,5,32,6,4);R(k,15,32,6,4);if(B.king){R('#ffc83d',5,-4,3,5);R('#ffc83d',10,-6,3,7);R('#ffc83d',15,-4,3,5);R('#ffc83d',5,0,13,2)}g.restore();R('#300',B.x,B.y-14,B.w,6);R('#ff3b4f',B.x,B.y-14,B.w*B.hp/B.max,6)}
function drone(e,t){R(e.hit>0?'#fff':'#ff8a2a',e.x,e.y+4,22,9);R('#ffd27a',e.x+4,e.y+1,14,4);const f=Math.floor(t*30)%2;R('#ddd',e.x-3,e.y+(f?0:2),10,2);R('#ddd',e.x+15,e.y+(f?2:0),10,2);R('#f33',e.x+8,e.y+8,4,3)}
function beaver(p,t){const x=p.x,y=p.y,run=Math.floor(t*10)%2,air=p.y<GY-36;if(p.inv>0&&Math.floor(p.inv*14)%2)g.globalAlpha=.4;
 R('#3d2412',x-9,y+20,11,7);R('#6b3a1a',x+2,y+11,18,16);R('#8a4b1f',x+13,y+3,15,13);R('#ffc83d',x+15,y-2,3,5);R('#ffc83d',x+19,y-4,3,7);R('#ffc83d',x+23,y-2,3,5);R('#000',x+22,y+7,3,3);R('#000',x+26,y+11,3,2);R('#fff',x+22,y+14,4,4);
 R('#9b4dff',x+10,y+12,12,4);R('#9b4dff',x-1,y+13+run,10,3);R('#aaa',x+18,y+19,16,4);R('#555',x+18,y+23,5,4);R('#3d2412',x+4,y+27,5,air?5:7-run*2);R('#3d2412',x+13,y+27,5,air?5:5+run*2);if(p.mf>0)R('#fff3a0',x+34,y+17,7,8);
 if(p.sh>0){g.strokeStyle='#5ff';g.lineWidth=2;g.beginPath();g.arc(x+14,y+17,26,0,7);g.stroke()}g.globalAlpha=1}

// ---------- enemies ----------
const EN={runner:{w:28,h:36,hp:1,v:150,pts:10,dmg:22,col:'#6b2a22'},gunner:{w:28,h:36,hp:1,v:110,pts:12,dmg:20,col:'#7a3a22',fire:1.9},hopper:{w:28,h:36,hp:2,v:130,pts:13,dmg:20,col:'#5a2a5a',fire:3.2},
 drone:{w:22,h:13,hp:1,v:150,pts:15,dmg:15,fire:2.4},heavy:{w:39,h:50,hp:4,v:70,pts:25,dmg:35,col:'#4a1a40',fire:2.2,s:1.4},sprinter:{w:28,h:36,hp:1,v:80,pts:15,dmg:25,col:'#9a2a2a'}};
function pick(t){const pool=[['runner',5],['gunner',3]];if(t>=1)pool.push(['hopper',3],['drone',2.5]);if(t>=2)pool.push(['heavy',1.2+t*.2]);if(t>=3)pool.push(['sprinter',2]);let r=Math.random()*pool.reduce((a,x)=>a+x[1],0);for(const x of pool){if((r-=x[1])<=0)return x[0]}return'runner'}
let S=null,scene='menu',last=0,wx=0,keys={},touch={l:0,r:0,f:0},mouse=false,runP=null;
const tierOf=()=>Math.floor(S.score/1000);
function addEn(k,x){const d=EN[k],e={k,x,y:GY-d.h,w:d.w,h:d.h,hp:d.hp,vy:0,g:true,hit:0,col:d.col,s:d.s,jt:1+Math.random()*2,ft:(d.fire||9)*(.6+Math.random()*.8),wait:.3+Math.random()*.5,stopX:480+Math.random()*170,st:'walk',tm:0};
 if(k==='drone'){e.y0=190+Math.random()*100;e.y=e.y0;e.ph=Math.random()*6}S.ens.push(e)}
function shootAt(e,spd,d,spread){const p=S.p,ex=e.x,ey=e.y+e.h*.4,dx=p.x+14-ex,dy=p.y+17-ey;if(dx>-30)return;const b=Math.atan2(dy,dx);(spread?[-.2,0,.2]:[0]).forEach(a=>S.eb.push({x:ex,y:ey,w:10,h:6,vx:Math.cos(b+a)*spd,vy:Math.sin(b+a)*spd,d}));sfx('eshoot')}
function note(m,l){S.msg=m;S.msgT=l||1.4}
function boom(x,y,c,n){for(let i=0;i<n;i++)S.pt.push({x,y,vx:(Math.random()-.5)*300,vy:(Math.random()-.8)*300,l:.5+Math.random()*.4,c})}
const ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function jump(){if(scene!=='play')return;const p=S.p;if(p.j<2){p.vy=-560;p.j++;sfx('jump')}}
function hurt(d){const s=S,p=s.p;if(p.inv>0||s.over)return;if(p.sh>0){p.inv=.4;note('BLOCKED!');sfx('block');return}p.hp-=d;p.inv=.6;s.combo=0;s.shake=.25;s.fl=.22;sfx('hurt');boom(p.x+14,p.y+17,'#ff3b4f',14);s.fx.push({x:p.x+10,y:p.y-8,t:'-'+d,l:.9,c:'#ff3b4f'});
 if(p.hp<=0){p.hp=0;s.over=true;scene='dead';sfx('over');setTimeout(finish,800)}}
function kill(e){const s=S,d=EN[e.k];s.combo=s.ct>0?Math.min(5,s.combo+1):1;s.ct=2.2;const pts=d.pts*s.combo;s.score+=pts;s.kills++;sfx('kill');boom(e.x+e.w/2,e.y+e.h/2,e.k==='drone'?'#ff8a2a':'#c0392b',16);s.fx.push({x:e.x,y:e.y-6,t:'+'+pts,l:.8,c:'#ffe14f'});
 if(Math.random()<.14){const t=['h','h','s','r'][Math.floor(Math.random()*4)];if(t!=='h'||s.p.hp<MAXHP-25)s.pu.push({x:e.x,y:Math.min(e.y,GY-24),t})}}
function start(){ac();ui.classList.remove('on');ui.innerHTML='';scene='play';last=performance.now();
 S={t:0,score:0,kills:0,shots:0,hits:0,tier:0,combo:0,ct:0,ens:[],bl:[],eb:[],pu:[],pt:[],fx:[],spt:1,shake:0,fl:0,msg:'',msgT:0,over:false,p:{x:110,y:GY-34,vy:0,j:0,hp:MAXHP,inv:0,sh:0,rp:0,cd:0,mf:0}};
 runP=(async()=>await sb.rpc('start_run'))();note('GO! SURVIVE.',1.2)}
function upd(dt){const s=S,p=s.p,t=tierOf();s.t+=dt;wx+=(150+Math.min(t,12)*8)*dt;
 const dir=(keys.r||touch.r?1:0)-(keys.l||touch.l?1:0);p.x=Math.max(30,Math.min(380,p.x+dir*230*dt));
 p.vy+=1500*dt;p.y+=p.vy*dt;if(p.y>=GY-34){p.y=GY-34;p.vy=0;p.j=0}
 p.inv-=dt;p.sh-=dt;p.rp-=dt;p.cd-=dt;p.mf-=dt;s.shake-=dt;s.msgT-=dt;s.fl-=dt;if(s.ct>0){s.ct-=dt;if(s.ct<=0)s.combo=0}
 if((keys.f||touch.f||mouse)&&p.cd<=0&&!s.over){s.bl.push({x:p.x+32,y:p.y+19,w:12,h:4});s.shots++;p.cd=p.rp>0?.09:.2;p.mf=.05;sfx('shoot')}
 if(t>s.tier){s.tier=t;p.hp=Math.min(MAXHP,p.hp+20);note(`DIFFICULTY UP! TIER ${t}`,2.2);sfx('boss');s.spt=Math.min(s.spt,.4)}
 s.spt-=dt;if(s.spt<=0&&s.t>1.5&&!s.over){const cap=Math.min(30,3+2*t),burst=Math.min(6,1+Math.floor(t/2));for(let i=0;i<burst&&s.ens.length<cap;i++)addEn(pick(t),W+30+i*60+Math.random()*40);s.spt=Math.max(.32,1.5*Math.pow(.86,t))*(.8+Math.random()*.4)}
 const sc=1+Math.min(.8,.03*t),fi=Math.max(.45,Math.pow(.93,t)),bs=240+Math.min(t,12)*10;
 s.ens.forEach(e=>{const d=EN[e.k];e.hit-=dt;
  if(e.k==='drone'){let y=e.y0+Math.sin(s.t*3+e.ph)*26;
   if(e.dive){e.x+=e.dvx*dt;e.y+=e.dvy*dt;if(e.y>GY-14||e.x<p.x-90){e.dive=false;e.dived=true;e.y0=Math.min(e.y,GY-130)}}
   else{e.x-=d.v*sc*dt;e.y=y;if(t>=2&&!e.dived&&e.x<p.x+300&&e.x>p.x+120){const dx=p.x+14-e.x,dy=p.y+17-e.y,n=Math.hypot(dx,dy)||1;e.dive=true;e.dvx=dx/n*330;e.dvy=dy/n*330;sfx('eshoot')}}
   e.ft-=dt;if(e.ft<=0&&!e.dive&&e.x<W-40&&e.x>p.x+80){e.ft=d.fire*fi*(.8+Math.random()*.5);shootAt(e,bs,10)}}
  else{e.vy+=1300*dt;e.y+=e.vy*dt;if(e.y>=GY-e.h){e.y=GY-e.h;e.vy=0;e.g=true}
   if(e.k==='runner'){e.x-=d.v*sc*dt;e.jt-=dt;if(e.jt<=0&&e.g){e.vy=-430;e.g=false;e.jt=1.2+Math.random()*1.8}}
   else if(e.k==='gunner'){if(e.x>e.stopX)e.x-=d.v*sc*dt;e.ft-=dt;if(e.ft<=0){e.ft=d.fire*fi*(.8+Math.random()*.5);shootAt(e,bs,12)}e.jt-=dt;if(e.jt<=0&&e.g){e.vy=-440;e.g=false;e.jt=2.5+Math.random()*2}}
   else if(e.k==='hopper'){if(e.g){e.wait-=dt;if(e.wait<=0){e.vy=-520;e.vx=-150*sc;e.g=false;e.wait=.35+Math.random()*.3}}else e.x+=e.vx*dt;e.ft-=dt;if(e.ft<=0&&!e.g){e.ft=d.fire*fi*(.8+Math.random()*.5);shootAt(e,bs,12)}}
   else if(e.k==='heavy'){e.x-=d.v*sc*dt;e.ft-=dt;if(e.ft<=0){e.ft=d.fire*fi*(.8+Math.random()*.5);shootAt(e,bs-20,10,true)}}
   else if(e.k==='sprinter'){if(e.st==='walk'){e.x-=d.v*dt;if(e.x<p.x+300){e.st='tele';e.tm=.55}}else if(e.st==='tele'){e.tm-=dt;e.hit=.05;if(e.tm<=0)e.st='dash'}else e.x-=430*sc*dt}}});
 s.bl.forEach(b=>b.x+=680*dt);s.eb.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt});s.pu.forEach(u=>u.x-=150*dt);
 s.pt.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=500*dt;q.l-=dt});s.fx.forEach(f=>{f.y-=34*dt;f.l-=dt});
 s.bl.forEach(b=>{if(b.dead)return;for(const e of s.ens){if(e.dead||!ov(b,e))continue;e.hp--;e.hit=.08;b.dead=true;s.hits++;sfx('hit');if(e.hp<=0){e.dead=true;kill(e)}break}});
 const pb={x:p.x+4,y:p.y+3,w:20,h:31};
 s.ens.forEach(e=>{if(!e.dead&&ov(pb,e)){e.dead=true;boom(e.x,e.y+10,'#ff8a2a',8);hurt(EN[e.k].dmg)}});
 s.eb.forEach(b=>{if(!b.dead&&ov(pb,b)){b.dead=true;hurt(b.d)}});
 s.pu.forEach(u=>{if(!u.dead&&ov(pb,{x:u.x-10,y:u.y-10,w:20,h:20})){u.dead=true;sfx('pick');if(u.t==='s'){p.sh=6;note('SHIELD!')}else if(u.t==='r'){p.rp=7;note('RAPID FIRE!')}else{p.hp=Math.min(MAXHP,p.hp+30);note('+30 HP')}}});
 s.bl=s.bl.filter(b=>!b.dead&&b.x<W+20);s.eb=s.eb.filter(b=>!b.dead&&b.x>-30&&b.x<W+60&&b.y<H&&b.y>-40);s.ens=s.ens.filter(e=>!e.dead&&e.x>-90);s.pu=s.pu.filter(u=>!u.dead&&u.x>-30);s.pt=s.pt.filter(q=>q.l>0);s.fx=s.fx.filter(f=>f.l>0)}
// ---------- screens ----------
function show(h){ui.innerHTML=`<div class="gcard">${h}</div>`;ui.classList.add('on');ui.scrollTop=0}
function startS(){scene='menu';const pr=CHEW.profile()||profile;show(`<div style="color:var(--gold);font:18px Anton,Impact,sans-serif">THE BEAVER HAS A GUN</div><h1>$CHEW <span class="grad">ROOFTOPS</span></h1><p class="lead" style="margin:0 auto 12px">Endless survival. No levels, no finish line. Score as high as you can. Every 1,000 points the swarm gets bigger.</p><p class="note2">Playing as <b>${esc(pr.username)}</b> · Best this week: <b>${fmt(pr.weekly_score)}</b>${pr.weekly_rank?' (#'+pr.weekly_rank+')':''}</p><div class="row" style="margin-top:16px"><button class="btn gold" id="bStart">▶ START GAME</button><a class="btn" href="leaderboard.html">LEADERBOARD</a><a class="btn" href="index.html">HOME</a></div><p class="note2" style="margin-top:16px">Move: A / D or ← →. Jump: SPACE or ↑ (twice for a double jump). Shoot: hold X, Z or click. On phones use the on-screen buttons. You have 200 HP.</p>`);$('#bStart').onclick=()=>{start()}}
async function finish(){scene='menu';const s=S,acc=s.shots?Math.round(s.hits/s.shots*100):0;
 const body=(msg,retry)=>show(`<h1>GAME <span class="grad">OVER</span></h1><p class="note2">Player: <b>${esc(profile.username)}</b></p><div class="big2">${fmt(s.score)}</div><p class="note2">Tier ${s.tier} · ${s.kills} kills · ${acc}% accuracy · ${Math.round(s.t)}s</p><p class="sub" style="color:var(--mu);margin:12px 0">${msg}</p><div class="row">${retry?'<button class="btn main" id="bRetry">RETRY SAVE</button>':''}<button class="btn gold" id="bAgain">↻ PLAY AGAIN</button><a class="btn" href="leaderboard.html">LEADERBOARD</a><a class="btn" href="index.html">HOME</a></div>`);
 const wire=()=>{const a=$('#bAgain');a&&(a.onclick=start);const r=$('#bRetry');r&&(r.onclick=()=>save())};
 async function save(){body('Saving your score…');wire();try{const{data:run,error:e1}=await runP;if(e1||!run)throw e1||new Error('Run could not be started.');
   const{data,error}=await sb.rpc('submit_score',{p_run:run.run_id,p_score:s.score,p_kills:s.kills,p_shots:s.shots,p_hits:s.hits,p_duration_ms:Math.round(s.t*1000)});if(error)throw error;
   const m=data.status==='accepted'?`Score saved. You are <b>#${data.rank}</b> this week (best ${fmt(data.weekly_best)}).`:data.status==='flagged'?'Your score is being reviewed by the CHEW team before it counts.':'This run could not be verified, so it was not counted.';
   body(m);wire();try{const r=await sb.rpc('get_my_profile');if(r.data)Object.assign(profile,r.data)}catch(e){}}catch(e){body('Could not save your score: '+esc(e.message||e),true);wire()}}
 save()}
// ---------- drawing ----------
let sky;
function txt(s,x,y,sz,c,al){g.font=`${sz}px ${FONT}`;g.fillStyle=c;g.textAlign=al||'left';g.fillText(s,x,y)}
function draw(){const s=S,t=performance.now()/1000;if(!sky){sky=g.createLinearGradient(0,0,0,GY);sky.addColorStop(0,'#150a2b');sky.addColorStop(1,'#3a1c63')}
 g.save();if(s&&s.shake>0)g.translate((Math.random()-.5)*8,(Math.random()-.5)*8);g.fillStyle=sky;g.fillRect(-10,-10,W+20,H+20);
 stars.forEach((q,i)=>R(hash(i+Math.floor(t*2))<.15?'#fff4':'#fff8',q.x,q.y,q.s,q.s));const q=(t%6)/6;if(q<.12)R('#fff',100+q*4500,20+q*900,12,2);
 const mg=g.createRadialGradient(680,70,10,680,70,120);mg.addColorStop(0,'rgba(255,230,150,.45)');mg.addColorStop(1,'rgba(255,230,150,0)');g.fillStyle=mg;g.fillRect(540,0,260,220);g.fillStyle='#ffe9a8';g.beginPath();g.arc(680,70,22+Math.sin(t)*1.2,0,7);g.fill();
 for(let i=0;i<3;i++)R('rgba(90,60,140,.28)',(((i*330-wx*.04)%1000)+1000)%1000-120,60+i*38,170,14);
 city(wx*.1,70,GY-10,50,110,'#1b1033','#6a5a2a',.25);city(wx*.3,56,GY,30,90,'#120a24','#ffcf6a',.35);
 R('#1d1630',0,GY,W,H-GY);R('#5a4a8a',0,GY,W,3);for(let i=Math.floor(wx/36);i<Math.floor(wx/36)+24;i++)R(hash(i)<.5?'#ffb347':'#2a2144',i*36-wx+8,GY+20+Math.floor(hash(i+5)*3)*16,8,6);
 for(let i=Math.floor(wx/140);i<Math.floor(wx/140)+7;i++){const x=i*140-wx;if(hash(i*9)>.55)R('#ff8a1a',x,GY-8,16,8);else if(hash(i*9)>.3)R('#3a3350',x,GY-12,18,12)}
 if(s&&(scene==='play'||scene==='dead')){s.ens.forEach(e=>e.k==='drone'?drone(e,t):bear(e,t));
  s.pu.forEach(u=>{g.fillStyle=u.t==='s'?'#4fd8ff':u.t==='r'?'#ff4fd8':'#ff3b4f';g.beginPath();g.arc(u.x,u.y+Math.sin(t*6)*2,10,0,7);g.fill();g.fillStyle='#000';g.font=`14px ${FONT}`;g.textAlign='center';g.fillText(u.t==='s'?'S':u.t==='r'?'R':'+',u.x,u.y+5)});
  s.bl.forEach(b=>{R('rgba(255,225,79,.35)',b.x-14,b.y,14,b.h);R('#ffe14f',b.x,b.y,b.w,b.h)});s.eb.forEach(b=>{R('rgba(255,60,60,.3)',b.x+b.w,b.y,10,b.h);R('#ff3b3b',b.x,b.y,b.w,b.h)});
  beaver(s.p,t);s.pt.forEach(q=>R(q.c,q.x,q.y,4,4));s.fx.forEach(f=>{g.globalAlpha=Math.min(1,f.l*2);txt(f.t,f.x,f.y,18,f.c,'left');g.globalAlpha=1});hud(s);if(s.fl>0){g.fillStyle=`rgba(255,40,40,${Math.min(.35,s.fl*1.2)})`;g.fillRect(0,0,W,H)}}
 else beaver({x:110,y:GY-34,inv:0,sh:0,mf:0},t);g.restore()}
function hud(s){const p=s.p,t=tierOf();txt(fmt(s.score),14,32,30,'#fff');g.font='700 11px Inter,sans-serif';g.fillStyle='#fffa';g.textAlign='left';g.fillText(`${s.kills} KILLS · ${Math.round(s.t)}s`,14,48);
 txt(`TIER ${t}`,W/2,26,20,'#ffc83d','center');const nx=(t+1)*1000;R('#0008',W/2-100,32,200,7);R('#ff7a1a',W/2-100,32,200*Math.min(1,(s.score-t*1000)/1000),7);g.fillStyle='#fffa';g.font='700 10px Inter,sans-serif';g.textAlign='center';g.fillText(`NEXT TIER AT ${fmt(nx)}`,W/2,52);
 const hp=p.hp/MAXHP;R('#0009',W-176,14,162,16);R(hp>.5?'#31ff8a':hp>.25?'#ffc83d':'#ff3b4f',W-175,15,160*hp,14);txt(`HP ${Math.ceil(p.hp)}/${MAXHP}`,W-95,27,13,'#000','center');
 if(p.sh>0)txt(`SHIELD ${p.sh.toFixed(1)}s`,W-14,50,14,'#4fd8ff','right');if(p.rp>0)txt(`RAPID FIRE ${p.rp.toFixed(1)}s`,W-14,68,14,'#ff4fd8','right');
 if(s.combo>=2)txt(`x${s.combo} COMBO`,W/2,86,26+s.combo*2,'#31ff8a','center');if(s.msgT>0){g.globalAlpha=Math.min(1,s.msgT);txt(s.msg,W/2,135,32,'#fff','center');g.globalAlpha=1}}
function loop(n){const dt=Math.min(.05,(n-last)/1000||0);last=n;if(scene==='play'&&S)upd(dt);else wx+=40*dt;draw();requestAnimationFrame(loop)}
// ---------- input ----------
const K={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',KeyX:'f',KeyZ:'f',KeyJ:'f',KeyF:'f'};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(!e.repeat)jump()}if(K[e.code]){e.preventDefault();keys[K[e.code]]=true}});
addEventListener('keyup',e=>{if(K[e.code])keys[K[e.code]]=false});
cv.addEventListener('pointerdown',e=>{ac();if(e.pointerType==='mouse')mouse=true});addEventListener('pointerup',()=>{mouse=false});
const hold=(id,k)=>{const b=$('#'+id);if(!b)return;const on=e=>{e.preventDefault();ac();touch[k]=1;b.classList.add('on')},off=()=>{touch[k]=0;b.classList.remove('on')};b.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(v=>b.addEventListener(v,off))};
hold('bl','l');hold('br','r');hold('bf','f');const bj=$('#bj');bj&&bj.addEventListener('pointerdown',e=>{e.preventDefault();ac();jump()});
$('#gmute').onclick=()=>{mute=!mute;SV('chew_mute',mute);muteBtn();ac();sfx('click')};
document.addEventListener('visibilitychange',()=>{keys={};touch={l:0,r:0,f:0};mouse=false});
muteBtn();startS();requestAnimationFrame(loop);
window.__t={start:()=>{start()},upd,S:()=>S,keys,jump,scene:()=>scene,runP:()=>runP,tierOf};
})();
