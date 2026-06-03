
(function(){
  const esc = (s)=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  const icons = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 12 16.8a4.8 4.8 0 0 1 0-9.6Zm0 2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Zm5.05-2.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M21.7 4.3 18.4 20c-.25 1.1-.9 1.35-1.82.84l-5.04-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.14 9.36-8.46c.41-.36-.09-.56-.63-.2L5.6 13.45.62 11.9c-1.08-.34-1.1-1.08.23-1.6L20.3 2.8c.9-.34 1.68.2 1.4 1.5Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M14 8.2V6.7c0-.72.48-.9.82-.9H17V2.1L14 2c-3.34 0-4.1 2.5-4.1 4.1v2.1H7v3.9h2.9V22H14v-9.9h3.45l.46-3.9H14Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2 8 5 8-5V7l-8 5-8-5v1.2Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M6.6 10.8c1.45 2.85 3.75 5.15 6.6 6.6l2.2-2.2c.28-.28.68-.36 1.04-.24 1.14.38 2.36.59 3.56.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.45c.55 0 1 .45 1 1 0 1.2.2 2.42.59 3.56.12.36.04.76-.24 1.04l-2.2 2.2Z"/></svg>'
  };

  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function createSelectUI(select){
    if(!select || select.dataset.designCustomUi === 'yes') return;
    select.dataset.designCustomUi = 'yes';

    const wrap = document.createElement('div');
    wrap.className = 'custom-select-ui';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'custom-select-button';
    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    wrap.append(btn, menu);
    select.insertAdjacentElement('afterend', wrap);

    function render(){
      const selected = select.options[select.selectedIndex];
      btn.innerHTML = '<span>' + esc(selected ? selected.textContent.trim() : 'Оберіть') + '</span>';
      menu.innerHTML = Array.from(select.options).map(opt =>
        '<button type="button" class="custom-select-option ' + (opt.value === select.value ? 'active' : '') + '" data-value="' + esc(opt.value) + '">' + esc(opt.textContent.trim()) + '</button>'
      ).join('');
      menu.querySelectorAll('[data-value]').forEach(item=>{
        item.onclick = (e)=>{
          e.stopPropagation();
          select.value = item.dataset.value;
          select.dispatchEvent(new Event('change', {bubbles:true}));
          wrap.classList.remove('open');
          render();
        };
      });
    }

    btn.onclick = (e)=>{
      e.stopPropagation();
      document.querySelectorAll('.custom-select-ui.open').forEach(x=>{ if(x!==wrap) x.classList.remove('open'); });
      wrap.classList.toggle('open');
      render();
    };
    select.addEventListener('change', render);
    render();
  }

  function patchSocialIcons(){
    document.querySelectorAll('.social-icon-svg').forEach(el=>{
      const cls = el.classList;
      if(cls.contains('instagram')) el.innerHTML = icons.instagram;
      else if(cls.contains('telegram')) el.innerHTML = icons.telegram;
      else if(cls.contains('facebook')) el.innerHTML = icons.facebook;
      else if(cls.contains('email')) el.innerHTML = icons.email;
      else el.innerHTML = icons.phone;
    });
  }

  function addOfflineAddressesIfMissing(){
    if(!location.pathname.includes('contact')) return;
    if(document.getElementById('offlineAddressesSection')) return;
    const main = document.querySelector('main');
    if(!main) return;
    main.insertAdjacentHTML('beforeend', `
<section class="section offline-addresses-section" id="offlineAddressesSection">
  <div class="section-head reveal visible">
    <p class="eyebrow">Офлайн консультації</p>
    <h2>Адреси офлайн консультацій</h2>
    <p>Оберіть зручне місто. При натисканні відкриється Google Maps із точною адресою.</p>
  </div>
  <div class="offline-address-grid">
    <article class="offline-address-card reveal visible">
      <div class="map-preview"><span class="map-pin-icon" aria-hidden="true"></span><div><small>м. Кривий Ріг</small><strong>вулиця Героїв АТО, 32</strong></div></div>
      <div class="address-card-body"><h3>Кривий Ріг</h3><p>вулиця Героїв АТО, 32</p><a class="btn primary map-link" target="_blank" href="https://www.google.com/maps/search/?api=1&query=%D0%9A%D1%80%D0%B8%D0%B2%D0%B8%D0%B9%20%D0%A0%D1%96%D0%B3%2C%20%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%93%D0%B5%D1%80%D0%BE%D1%97%D0%B2%20%D0%90%D0%A2%D0%9E%2032">Відкрити карту</a></div>
    </article>
    <article class="offline-address-card reveal visible">
      <div class="map-preview"><span class="map-pin-icon" aria-hidden="true"></span><div><small>м. Київ</small><strong>вулиця Прорізна, 4</strong></div></div>
      <div class="address-card-body"><h3>Київ</h3><p>вулиця Прорізна, 4</p><a class="btn primary map-link" target="_blank" href="https://www.google.com/maps/search/?api=1&query=%D0%9A%D0%B8%D1%97%D0%B2%2C%20%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%9F%D1%80%D0%BE%D1%80%D1%96%D0%B7%D0%BD%D0%B0%204">Відкрити карту</a></div>
    </article>
  </div>
</section>`);
  }

  function fixTypography(){
    document.querySelectorAll('.about-facts-grid strong, .about-facts-grid span, .service-card h3, .service-card p, .professional-path-card p, .professional-path-card li, .home-availability-card *, .urgent-standalone-card *').forEach(el=>{
      el.style.wordBreak = 'normal';
      el.style.hyphens = 'none';
    });
  }

  function run(){
    createSelectUI(document.getElementById('bookingService'));
    createSelectUI(document.getElementById('bookingTime'));
    patchSocialIcons();
    addOfflineAddressesIfMissing();
    fixTypography();
  }

  const old = window.renderAll;
  if(typeof old === 'function' && !window.__designContactsFix){
    window.__designContactsFix = true;
    window.renderAll = function(){
      old();
      run();
    };
  }

  document.addEventListener('click', ()=>document.querySelectorAll('.custom-select-ui.open').forEach(x=>x.classList.remove('open')));
  document.addEventListener('DOMContentLoaded', ()=>{
    run();
    setTimeout(run, 300);
    setTimeout(run, 900);
  });
})();
