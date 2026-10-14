// ===== Ledger chat: the model only proposes input values via set_inputs; the page validates, applies and computes =====
const chatOn=/^https:\/\/|^http:\/\/localhost/.test(CHAT_ENDPOINT);
const GREET="Hi, I'm Ledger. I'll help you build a FIRE plan, one question at a time. You never need to share your name or account details.\n\n**First: how old are you, and roughly how much do you have invested for retirement?**";
let CHAT=[],busy=false,batchN=0;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const md=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
const fv=(k,v)=>CF[k].type==='boolean'?(v?'on':'off'):CF[k].unit&&CF[k].unit.startsWith('USD')?fk(v)+(CF[k].unit.includes('/')?'/'+CF[k].unit.split('/')[1].replace('month','mo'):''):v+(CF[k].unit==='%'?'%':'');
function bubble(cls,html){const d=document.createElement('div');d.className='cmsg '+cls;d.innerHTML=html;$('chatlog').appendChild(d);$('chatlog').scrollTop=1e9;return d}
function chatContext(){const inputs={};for(const k in CF)if(has(k))inputs[CF[k].label]=V[k];return JSON.stringify({inputs,stillMissing:missing().map(k=>CF[k].label),exampleNumbersLoaded:example,outputs:outputs(compute())})}
function applyInputs(args){const applied={},rejected={},prev={};
 for(const[k,v]of Object.entries(args||{})){if(!CF[k]){rejected[k]='unknown field';continue}
  if(CF[k].type==='boolean'&&typeof v!=='boolean'&&v!==null){rejected[k]='expected true/false';continue}
  prev[k]=V[k];const e=setVal(k,v===null?'':(CF[k].type==='boolean'?v:String(v)),false);if(e){rejected[k]=e;continue}if(example){example=false;save();render()}applied[k]=V[k]}
 return{applied,rejected,prev}}
function changeNote(r){const ks=Object.keys(r.applied),rj=Object.entries(r.rejected);if(!ks.length&&!rj.length)return;
 const d=bubble('cnote',ks.map(k=>`Set ${esc(CF[k].label)} to <b>${esc(r.applied[k]===undefined?'blank':fv(k,r.applied[k]))}</b>`).join('<br>')+(rj.length?'<br><span class="warn">'+rj.map(([k,v])=>`Couldn't set ${esc(CF[k]?.label||k)}: ${esc(v)}`).join('<br>')+'</span>':'')+(ks.length?' <button type="button" class="undo">Undo</button>':''));
 ks.forEach(k=>{const e=$(k);if(e&&e.closest('#finetune'))$('finetune').open=true;if(e){e.classList.remove('aiflash');void e.offsetWidth;e.classList.add('aiflash')}});
 const u=d.querySelector('.undo');if(u)u.onclick=()=>{ks.forEach(k=>{if(r.prev[k]===undefined)delete V[k];else V[k]=r.prev[k]});save();render();u.disabled=true;u.textContent='Undone';CHAT.push({role:'user',content:'(I clicked Undo on the last change.)'})}}
async function chatSend(text){if(busy||!text.trim()||!chatOn)return;busy=true;$('chatsend').disabled=true;bubble('cuser',esc(text));CHAT.push({role:'user',content:text});const th=bubble('cbot cthink','Ledger is thinking…');
 try{for(let round=0;round<3;round++){const r=await fetch(CHAT_ENDPOINT,{method:'POST',referrerPolicy:'no-referrer-when-downgrade',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:CHAT.slice(-30),context:chatContext(),final:round>=2})});
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error==='rate_limited'?`Too many messages; try again in ${Math.ceil((e.retry_after||60)/60)} min.`:'Chat unavailable right now.')}
  const d=await r.json(),m=d.message;CHAT.push(m);
  if(m.tool_calls&&m.tool_calls.length){for(const tc of m.tool_calls){let a={};try{a=JSON.parse(tc.function.arguments||'{}')}catch(_){}const res=applyInputs(a);changeNote(res);
    CHAT.push({role:'tool',tool_call_id:tc.id,content:JSON.stringify({applied:Object.fromEntries(Object.entries(res.applied).map(([k,v])=>[CF[k].label,v===undefined?null:fv(k,v)])),rejected:res.rejected,stillMissing:missing().map(k=>CF[k].label),outputs:outputs(compute())})})}continue}
  th.remove();const b=bubble('cbot',md(m.content||'(no reply)'));$('chatlive').textContent=b.textContent;break}}
 catch(err){bubble('cbot cerr',esc(err.message&&!/fetch/i.test(err.message)?err.message:'Chat unavailable right now. You can still fill in the form.'))}
 finally{th.remove();busy=false;$('chatsend').disabled=false;$('chatin').focus()}}
window.chatNote=t=>{bubble('cbot',md(t));CHAT.push({role:'assistant',content:t})};
window.chatReset=()=>{CHAT=[];$('chatlog').innerHTML='';bubble('cbot',md(GREET));CHAT.push({role:'assistant',content:GREET})};
window.chatStateChanged=()=>{};
$('chatform').onsubmit=e=>{e.preventDefault();const t=$('chatin').value;$('chatin').value='';chatSend(t)};
$('chatin').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('chatform').requestSubmit()}});
chatReset();if(!chatOn){$('chatin').disabled=$('chatsend').disabled=true;bubble('cbot cerr','Chat is offline. You can still fill in the form.')}
