
(function(){
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]})}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function getSite(){return read('psy_site',{})}
  var defaultContacts=[
    {type:'telegram',title:'Telegram',value:'@USERNAME',href:'https://t.me/USERNAME'},
    {type:'email',title:'Email',value:'psychologist@example.com',href:'mailto:psychologist@example.com'},
    {type:'instagram',title:'Instagram',value:'@USERNAME',href:'#'},
    {type:'facebook',title:'Facebook',value:'Facebook',href:'#'},
    {type:'phone',title:'Телефон',value:'+380 (67) 737 71 92',href:'tel:+380677377192'}
  ];
  function fromStorage(){
    var s=getSite();
    var arr=[
      {type:'telegram',title:'Telegram',value:s.telegramName||s.telegram||'@USERNAME',href:s.telegramUrl||'https://t.me/USERNAME'},
      {type:'email',title:'Email',value:s.email||'psychologist@example.com',href:'mailto:'+(s.email||'psychologist@example.com')},
      {type:'instagram',title:'Instagram',value:s.instagramName||s.instagram||'@USERNAME',href:s.instagramUrl||'#'},
      {type:'facebook',title:'Facebook',value:s.facebookName||s.facebook||'Facebook',href:s.facebookUrl||'#'},
      {type:'phone',title:'Телефон',value:s.phone||'+380 (67) 737 71 92',href:'tel:'+String(s.phone||'+380677377192').replace(/[^\d+]/g,'')}
    ];
    return arr.map(function(c,i){return c.value?c:defaultContacts[i]})
  }
  function contactHTML(c, cls){
    return '<a class="'+(cls||'footer-contact-link')+'" data-contact-type="'+esc(c.type)+'" href="'+esc(c.href||'#')+'" '+((c.href||'').startsWith('http')?'target="_blank" rel="noopener"':'')+'><span class="rf-icon footer-contact-icon '+esc(c.type)+'" aria-hidden="true"></span><span class="contact-title-line">'+esc(c.title)+'</span><b class="contact-value-line">'+esc(c.value).replace(/[■▪●◆◼︎◾︎⬛︎□▫︎●•]/g,'')+'</b></a>'
  }
  function renderFooter(){
    var box=document.getElementById('footerContacts');
    if(!box) return;
    box.className='footer-contacts';
    box.innerHTML=fromStorage().map(function(c){return contactHTML(c,'footer-contact-link')}).join('');
  }
  function renderContactsPage(){
    var grid=document.getElementById('contactsGrid');
    if(!grid) return;
    grid.className='contacts-grid';
    grid.innerHTML=fromStorage().map(function(c){return contactHTML(c,'contact-card')}).join('');
  }
  function renderCTA(){
    document.querySelectorAll('.floating-book,.telegram-float,.floating-actions,.float-actions,.sticky-actions,.sticky-cta,.quick-actions,.quick-contact,.fixed-cta,.fixed-buttons').forEach(function(x){x.remove()});
    var box=document.getElementById('fixedBottomCta');
    if(!box){box=document.createElement('div');box.id='fixedBottomCta';box.className='fixed-bottom-cta';document.body.appendChild(box)}
    box.className='fixed-bottom-cta';
    var tg=(getSite().telegramUrl||'https://t.me/USERNAME');
    box.innerHTML='<a class="cta-book" href="services.html#booking">Записатись</a><a class="cta-telegram" href="'+esc(tg)+'" target="_blank" rel="noopener">Telegram</a>';
  }
  function clientSessionNav(){
    var email=localStorage.psy_client_email;
    if(!email) return;
    document.querySelectorAll('a[href="auth.html"]').forEach(function(a){if(clean(a.textContent).toLowerCase().indexOf('увійти')>-1){a.textContent='Мій кабінет';a.href='client-dashboard.html';a.classList.add('nav-chip')}});
    document.querySelectorAll('header .nav a[href]').forEach(function(a){
      if(clean(a.textContent).toLowerCase().indexOf('вийти')>-1) return;
      a.addEventListener('click',function(){localStorage.psy_client_email=email});
    });
  }
  function clientPolish(){
    if(document.body.classList.contains('client') || location.pathname.indexOf('client-dashboard')>-1){
      document.body.classList.add('client-page');
      var c=null;try{var arr=JSON.parse(localStorage.getItem('psy_clients'))||[];c=arr.find(function(x){return x.email===localStorage.psy_client_email})}catch(e){}
      if(c&&c.name){var r=document.getElementById('clientReviewName');if(r&&!r.value)r.value=c.name;}
    }
  }
  function run(){renderFooter();renderContactsPage();renderCTA();clientSessionNav();clientPolish()}
  var old=window.renderAll;if(typeof old==='function'&&!window.__realFinalFix){window.__realFinalFix=true;window.renderAll=function(){old();run()}}
  document.addEventListener('DOMContentLoaded',function(){run();var n=0;var t=setInterval(function(){run();if(++n>20)clearInterval(t)},250);});
  new MutationObserver(function(){clearTimeout(window.__rfTimer);window.__rfTimer=setTimeout(run,50)}).observe(document.documentElement,{childList:true,subtree:true});
})();
