const CA="HrvF3KLc2Q5P6pHbsJBNn6pPoUvb3jGBBKzVkSripump",I1="beaver-chomp.jpg",I2="beaver-king.jpg";
const $=s=>document.querySelector(s);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}

// bg candles
// marquee
const ph=["I chew red candles","No brain. Just bite.","Bite first. Ask never.","Eat. Sleep. Chew. Repeat.","200 beavers. One mission. Zero brakes.","The market goes red. We get hungry.","Chew the noise. Build the legend.","We chew together"];
$('#mq').innerHTML=[...ph,...ph].map(p=>`<span>${p} 🕯️</span>`).join('');
// easter eggs
let lc=0;$('#logo').addEventListener('click',()=>{if(++lc%5===0)toast('🦫 You found the beaver. He wants a snack.')});
const ms=["Ouch. That was my face. 🦷","Teeth don’t pay for themselves.","*chomp* delicious red candle","Bite first. Ask never."];let mi=0;$('#mascot').onclick=()=>toast(ms[mi++%ms.length]);
// roadmap
const P=[["Build the Foundation","Identity, community and culture.","#ff3d2e"],["Ignite the Movement","Challenges, memes and collaborations.","#ff2d4f"],["Brand Recognition","Ambassadors, creators and X Spaces.","#ffc83d"],["Expansion","Bigger partnerships and international growth.","#19ff7a"],["The Big Leagues","Establish CHEW as a recognised force in meme culture.","#ff7a1a"]];
function setP(i){$('#ph').style.setProperty('--c',P[i][2]);$('#ph').innerHTML=`<div class="n">0${i+1}</div><div><h3>Phase ${i+1} — ${P[i][0]}</h3><p>${P[i][1]}</p></div>`;$('#pb').style.width=(i+1)*20+'%';document.querySelectorAll('.tab').forEach((t,j)=>{t.classList.toggle('on',j===i);t.setAttribute('aria-selected',j===i)})}
P.forEach((p,i)=>{const b=document.createElement('button');b.className='tab';b.role='tab';b.style.setProperty('--c',p[2]);b.textContent='PHASE '+(i+1);b.onclick=()=>setP(i);$('#tabs').appendChild(b)});setP(0);
// wall
const W=[[I1,"When the market goes red","I get hungry"],[I2,"They said it’s over","Long live the beaver"],[I1,"Weak hands: panic","Me: nom nom"],[I2,"Kings don’t sell","Kings chew"]];
W.forEach((w,i)=>{const t=document.createElement('div');t.className='tile';t.tabIndex=0;t.innerHTML=`<img src="${w[0]}" alt="CHEW meme" loading="lazy"><div class="t top">${w[1]}</div><div class="t bot">${w[2]}</div>`;const go=()=>{loadTpl(w[0],[w[1],w[2]]);$('#maker').scrollIntoView({behavior:'smooth'})};t.onclick=go;t.onkeydown=e=>{if(e.key==='Enter')go()};$('#wall').appendChild(t)});
for(let i=0;i<2;i++){const a=document.createElement('a');a.className='tile empty';a.href='https://t.me/Chewredcandles';a.target='_blank';a.rel='noopener';a.textContent='Your meme here. Post it on Telegram.';$('#wall').appendChild(a)}
// meme maker
const cv=$('#cv'),cx=cv.getContext('2d');let img=null,L=[],sel=0,drag=null;
const mk=(t,y)=>({t,x:.5,y,size:64,co:'#ffffff',oc:'#000000',ow:6,ft:'Impact',st:'normal'});
function draw(){if(!img)return;cx.drawImage(img,0,0,cv.width,cv.height);L.forEach((l,i)=>{const s=l.size*cv.width/800;cx.font=`${l.st} ${s}px "${l.ft}",Impact,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.lineJoin='round';cx.lineWidth=l.ow*cv.width/800;cx.strokeStyle=l.oc;cx.fillStyle=l.co;const txt=$('#up2').checked?l.t.toUpperCase():l.t;txt.split('\n').forEach((ln,k,a)=>{const y=l.y*cv.height+(k-(a.length-1)/2)*s*1.1,x=l.x*cv.width;if(l.ow)cx.strokeText(ln,x,y);cx.fillText(ln,x,y)});
if(i===sel&&!draw.exp){cx.save();cx.setLineDash([8,6]);cx.strokeStyle='#ffc83d88';cx.lineWidth=2;cx.strokeRect(6,l.y*cv.height-s*.7,cv.width-12,s*1.4);cx.restore()}})}
function sync(){const l=L[sel];if(!l)return;$('#tx').value=l.t;$('#co').value=l.co;$('#oc').value=l.oc;$('#sz').value=l.size;$('#szv').textContent=l.size;$('#ow').value=l.ow;$('#ft').value=l.ft;$('#st').value=l.st}
function loadTpl(src,txt){const im=new Image();im.onload=()=>{img=im;cv.width=1000;cv.height=Math.round(1000*im.height/im.width);L=txt?[mk(txt[0],.1),mk(txt[1],.9)]:[mk('TOP TEXT',.1),mk('BOTTOM TEXT',.9)];sel=0;sync();draw();document.querySelectorAll('#tp img').forEach(x=>x.classList.toggle('on',x.dataset.s===src))};im.src=src}
[[I1],[I2]].forEach(([s],i)=>{const t=document.createElement('img');t.src=s;t.dataset.s=s;t.alt='Template '+(i+1);t.onclick=()=>loadTpl(s);$('#tp').appendChild(t)});
$('#up').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>loadTpl(r.result);r.readAsDataURL(f)};
[['tx','t'],['co','co'],['oc','oc'],['sz','size'],['ow','ow'],['ft','ft'],['st','st']].forEach(([id,k])=>$('#'+id).addEventListener('input',e=>{if(!L[sel])return;L[sel][k]=k==='size'||k==='ow'?+e.target.value:e.target.value;if(k==='size')$('#szv').textContent=e.target.value;draw()}));
$('#up2').onchange=draw;
$('#add').onclick=()=>{L.push(mk('NEW TEXT',.5));sel=L.length-1;sync();draw()};
$('#del').onclick=()=>{if(L.length){L.splice(sel,1);sel=Math.max(0,sel-1);sync();draw()}};
function pt(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}}
cv.addEventListener('pointerdown',e=>{const p=pt(e);let b=-1,bd=1;L.forEach((l,i)=>{const d=Math.abs(l.y-p.y);if(d<bd){bd=d;b=i}});if(b>=0){sel=b;drag=1;cv.setPointerCapture(e.pointerId);sync();draw()}});
cv.addEventListener('pointermove',e=>{if(!drag)return;const p=pt(e);L[sel].x=Math.min(1,Math.max(0,p.x));L[sel].y=Math.min(1,Math.max(0,p.y));draw()});
cv.addEventListener('pointerup',()=>drag=null);
$('#dl').onclick=()=>{draw.exp=1;draw();const a=document.createElement('a');a.download='chew-meme.png';a.href=cv.toDataURL('image/png');a.click();draw.exp=0;draw();toast('Meme downloaded. Post it. Raid with it. 🦫')};
loadTpl(I2,["I CHEW RED CANDLES","NO BRAIN. JUST BITE."]);

(()=>{const p=document.getElementById('prog');addEventListener('scroll',()=>{const h=document.documentElement;p.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+'%'},{passive:true})})();

(()=>{const f=document.getElementById('cf'),a=document.getElementById('ch1'),b=document.getElementById('ch2');const D=f.src,GT='https://www.geckoterminal.com/solana/pools/7EaaeM9ZhjpK28QbQK4aQsFBsZP5ex9zuSx4QgUykhbQ?embed=1&info=0&swaps=0&grayscale=0&light_chart=0';
a.onclick=()=>{f.src=D;a.className='btn main';b.className='btn'};b.onclick=()=>{f.src=GT;b.className='btn main';a.className='btn'}})();

(async()=>{await CHEW.boot();CHEW.reveal();try{const{data}=await CHEW.sb.rpc('get_leaderboard');document.getElementById('top3').innerHTML=CHEW.podium((data&&data.rows)||[])}catch(e){}})();
