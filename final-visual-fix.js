
(function(){
  const esc = (s)=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const read = (k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}};
  const write = (k,v)=>localStorage.setItem(k, JSON.stringify(v));

  const icons = {
    instagram: '<svg viewBox="0 0 24 24"><path fill="white" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 12 16.8a4.8 4.8 0 0 1 0-9.6Zm0 2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Zm5.05-2.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path fill="white" d="M21.7 4.3 18.4 20c-.25 1.1-.9 1.35-1.82.84l-5.04-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.14 9.36-8.46c.41-.36-.09-.56-.63-.2L5.6 13.45.62 11.9c-1.08-.34-1.1-1.08.23-1.6L20.3 2.8c.9-.34 1.68.2 1.4 1.5Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path fill="white" d="M14 8.2V6.7c0-.72.48-.9.82-.9H17V2.1L14 2c-3.34 0-4.1 2.5-4.1 4.1v2.1H7v3.9h2.9V22H14v-9.9h3.45l.46-3.9H14Z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><path fill="white" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2 8 5 8-5V7l-8 5-8-5v1.2Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path fill="white" d="M6.6 10.8c1.45 2.85 3.75 5.15 6.6 6.6l2.2-2.2c.28-.28.68-.36 1.04-.24 1.14.38 2.36.59 3.56.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.45c.55 0 1 .45 1 1 0 1.2.2 2.42.59 3.56.12.36.04.76-.24 1.04l-2.2 2.2Z"/></svg>',
    site: '<svg viewBox="0 0 24 24"><path fill="white" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm7.9 9h-3.1a15.3 15.3 0 0 0-1.3-5.1A8.03 8.03 0 0 1 19.9 11ZM12 4.1c.8 1.2 1.5 3.6 1.7 6.9h-3.4c.2-3.3.9-5.7 1.7-6.9ZM4.1 13h3.1c.1 1.9.5 3.6 1.3 5.1A8.03 8.03 0 0 1 4.1 13Zm3.1-2H4.1a8.03 8.03 0 0 1 4.4-5.1A15.3 15.3 0 0 0 7.2 11Zm2.1 2h5.4c-.3 4.3-1.5 6.9-2.7 6.9S9.6 17.3 9.3 13Zm5.4-2H9.3c.3-4.3 1.5-6.9 2.7-6.9s2.4 2.6 2.7 6.9Zm.8 7.1c.8-1.5 1.2-3.2 1.3-5.1h3.1a8.03 8.03 0 0 1-4.4 5.1Z"/></svg>'
  };

  function iconType(text){
    const s = String(text||'').toLowerCase();
    if(s.includes('instagram')) return 'instagram';
    if(s.includes('telegram') || s.includes('t.me')) return 'telegram';
    if(s.includes('facebook') || s.includes('fb.com')) return 'facebook';
    if(s.includes('@') || s.includes('mail')) return 'email';
    if(s.includes('+') || s.includes('тел')) return 'phone';
    return 'site';
  }

  function patchContactsIcons(){
    document.querySelectorAll('.contact-card, .contact-item, .contact-row').forEach(card=>{
      if(card.querySelector('.contact-icon-real')) return;
      const type = iconType(card.textContent);
      const span = document.createElement('span');
      span.className = 'contact-icon-real ' + type;
      span.innerHTML = icons[type] || icons.site;
      card.prepend(span);
    });

    document.querySelectorAll('.social-icon-svg').forEach(el=>{
      let type = 'phone';
      if(el.classList.contains('instagram')) type='instagram';
      else if(el.classList.contains('telegram')) type='telegram';
      else if(el.classList.contains('facebook')) type='facebook';
      else if(el.classList.contains('email')) type='email';
      else if(el.classList.contains('site')) type='site';
      el.innerHTML = icons[type] || icons.phone;
    });
  }

  function bindHomeIdentity(){
    const s = read('psy_site', {});
    const name = document.getElementById('settingPsychologistName');
    const title = document.getElementById('settingHomeTitle');
    const text = document.getElementById('settingHomeText');
    const save = document.getElementById('saveHomeIdentityBtn');

    if(name && !name.dataset.loaded){
      name.dataset.loaded = 'yes';
      name.value = s.psychologistName || 'Анастасія Марчук';
    }
    if(title && !title.dataset.loaded){
      title.dataset.loaded = 'yes';
      title.value = s.homeTitle || 'Психотерапевт для важливих розмов';
    }
    if(text && !text.dataset.loaded){
      text.dataset.loaded = 'yes';
      text.value = s.homeText || '';
    }
    if(save && save.dataset.bound !== 'yes'){
      save.dataset.bound = 'yes';
      save.onclick = ()=>{
        const next = read('psy_site', {});
        next.psychologistName = name.value.trim() || 'Анастасія Марчук';
        next.homeTitle = title.value.trim() || next.homeTitle || '';
        next.homeText = text.value.trim() || next.homeText || '';
        write('psy_site', next);
        document.querySelectorAll('[data-site="psychologistName"], #homePsychologistName').forEach(el=>el.textContent = next.psychologistName);
        document.querySelectorAll('[data-site="homeTitle"]').forEach(el=>el.textContent = next.homeTitle);
        document.querySelectorAll('[data-site="homeText"]').forEach(el=>el.textContent = next.homeText);
        alert('Головну сторінку збережено');
      };
    }
  }

  function fixServiceSpacing(){
    document.querySelectorAll('.service-card.urgent-service').forEach(card=>{
      card.style.paddingTop = '68px';
    });
  }

  function run(){
    patchContactsIcons();
    bindHomeIdentity();
    fixServiceSpacing();
  }

  const old = window.renderAll;
  if(typeof old === 'function' && !window.__finalVisualFix){
    window.__finalVisualFix = true;
    window.renderAll = function(){
      old();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    run();
    setTimeout(run, 300);
    setTimeout(run, 900);
  });
})();
