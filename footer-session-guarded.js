
(function(){
  if(window.__footerSessionGuardedLoaded) return;
  window.__footerSessionGuardedLoaded = true;

  let internal = false;
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}

  const icons={
    telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.7 4.3 18.4 20c-.25 1.1-.9 1.35-1.82.84l-5.04-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.14 9.36-8.46c.41-.36-.09-.56-.63-.2L5.6 13.45.62 11.9c-1.08-.34-1.1-1.08.23-1.6L20.3 2.8c.9-.34 1.68.2 1.4 1.5Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 12 16.8a4.8 4.8 0 0 1 0-9.6Zm0 2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Zm5.05-2.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8.2V6.7c0-.72.48-.9.82-.9H17V2.1L14 2c-3.34 0-4.1 2.5-4.1 4.1v2.1H7v3.9h2.9V22H14v-9.9h3.45l.46-3.9H14Z"/></svg>',
    email:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2 8 5 8-5V7l-8 5-8-5v1.2Z"/></svg>',
    phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8c1.45 2.85 3.75 5.15 6.6 6.6l2.2-2.2c.28-.28.68-.36 1.04-.24 1.14.38 2.36.59 3.56.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.45c.55 0 1 .45 1 1 0 1.2.2 2.42.59 3.56.12.36.04.76-.24 1.04l-2.2 2.2Z"/></svg>',
    site:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z"/></svg>'
  };

  function getSite(){
    try{ if(typeof site==='function') return site(); }catch(e){}
    return read('psy_site',{});
  }

  function getContacts(){
    try{
      if(typeof contacts==='function'){
        const arr=contacts();
        if(Array.isArray(arr)&&arr.length) return arr;
      }
    }catch(e){}
    return [
      {title:'Telegram',value:'@USERNAME',link:'https://t.me/USERNAME'},
      {title:'Email',value:'psychologist@example.com',link:'mailto:psychologist@example.com'},
      {title:'Instagram',value:'@USERNAME',link:'#'},
      {title:'Facebook',value:'Facebook',link:'#'},
      {title:'Телефон',value:'+380 (67) 737 71 92',link:'tel:+380677377192'}
    ];
  }

  function detect(c){
    const s=(clean(c.title)+' '+clean(c.value)+' '+clean(c.link)).toLowerCase();
    if(s.includes('instagram')) return ['instagram','Instagram'];
    if(s.includes('telegram')||s.includes('t.me')) return ['telegram','Telegram'];
    if(s.includes('facebook')||s.includes('fb.com')) return ['facebook','Facebook'];
    if(s.includes('@')||s.includes('mail')) return ['email','Email'];
    if(s.includes('+')||s.includes('тел')||/\d{6,}/.test(s)) return ['phone','Телефон'];
    return ['site','Сайт'];
  }

  function contactRow(c){
    const [type,label]=detect(c);
    const value=clean(c.value||c.title||label).replace(/[■▪●◆◼︎◾︎⬛︎□▫︎●•]/g,'');
    const link=clean(c.link||'#');
    const target=(link && link!=='#' && !link.startsWith('mailto:') && !link.startsWith('tel:'))?' target="_blank" rel="noopener"':'';
    return `<a class="guard-footer-contact" href="${esc(link||'#')}"${target}>
      <span class="guard-icon ${type}">${icons[type]||icons.site}</span>
      <span class="guard-label">${esc(label)}</span>
      <b class="guard-value">${esc(value)}</b>
    </a>`;
  }

  function normalizeFooter(){
    const footer=document.querySelector('.footer-contacts,#footerContacts');
    if(!footer) return;
    if(footer.dataset.guarded === 'yes' && footer.querySelector('.guard-footer-contact')) return;
    internal = true;
    footer.id='footerContacts';
    footer.classList.add('footer-contacts');
    footer.innerHTML=getContacts().map(contactRow).join('');
    footer.dataset.guarded='yes';
    internal = false;
  }

  function ensureFixedButtons(){
    internal = true;
    document.querySelectorAll('.floating-actions,.float-actions,.sticky-actions,.sticky-cta,.quick-actions,.quick-contact,.fixed-cta,.fixed-buttons,.fixed-bottom-cta:not(#guardFixedCta),#fixedBottomCta:not(#guardFixedCta),.f2-fixed-cta:not(#guardFixedCta)').forEach(el=>el.remove());

    let box=document.getElementById('guardFixedCta');
    if(!box){
      box=document.createElement('div');
      document.body.appendChild(box);
    }

    const s=getSite();
    const tg=s.telegramUrl||s.telegram||'https://t.me/USERNAME';

    box.id='guardFixedCta';
    box.className='guard-fixed-cta';
    box.innerHTML=`<a class="guard-book" href="services.html#booking">Записатись</a><a class="guard-telegram" href="${esc(tg)}" target="_blank" rel="noopener">Telegram</a>`;
    internal = false;
  }

  function keepClientSession(){
    const email=localStorage.getItem('psy_client_email');
    if(!email) return;

    document.querySelectorAll('a[href="auth.html"]').forEach(a=>{
      const t=clean(a.textContent).toLowerCase();
      if(t.includes('увійти')){
        a.textContent=a.classList.contains('nav-chip')?'Мій кабінет':'Кабінет';
        a.href='client-dashboard.html';
      }
    });

    document.querySelectorAll('a,button').forEach(el=>{
      const t=clean(el.textContent).toLowerCase();
      if(!t.includes('вийти')){
        const onclick=(el.getAttribute('onclick')||'').toLowerCase();
        if(onclick.includes('logout')||onclick.includes('signout')) el.removeAttribute('onclick');
      }
    });
  }

  function autofillReviewName(){
    const email=localStorage.getItem('psy_client_email');
    if(!email) return;
    let client=null;
    try{ client=(JSON.parse(localStorage.getItem('psy_clients'))||[]).find(x=>x.email===email); }catch(e){}
    if(!client||!client.name) return;
    document.querySelectorAll('#clientReviewName,#reviewName,input[name="reviewName"]').forEach(input=>{
      if(!input.value) input.value=client.name;
    });
  }

  function markClientPage(){
    if(location.pathname.includes('client-dashboard') || document.querySelector('.client-shell')){
      document.body.classList.add('client');
    }
  }

  function run(){
    normalizeFooter();
    ensureFixedButtons();
    keepClientSession();
    autofillReviewName();
    markClientPage();
  }

  let scheduled = false;
  function schedule(){
    if(internal || scheduled) return;
    scheduled = true;
    requestAnimationFrame(()=>{
      scheduled = false;
      run();
    });
  }

  const old=window.renderAll;
  if(typeof old==='function' && !window.__guardedRenderAll){
    window.__guardedRenderAll=true;
    window.renderAll=function(){
      old();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded',()=>{
    run();
    [100,300,700,1200,2000,3500,5000].forEach(t=>setTimeout(run,t));

    const obs = new MutationObserver(schedule);
    obs.observe(document.body, {childList:true, subtree:true});
  });

  window.addEventListener('pageshow', run);
  window.addEventListener('storage', run);
})();
