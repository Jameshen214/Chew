(async()=>{const p=await CHEW.boot();const{esc,fmt}=CHEW;document.getElementById('lo').onclick=()=>CHEW.logout();
const{data,error}=await CHEW.sb.rpc('get_my_profile');if(error){document.getElementById('pn').textContent='Error';document.getElementById('pm').textContent=error.message;return}
const d=iso=>new Date(iso).toISOString().slice(0,10);
document.getElementById('pn').innerHTML='<span class="grad">'+esc(data.username)+'</span>';
document.getElementById('pm').textContent='Player ID '+String(data.id).slice(0,8).toUpperCase()+' · Registered '+d(data.created_at);
const st=[['BEST SCORE (ALL TIME)',fmt(data.best_score)],['THIS WEEK',fmt(data.weekly_score)],['WEEKLY RANK',data.weekly_rank?'#'+data.weekly_rank:'—'],['GAMES PLAYED',fmt(data.games_played)]];
document.getElementById('ps').innerHTML=st.map(s=>`<div class="stat"><span>${s[0]}</span><b>${s[1]}</b></div>`).join('');
document.getElementById('ph').innerHTML=data.history&&data.history.length?`<table class="lbt"><tr><th>WEEK (UTC)</th><th class="n">BEST SCORE</th><th class="n">FINAL RANK</th></tr>${data.history.map(h=>`<tr><td>${d(h.starts_at)}</td><td class="n">${fmt(h.best_score)}</td><td class="n">#${h.rank||'—'}</td></tr>`).join('')}</table>`:'<p class="note2">No competition history yet. Play a game to enter this week.</p>';})();
