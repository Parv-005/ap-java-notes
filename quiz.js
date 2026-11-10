(function(){
var root=document.getElementById('quiz'); if(!root||!window.MCQ)return;
var store={best:{},cards:{}};
try{var s=localStorage.getItem('apq');if(s)store=JSON.parse(s)}catch(e){}
function save(){try{localStorage.setItem('apq',JSON.stringify(store))}catch(e){}}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function el(h){var d=document.createElement('div');d.innerHTML=h;return d}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var units=['All','Basics','Unit 1','Unit 2','Unit 3','Unit 4','Unit 5'];
var papers=[['All','All papers'],['ms24','Mid-Sem Sep 2024'],['es24','End-Sem Dec 2024'],['ms25','Mid-Sem Sep 2025'],['es25','End-Sem Dec 2025'],['mj26','Mid-Sem Jun 2026'],['ej26','End-Sem Jul 2026'],['ms26','Mid-Sem Sep 2026']];
function home(){
  var best=store.best||{},known=Object.keys(store.cards).filter(function(k){return store.cards[k]==='k'}).length;
  root.innerHTML='<div class="qcard"><h3 style="margin-top:0">📝 Multiple-choice quiz</h3><p class="sub">'+MCQ.length+' questions. Instant feedback, explanation and a link to the notes.</p>'+
   '<div class="qrow">Topic: <select id="qu">'+units.map(function(u){return'<option>'+u+'</option>'}).join('')+'</select> Questions: <select id="qn"><option>10</option><option>20</option><option value="999">All</option></select> <button class="qbtn pri" id="qgo">Start quiz</button></div>'+
   '<div class="sub" style="margin-top:8px">Best scores: '+(Object.keys(best).length?Object.keys(best).map(function(k){return k+' '+best[k]+'%'}).join(' · '):'none yet')+'</div></div>'+
   '<div class="qcard"><h3 style="margin-top:0">🃏 PYQ flashcards</h3><p class="sub">'+CARDS.length+' real exam questions. Try answering in your head, reveal the answer links, then mark how you did. '+known+' marked "got it".</p>'+
   '<div class="qrow">Paper: <select id="qp">'+papers.map(function(p){return'<option value="'+p[0]+'">'+p[1]+'</option>'}).join('')+'</select> <label><input type="checkbox" id="qr"> only ones I haven\'t got</label> <button class="qbtn pri" id="qcg">Start flashcards</button> <button class="qbtn" id="qrs">Reset progress</button></div></div>';
  document.getElementById('qgo').onclick=function(){startQuiz(document.getElementById('qu').value,+document.getElementById('qn').value)};
  document.getElementById('qcg').onclick=function(){startCards(document.getElementById('qp').value,document.getElementById('qr').checked)};
  document.getElementById('qrs').onclick=function(){store={best:{},cards:{}};save();home()};
}
function startQuiz(unit,n){
  var pool=MCQ.filter(function(q){return unit==='All'||q.u===unit});
  var qs=sh(pool).slice(0,n),i=0,score=0,wrong=[];
  function show(){
    if(i>=qs.length){return done()}
    var q=qs[i],opts=sh(q.o.map(function(t,k){return{t:t,c:k===0}}));
    root.innerHTML='<div class="qcard"><div class="sub">'+esc(unit)+' · question '+(i+1)+' of '+qs.length+' · score '+score+'</div><h3>'+esc(q.q)+'</h3><div id="qo"></div><div id="qf"></div></div>';
    var box=document.getElementById('qo'),ans=false;
    opts.forEach(function(o){var b=document.createElement('button');b.className='qopt';b.textContent=o.t;
      b.onclick=function(){if(ans)return;ans=true;
        [].forEach.call(box.children,function(x,k){x.disabled=true;if(opts[k].c)x.classList.add('ok')});
        if(o.c){score++;b.classList.add('ok')}else{b.classList.add('bad');wrong.push(q)}
        document.getElementById('qf').innerHTML='<div class="box '+(o.c?'tip':'pyq')+'"><b>'+(o.c?'Correct ✔':'Not quite ✘')+'</b>'+esc(q.e)+' <a href="'+q.l+'">Read the notes →</a></div><button class="qbtn pri" id="qnx">'+(i+1<qs.length?'Next':'Finish')+'</button>';
        document.getElementById('qnx').onclick=function(){i++;show()}};
      box.appendChild(b)});
  }
  function done(){
    var pct=Math.round(100*score/qs.length);
    if(!store.best)store.best={};if((store.best[unit]||0)<pct){store.best[unit]=pct;save()}
    root.innerHTML='<div class="qcard"><h3>Result: '+score+' / '+qs.length+' ('+pct+'%)</h3>'+
     (wrong.length?'<p>Review these:</p><ul>'+wrong.map(function(q){return'<li>'+esc(q.q)+' <a href="'+q.l+'">notes →</a></li>'}).join('')+'</ul>':'<p>Perfect! 🎉</p>')+
     '<button class="qbtn pri" id="qag">Try again</button> <button class="qbtn" id="qhm">Menu</button></div>';
    document.getElementById('qag').onclick=function(){startQuiz(unit,n)};document.getElementById('qhm').onclick=home;
  }
  if(!qs.length){root.innerHTML='<p>No questions.</p>';return}
  show();
}
function startCards(paper,onlyNew){
  var cs=CARDS.filter(function(c){return(paper==='All'||c.id.indexOf(paper+'-')===0)&&(!onlyNew||store.cards[c.id]!=='k')});
  cs=sh(cs);var i=0;
  function show(){
    if(i>=cs.length){root.innerHTML='<div class="qcard"><h3>Deck finished 🎉</h3><button class="qbtn pri" id="qhm">Menu</button></div>';document.getElementById('qhm').onclick=home;return}
    var c=cs[i];
    root.innerHTML='<div class="qcard"><div class="sub">'+esc(c.p)+' · Q'+esc(c.n)+' · card '+(i+1)+' of '+cs.length+'</div><h3>'+esc(c.q)+'</h3><div id="qf"><button class="qbtn pri" id="qrv">Reveal answer links</button></div></div>';
    document.getElementById('qrv').onclick=function(){
      document.getElementById('qf').innerHTML='<p>Answer in the notes: '+c.l.map(function(l){return'<a href="'+l[0]+'">'+esc(l[1])+'</a>'}).join(' · ')+'</p><button class="qbtn pri" id="qk">Got it ✔</button> <button class="qbtn" id="qv">Revise later</button>';
      document.getElementById('qk').onclick=function(){store.cards[c.id]='k';save();i++;show()};
      document.getElementById('qv').onclick=function(){store.cards[c.id]='r';save();i++;show()}};
  }
  show();
}
home();
})();
