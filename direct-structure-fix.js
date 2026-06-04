
(function(){
  const DEFAULT_ADDRESSES = [
    {city:'Кривий Ріг', address:'вулиця Героїв АТО, 32', mapUrl:'https://www.google.com/maps/search/?api=1&query=%D0%9A%D1%80%D0%B8%D0%B2%D0%B8%D0%B9%20%D0%A0%D1%96%D0%B3%2C%20%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%93%D0%B5%D1%80%D0%BE%D1%97%D0%B2%20%D0%90%D0%A2%D0%9E%2032'},
    {city:'Київ', address:'вулиця Прорізна, 4', mapUrl:'https://www.google.com/maps/search/?api=1&query=%D0%9A%D0%B8%D1%97%D0%B2%2C%20%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%9F%D1%80%D0%BE%D1%80%D1%96%D0%B7%D0%BD%D0%B0%204'}
  ];

  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function write(k,v){localStorage.setItem(k, JSON.stringify(v))}
  function getAddresses(){
    const a=read('psy_offline_addresses', null);
    if(Array.isArray(a)&&a.length) return a;
    write('psy_offline_addresses', DEFAULT_ADDRESSES);
    return DEFAULT_ADDRESSES;
  }

  const icons = {
    telegram:'<svg viewBox="0 0 24 24"><path fill="white" d="M21.7 4.3 18.4 20c-.25 1.1-.9 1.35-1.82.84l-5.04-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.14 9.36-8.46c.41-.36-.09-.56-.63-.2L5.6 13.45.62 11.9c-1.08-.34-1.1-1.08.23-1.6L20.3 2.8c.9-.34 1.68.2 1.4 1.5Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24"><path fill="white" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 12 16.8a4.8 4.8 0 0 1 0-9.6Zm0 2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Zm5.05-2.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24"><path fill="white" d="M14 8.2V6.7c0-.72.48-.9.82-.9H17V2.1L14 2c-3.34 0-4.1 2.5-4.1 4.1v2.1H7v3.9h2.9V22H14v-9.9h3.45l.46-3.9H14Z"/></svg>',
    email:'<svg viewBox="0 0 24 24"><path fill="white" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2 8 5 8-5V7l-8 5-8-5v1.2Z"/></svg>',
    phone:'<svg viewBox="0 0 24 24"><path fill="white" d="M6.6 10.8c1.45 2.85 3.75 5.15 6.6 6.6l2.2-2.2c.28-.28.68-.36 1.04-.24 1.14.38 2.36.59 3.56.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.45c.55 0 1 .45 1 1 0 1.2.2 2.42.59 3.56.12.36.04.76-.24 1.04l-2.2 2.2Z"/></svg>',
    site:'<svg viewBox="0 0 24 24"><path fill="white" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm7.9 9h-3.1a15.3 15.3 0 0 0-1.3-5.1A8.03 8.03 0 0 1 19.9 11ZM12 4.1c.8 1.2 1.5 3.6 1.7 6.9h-3.4c.2-3.3.9-5.7 1.7-6.9ZM4.1 13h3.1c.1 1.9.5 3.6 1.3 5.1A8.03 8.03 0 0 1 4.1 13Zm3.1-2H4.1a8.03 8.03 0 0 1 4.4-5.1A15.3 15.3 0 0 0 7.2 11Zm2.1 2h5.4c-.3 4.3-1.5 6.9-2.7 6.9S9.6 17.3 9.3 13Zm5.4-2H9.3c.3-4.3 1.5-6.9 2.7-6.9s2.4 2.6 2.7 6.9Zm.8 7.1c.8-1.5 1.2-3.2 1.3-5.1h3.1a8.03 8.03 0 0 1-4.4 5.1Z"/></svg>'
  };

  function detect(row){
    const s=(clean(row.textContent)+' '+(row.getAttribute('href')||'')).toLowerCase();
    if(s.includes('instagram')) return ['instagram','Instagram'];
    if(s.includes('telegram')||s.includes('t.me')) return ['telegram','Telegram'];
    if(s.includes('facebook')||s.includes('fb.com')) return ['facebook','Facebook'];
    if(s.includes('@')||s.includes('mail')) return ['email','Email'];
    if(s.includes('+')||s.includes('тел')||/\d{6,}/.test(s)) return ['phone','Телефон'];
    return ['site','Сайт'];
  }

  function formatFooter(){
    document.querySelectorAll('.footer-contacts a').forEach(row=>{
      const [type,title]=detect(row);
      let value=clean(row.textContent)
        .replace(/[■▪●◆◼︎◾︎⬛︎□▫︎]/g,'')
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

  function initHomeSettings(){
    const form=document.getElementById('directHomeSettingsForm');
    if(!form || form.dataset.bound==='yes') return;
    form.dataset.bound='yes';
    const site=read('psy_site',{});
    form.querySelector('#directPsychologistName').value=site.psychologistName||'Анастасія Марчук';
    form.querySelector('#directHomeTitle').value=site.homeTitle||'Психотерапевт для важливих розмов';
    form.querySelector('#directHomeText').value=site.homeText||'';
    form.onsubmit=(e)=>{
      e.preventDefault();
      const next=read('psy_site',{});
      next.psychologistName=form.querySelector('#directPsychologistName').value.trim()||'Анастасія Марчук';
      next.homeTitle=form.querySelector('#directHomeTitle').value.trim();
      next.homeText=form.querySelector('#directHomeText').value.trim();
      write('psy_site',next);
      alert('Головну сторінку збережено');
    };
  }

  function renderAddressEditor(){
    const list=document.getElementById('directAddressList');
    if(!list) return;
    const arr=getAddresses();
    list.innerHTML=arr.map((a,i)=>`
      <div class="direct-address-card" data-index="${i}">
        <label>Місто<input class="direct-city" value="${esc(a.city||'')}"></label>
        <label>Адреса<input class="direct-address" value="${esc(a.address||'')}"></label>
        <label class="direct-map-label">Google Maps<input class="direct-map" value="${esc(a.mapUrl||'')}" placeholder="Можна залишити пустим"></label>
        <button type="button" class="direct-edit-address">Редагувати</button>
        <button type="button" class="direct-delete-address">Видалити</button>
      </div>
    `).join('');

    list.querySelectorAll('.direct-edit-address').forEach(btn=>{
      btn.onclick=()=>btn.closest('.direct-address-card').querySelector('input').focus();
    });
    list.querySelectorAll('.direct-delete-address').forEach(btn=>{
      btn.onclick=()=>{
        const idx=Number(btn.closest('.direct-address-card').dataset.index);
        const next=getAddresses().filter((_,i)=>i!==idx);
        write('psy_offline_addresses', next.length?next:DEFAULT_ADDRESSES);
        renderAddressEditor();
      };
    });
  }

  function initAddressSettings(){
    const add=document.getElementById('directAddAddress');
    const save=document.getElementById('directSaveAddresses');
    if(add && add.dataset.bound!=='yes'){
      add.dataset.bound='yes';
      add.onclick=()=>{
        const arr=getAddresses();
        arr.push({city:'',address:'',mapUrl:''});
        write('psy_offline_addresses',arr);
        renderAddressEditor();
      };
    }
    if(save && save.dataset.bound!=='yes'){
      save.dataset.bound='yes';
      save.onclick=()=>{
        const arr=Array.from(document.querySelectorAll('.direct-address-card')).map(card=>({
          city:card.querySelector('.direct-city').value.trim(),
          address:card.querySelector('.direct-address').value.trim(),
          mapUrl:card.querySelector('.direct-map').value.trim()
        })).filter(x=>x.city||x.address);
        write('psy_offline_addresses',arr.length?arr:DEFAULT_ADDRESSES);
        alert('Адреси збережено');
        renderAddressEditor();
      };
    }
    renderAddressEditor();
  }

  function restoreCTA(){
    let box=document.querySelector('.fixed-bottom-cta');
    if(!box){
      box=document.createElement('div');
      box.className='fixed-bottom-cta';
      document.body.appendChild(box);
    }
    const site=read('psy_site',{});
    const tg=site.telegramUrl || site.telegram || '#';
    box.innerHTML=`<a class="cta-book" href="services.html#booking">Записатись</a><a class="cta-telegram" href="${esc(tg)}" target="_blank">Telegram</a>`;
  }

  function cleanup(){
    document.querySelectorAll('#homeIdentitySettingsMaster,#offlineAddressSettingsMaster,#cleanHomeSettingsSection,#cleanContactAddressSection').forEach(x=>x.remove());
    document.querySelectorAll('.floating-actions,.float-actions,.sticky-actions,.sticky-cta,.quick-actions,.quick-contact,.fixed-cta,.fixed-buttons').forEach(x=>x.remove());
    if(document.querySelector('.admin-shell,.admin-sidebar')) document.body.classList.add('admin-page');
  }

  function run(){
    cleanup();
    formatFooter();
    restoreCTA();
    initHomeSettings();
    initAddressSettings();
  }

  const old=window.renderAll;
  if(typeof old==='function'&&!window.__directStructureFix){
    window.__directStructureFix=true;
    window.renderAll=function(){old();run();};
  }
  document.addEventListener('DOMContentLoaded',()=>{run();setTimeout(run,400);setTimeout(run,1200);});
})();
