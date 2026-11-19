/* CHEW shared script: Supabase client, site-wide login gate, nav, helpers. Only the PUBLIC (publishable) key is used here. */
(()=>{
const SB_URL='https://dryekzswjtcimnkpcasw.supabase.co';
const SB_KEY='sb_publishable_75lBir95KeYBL0_SMXyC5A_K73s8Jvt';
const CA='HrvF3KLc2Q5P6pHbsJBNn6pPoUvb3jGBBKzVkSripump';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(+n||0).toLocaleString('en-US');
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2400)}
async function copyCA(){try{await navigator.clipboard.writeText(CA)}catch(e){const a=document.createElement('textarea');a.value=CA;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}toast('Contract copied. Now go chew. 🦫')}
document.addEventListener('click',e=>{if(e.target.closest('[data-copy]'))copyCA()});
// mobile menu
function menu(){const lk=$('#lk'),bg=$('#bg');if(!lk||!bg)return;const close=()=>{lk.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.textContent='☰'};bg.onclick=()=>{const o=lk.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.textContent=o?'✕':'☰'};lk.querySelectorAll('a').forEach(a=>a.addEventListener('click',close))}
function candles(){const fx=$('#fx');if(!fx)return;for(let i=0;i<22;i++){const c=document.createElement('i');c.className='candle';const g=Math.random()>.5;c.style.cssText=`left:${Math.random()*100}%;height:${20+Math.random()*50}px;background:${g?'#31ff8a':'#ff3b4f'};animation-duration:${14+Math.random()*20}s;animation-delay:${-Math.random()*30}s`;fx.appendChild(c)}}
candles();
// scroll reveal
function reveal(){const els=document.querySelectorAll('section .wrap>*:not(.row)');if(!('IntersectionObserver'in window))return;const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});els.forEach(e=>{e.classList.add('reveal');io.observe(e)})}
const sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
let profile=null,entering=false,resolveReady;const ready=new Promise(r=>resolveReady=r);
// ---------- login gate ----------
function gateEl(){let g=$('#gate');if(!g){g=document.createElement('div');g.id='gate';g.className='gate';g.setAttribute('role','dialog');g.setAttribute('aria-modal','true');document.body.appendChild(g)}return g}
let email='',cool=0,coolT=null;
const friendly=m=>/provider is not enabled|Unsupported provider/i.test(m)?'Google sign-in is not switched on yet. Please use email for now.':/rate limit/i.test(m)?'Too many emails sent. Please wait a few minutes and try again.':/expired|invalid/i.test(m)?'That code is wrong or has expired. Check it or request a new one.':m;
function msg(t,ok){const m=$('#gmsg');if(m){m.textContent=t||'';m.className='msg '+(t?(ok?'ok':'err'):'')}}
function showGate(step,note){const g=gateEl();document.documentElement.classList.add('locked');g.classList.add('on');
 const logo='<div class="em">🦫</div>';let h='';
 if(step==='welcome')h=`${logo}<h2>WELCOME TO THE <span class="grad">DAM</span></h2><p>Sign in to enter the CHEW site, play the game and compete for the weekly top 3.</p><button class="btn main" id="gGoogle">CONTINUE WITH GOOGLE</button><button class="btn" id="gEmail">CONTINUE WITH EMAIL</button><div class="msg" id="gmsg"></div>`;
 if(step==='email')h=`${logo}<h2>YOUR <span class="grad">EMAIL</span></h2><p>We'll email you a one-time code. No password needed.</p><input id="gem" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" value="${esc(email)}"><button class="btn main" id="gSend">SEND CODE</button><button class="lnk" id="gBack">← Back</button><div class="msg" id="gmsg"></div>`;
 if(step==='code')h=`${logo}<h2>ENTER <span class="grad">CODE</span></h2><p>We sent a code to <b>${esc(email)}</b>. It can take a minute to arrive. Check spam too.</p><input id="gcode" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="Code"><button class="btn main" id="gVerify">VERIFY &amp; ENTER</button><button class="lnk" id="gResend">Resend code</button> <button class="lnk" id="gChange">Change email</button><div class="msg" id="gmsg"></div>`;
 if(step==='username')h=`${logo}<h2>PICK YOUR <span class="grad">NAME</span></h2><p>This is your public name on the leaderboard. 3 to 16 letters, numbers or underscores. You can't change it later.</p><input id="gun" maxlength="16" autocomplete="off" placeholder="BeaverBoss"><button class="btn main" id="gSave">SAVE &amp; ENTER</button><button class="lnk" id="gOut">Log out</button><div class="msg" id="gmsg"></div>`;
 g.innerHTML=`<div class="gbox">${h}</div>`;if(note)msg(note);
 const on=(id,fn)=>{const e=$('#'+id);e&&e.addEventListener('click',fn)};
 on('gGoogle',google);on('gEmail',()=>showGate('email'));on('gBack',()=>showGate('welcome'));on('gSend',()=>sendCode());on('gVerify',verify);on('gResend',()=>sendCode(true));on('gChange',()=>showGate('email'));on('gSave',saveName);on('gOut',logout);
 const inp=g.querySelector('input');if(inp){inp.focus();inp.addEventListener('keydown',e=>{if(e.key==='Enter'){const b=g.querySelector('.btn.main');b&&b.click()}})}
 if(step==='code')tickResend()}
function hideGate(){const g=$('#gate');g&&g.classList.remove('on');document.documentElement.classList.remove('locked')}
function tickResend(){const b=$('#gResend');if(!b)return;clearInterval(coolT);const upd=()=>{if(!$('#gResend')){clearInterval(coolT);return}const left=Math.ceil((cool-Date.now())/1000);b.disabled=left>0;b.textContent=left>0?`Resend code (${left}s)`:'Resend code'};upd();coolT=setInterval(upd,500)}
async function google(){msg('Opening Google…',true);const{error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)msg(friendly(error.message))}
async function sendCode(resend){const em=resend?email:($('#gem').value||'').trim().toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return msg('Enter a valid email address.');
 const b=$('#gSend')||$('#gResend');b&&(b.disabled=true);msg('Sending code…',true);email=em;
 const{error}=await sb.auth.signInWithOtp({email:em,options:{shouldCreateUser:true}});
 if(error){b&&(b.disabled=false);return msg(friendly(error.message))}
 cool=Date.now()+60000;if(resend){msg('New code sent. Check your inbox.',true);tickResend()}else{showGate('code');msg('Code sent. Check your inbox.',true)}}
async function verify(){const token=($('#gcode').value||'').replace(/\s/g,'');if(token.length<6)return msg('Enter the full code from your email.');
 const b=$('#gVerify');b.disabled=true;msg('Checking…',true);const{error}=await sb.auth.verifyOtp({email,token,type:'email'});
 if(error){b.disabled=false;return msg(friendly(error.message))}msg('Verified! Welcome in.',true)}
async function saveName(){const u=($('#gun').value||'').trim();const b=$('#gSave');b.disabled=true;msg('Saving…',true);
 const{error}=await sb.rpc('set_username',{p_username:u});if(error){b.disabled=false;return msg(error.message)}await enter()}
async function logout(){await sb.auth.signOut();profile=null;showGate('welcome')}
// ---------- session + profile ----------
async function loadProfile(){const{data,error}=await sb.rpc('get_my_profile');if(error)throw error;profile=data;return data}
function navChip(){const n=$('#navuser');if(n&&profile&&profile.username){n.textContent='👤 '+profile.username;n.hidden=false}const a=$('#navadmin');if(a)a.hidden=!(profile&&profile.is_admin)}
async function enter(){if(entering)return;entering=true;try{const p=await loadProfile();if(!p.username){showGate('username');return}hideGate();navChip();resolveReady(profile)}catch(e){showGate('welcome','Could not load your profile: '+e.message)}finally{entering=false}}
async function boot(){menu();const{data:{session}}=await sb.auth.getSession();
 sb.auth.onAuthStateChange((ev,s)=>{if(ev==='SIGNED_IN'&&s&&!profile)enter();if(ev==='SIGNED_OUT'){profile=null;showGate('welcome')}});
 if(session)await enter();else showGate('welcome');return ready}
function podium(rows){const m=['🥇','🥈','🥉'];return [0,1,2].map(i=>{const r=rows[i];return r?`<div class="pc p${i+1}"><div class="m">${m[i]}</div><b>${esc(r.username)}</b><span>${fmt(r.score)}</span></div>`:`<div class="pc p${i+1} open"><div class="m">${m[i]}</div><b>Open spot</b><span>—</span></div>`}).join('')}
function left(endIso){const ms=new Date(endIso).getTime()-Date.now();if(ms<=0)return'ending now';return `${Math.floor(ms/864e5)}d ${Math.floor(ms%864e5/36e5)}h ${Math.floor(ms%36e5/6e4)}m`}
window.CHEW={sb,boot,toast,esc,fmt,podium,left,logout,profile:()=>profile,reveal,CA};
})();
