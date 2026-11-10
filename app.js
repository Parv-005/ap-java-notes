// Builds the sidebar TOC from h2/h3 and a light/dark toggle.
(function(){
  var nav=document.querySelector('nav.toc .auto');
  if(nav){document.querySelectorAll('main h2, main h3').forEach(function(h,i){
    if(!h.id)h.id='s'+i;var a=document.createElement('a');a.href='#'+h.id;
    a.textContent=h.textContent.replace(/PYQ.*|Lab.*/,'').trim();if(h.tagName==='H3')a.className='l2';nav.appendChild(a);});}
  var b=document.createElement('button');b.id='themebtn';b.textContent='◐ Theme';
  b.onclick=function(){var r=document.documentElement,d=r.getAttribute('data-theme');
    var dark=d?d==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    r.setAttribute('data-theme',dark?'light':'dark');try{localStorage.setItem('theme',r.getAttribute('data-theme'))}catch(e){}};
  try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}
  document.body.appendChild(b);
})();
