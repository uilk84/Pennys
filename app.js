const API_KEY = "ulQA9P7NZIQgGpYn5vNT7TUsDptthjP_";
const REFRESH_MS = 15000;

/* ---------- Utilities ---------- */
function fmt(v){
  if(v==null) return '-';
  return v>=1e6?(v/1e6).toFixed(1)+'M'
       :v>=1e3?(v/1e3).toFixed(0)+'K'
       :v;
}

/* ---------- Storage ---------- */
function get(k,d){ return JSON.parse(localStorage.getItem(k)||JSON.stringify(d)); }
function set(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

/* ---------- Time Filter ---------- */
function inTradeWindow(){
  return true; // always allow scanner
}

/* ---------- Score ---------- */
function score(x){
  let s=0;
  s+=Math.min(40,(x.vs*20));
  s+=Math.max(0,30-(Math.abs((x.p/x.hod)-1)*1000));
  s+=Math.min(20,x.c*2);
  s+=x.p>=0.3&&x.p<=5?10:0;
  return Math.round(s);
}

/* ---------- Watchlist ---------- */
function addWL(sym){
  const wl=get('watchlist',[]);
  if(!wl.find(x=>x.sym===sym)){
    wl.push({sym,state:'WATCH',added:Date.now()});
    set('watchlist',wl);
    alert(sym+' added');
  }
}
function removeWL(sym){
  set('watchlist',get('watchlist',[]).filter(x=>x.sym!==sym));
  location.reload();
}

/* ---------- Alerts ---------- */
function addAlert(sym,breakout,invalid){
  if(!breakout||!invalid) return alert('Invalidation required');
  const a=get('alerts',[]);
  a.push({sym,breakout,invalid,hit:false});
  set('alerts',a);
}
function checkAlerts(data){
  const alerts=get('alerts',[]);
  alerts.forEach(a=>{
    if(a.hit) return;
    const s=data.find(x=>x.sym===a.sym);
    if(!s) return;
    if(s.p>=a.breakout||s.p<=a.invalid){
      a.hit=true;
      alert(`🚨 ${a.sym} thesis event`);
    }
  });
  set('alerts',alerts);
}
