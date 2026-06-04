
(function(){
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function write(k,v){localStorage.setItem(k, JSON.stringify(v))}

  const icons = {
    telegram:'<svg viewBox="0 0 24 24"><path fill="white" d="M21.7 4.3 18.4 20c-.25 1.1-.9 1.35-1.82.84l-5.04-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.14 9.36-8.46c.41-.36-.09-.56-.63-.2L5.6 13.45.62 11.9c-1.08-.34-1.1-1.08.23-1.6L20.3 2.8c.9-.34 1.68.2 1.4 1.5Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24"><path fill="white" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 12 16.8a4.8 4.8 0 0 1 0-9.6Zm0 2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Zm5.05-2.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24"><path fill="white" d="M14 8.2V6.7c0-.72.48-.9.82-.9H17V2.1L14 2c-3.34 0-4.1 2.5-4.1 4.1v2.1H7v3.9h2.9V22H14v-9.9h3.45l.46-3.9H14Z"/></svg>',
    email:'<svg viewBox="0 0 24 24"><path fill="white" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2 8 5 8-5V7l-8 5-8-5v1.2Z"/></svg>',
    phone:'<svg viewBox="0 0 24 24"><path fill="white" d="M6.6 10.8c1.45 2.85 3.75 5.15 6.6 6.6l2.2-2.2c.28-.28.68-.36 1.04-.24 1.14.38 2.36.59 3.56.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.45c.55 0 1 .45 1 1 0 1.2.2 2.42.59 3.56.12.36.04.76-.24 1.04l-2.2 2.2Z"/></svg>',
    site:'<svg viewBox="0 0 24 24"><path fill="white" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm7.9 9h-3.1a15.3 15.3 0 0 0-1.3-5.1A8.03 8.03 0 0 1 19.9 11ZM12 4.1c.8 1.2 1.5 3.6 1.7 6.9h-3.4c.2-3.3.9-5.7 1.7-6.9ZM4.1 13h3.1c.1 1.9.5 3.6 1.3 5.1A8.03 8.03 0 0 1 4.1 13Zm3.1-2H4.1a8.03 8.03 0 0 1 4.4-5.1A15.3 15.3 0 0 0 7.2 11Zm2.1 2h5.4c-.3 4.3-1.5 6.9-2.7 6.9S9.6 17.3 9.3 13Zm5.4-2H9.3c.3-4.3 1.5-6.9 2.7-6.9s2.4 2.6 2.7 6.9Zm.8 7.1c.8-1.5 1.2-3.2 1.3-5.1h3.1a8.03 8.03 0 0 1-4.4 5.1Z"/></svg>'
  };

  function typeOf(row){
    const s=(clean(row.textContent)+' '+(row.getAttribute('href')||'')).toLowerCase();
    if(s.includes('instagram')) return ['instagram','Instagram'];
    if(s.includes('telegram')||s.includes('t.me')) return ['telegram','Telegram'];
    if(s.includes('facebook')||s.includes('fb.com')) return ['facebook','Facebook'];
    if(s.includes('@')||s.includes('mail')) return ['email','Email'];
    if(s.includes('+')||s.includes('тел')||/\d{6,}/.test(s)) return ['phone','Телефон'];
    return ['site','Сайт'];
  }

  function fixFooterContacts(){
    document.querySelectorAll('.footer-contacts a').forEach(row=>{
      const [type,title]=typeOf(row);
      let value=clean(row.textContent)
        .replace(/[■▪●◆◼︎◾︎⬛︎□▫︎●•]/g,'')
        .replace(/^(instagram|telegram|facebook|email|телефон|сайт)[:\s-]*/i,'')
        .trim();

      if(!value){
        if(type==='telegram') value='@USERNAME';
        else if(type==='email') value='psychologist@example.com';
        else if(type==='phone') value='+380000000000';
        else if(type==='instagram') value='@USERNAME';
        else value=title;
      }

      row.innerHTML=`<span class="social-icon-svg ${type}">${icons[type]||icons.site}</span><span class="contact-title-line">${title}</span><b class="contact-value-line">${esc(value)}</b>`;
      if(type==='email') row.href='mailto:'+value;
      if(type==='phone') row.href='tel:'+value.replace(/[^\d+]/g,'');
    });
  }

  function restoreFixedCTA(){
    let box=document.querySelector('.fixed-bottom-cta');
    if(!box){
      box=document.createElement('div');
      box.className='fixed-bottom-cta';
      document.body.appendChild(box);
    }
    const site=read('psy_site',{});
    const tg=site.telegramUrl || site.telegram || '#';
    box.innerHTML=`<a class="cta-book" href="services.html#booking">Записатись</a><a class="cta-telegram" href="${esc(tg)}" target="_blank" rel="noopener">Telegram</a>`;
  }

  function removeOldFloaters(){
    document.querySelectorAll('.floating-actions,.float-actions,.sticky-actions,.sticky-cta,.quick-actions,.quick-contact,.fixed-cta,.fixed-buttons').forEach(x=>x.remove());
  }

  function detectClient(){
    if(document.querySelector('.client-dashboard,#clientDashboard,.client-sidebar,.client-shell,.client-layout') || location.pathname.includes('client')) {
      document.body.classList.add('client-page');
    }
  }

  function preserveClientSessionLinks(){
    if(!document.body.classList.contains('client-page')) return;
    const clientKeys=['psy_current_client','psy_client','psy_client_session','currentClient'];
    const hasClient=clientKeys.some(k=>localStorage.getItem(k));
    if(!hasClient) return;

    document.querySelectorAll('a[href]').forEach(a=>{
      const href=a.getAttribute('href')||'';
      const text=clean(a.textContent).toLowerCase();
      if(text.includes('вийти')) return;
      if(/^(index|about|services|certificates|reviews|faq|contacts)\.html/.test(href) || href==='/' || href==='index.html'){
        a.addEventListener('click',()=> {
          localStorage.setItem('psy_keep_client_session','1');
        });
      }
    });
  }

  function patchLogoutOnly(){
    // Avoid accidental logout by links other than explicit "Вийти"
    document.querySelectorAll('a,button').forEach(el=>{
      const t=clean(el.textContent).toLowerCase();
      if(!t.includes('вийти')) {
        const onclick=el.getAttribute('onclick')||'';
        if(onclick.toLowerCase().includes('logout') || onclick.toLowerCase().includes('signout')) {
          el.removeAttribute('onclick');
        }
      }
    });
  }

  function autofillReviewName(){
    const client = read('psy_current_client', null) || read('psy_client', null) || read('currentClient', null) || {};
    const name = client.name || client.displayName || localStorage.getItem('psy_client_name') || '';
    if(!name) return;
    document.querySelectorAll('#reviewName,input[name="reviewName"], input[name="name"]').forEach(input=>{
      const formText=clean(input.closest('form,section,div')?.textContent||'').toLowerCase();
      if(formText.includes('відгук') || location.pathname.includes('review')) {
        if(!input.value) input.value=name;
      }
    });
  }

  function styleFileInputs(){
    document.querySelectorAll('input[type="file"]').forEach(input=>{
      input.classList.add('styled-file-input');
    });
  }

  function run(){
    removeOldFloaters();
    fixFooterContacts();
    restoreFixedCTA();
    detectClient();
    preserveClientSessionLinks();
    patchLogoutOnly();
    autofillReviewName();
    styleFileInputs();
  }

  const old=window.renderAll;
  if(typeof old==='function'&&!window.__clientFooterPolish){
    window.__clientFooterPolish=true;
    window.renderAll=function(){old();run();};
  }
  document.addEventListener('DOMContentLoaded',()=>{run();setTimeout(run,400);setTimeout(run,1200);setTimeout(run,2200);});
})();
