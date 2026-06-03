
(function(){
  const esc = (s)=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const read = (k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}};
  const write = (k,v)=>localStorage.setItem(k, JSON.stringify(v));

  const defaultAddresses = [
    {city:'Кривий Ріг', address:'вулиця Героїв АТО, 32', mapUrl:'https://www.google.com/maps/search/?api=1&query=%D0%9A%D1%80%D0%B8%D0%B2%D0%B8%D0%B9%20%D0%A0%D1%96%D0%B3%2C%20%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%93%D0%B5%D1%80%D0%BE%D1%97%D0%B2%20%D0%90%D0%A2%D0%9E%2032'},
    {city:'Київ', address:'вулиця Прорізна, 4', mapUrl:'https://www.google.com/maps/search/?api=1&query=%D0%9A%D0%B8%D1%97%D0%B2%2C%20%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%9F%D1%80%D0%BE%D1%80%D1%96%D0%B7%D0%BD%D0%B0%204'}
  ];

  function getAddresses(){
    const arr = read('psy_offline_addresses', null);
    if(Array.isArray(arr) && arr.length) return arr;
    write('psy_offline_addresses', defaultAddresses);
    return defaultAddresses;
  }

  function mapsUrl(city, address, mapUrl){
    if(mapUrl && mapUrl.trim()) return mapUrl.trim();
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((city||'') + ', ' + (address||''));
  }

  function renderPublicAddresses(){
    const section = document.getElementById('offlineAddressesSection');
    if(!section) return;
    const grid = section.querySelector('.offline-address-grid');
    if(!grid) return;

    const arr = getAddresses();
    grid.innerHTML = arr.map(item => `
      <article class="offline-address-card reveal visible">
        <div class="map-preview">
          <span class="map-pin-icon" aria-hidden="true"></span>
          <div>
            <small>м. ${esc(item.city)}</small>
            <strong>${esc(item.address)}</strong>
          </div>
        </div>
        <div class="address-card-body">
          <h3>${esc(item.city)}</h3>
          <p>${esc(item.address)}</p>
          <a class="btn primary map-link" target="_blank" href="${esc(mapsUrl(item.city,item.address,item.mapUrl))}">Відкрити карту</a>
        </div>
      </article>
    `).join('');
  }

  function renderAdminAddressSettings(){
    const list = document.getElementById('offlineAddressSettingsList');
    if(!list) return;
    const arr = getAddresses();

    list.className = 'offline-address-edit-list';
    list.innerHTML = arr.map((item, i) => `
      <div class="offline-address-edit-card" data-index="${i}">
        <label>Місто
          <input class="addr-city" value="${esc(item.city)}" placeholder="Київ">
        </label>
        <label>Адреса
          <input class="addr-address" value="${esc(item.address)}" placeholder="вулиця Прорізна, 4">
        </label>
        <label>Google Maps посилання
          <input class="addr-map" value="${esc(item.mapUrl||'')}" placeholder="Можна залишити пустим">
        </label>
        <button class="small-btn danger addr-delete" type="button">Видалити</button>
      </div>
    `).join('');

    list.querySelectorAll('.addr-delete').forEach(btn=>{
      btn.onclick = ()=>{
        const idx = Number(btn.closest('.offline-address-edit-card').dataset.index);
        const next = getAddresses().filter((_,i)=>i!==idx);
        write('psy_offline_addresses', next.length ? next : defaultAddresses);
        renderAdminAddressSettings();
        renderPublicAddresses();
      };
    });
  }

  function saveAdminAddresses(){
    const list = document.getElementById('offlineAddressSettingsList');
    if(!list) return;
    const arr = Array.from(list.querySelectorAll('.offline-address-edit-card')).map(card => ({
      city: card.querySelector('.addr-city').value.trim(),
      address: card.querySelector('.addr-address').value.trim(),
      mapUrl: card.querySelector('.addr-map').value.trim()
    })).filter(x => x.city || x.address);

    write('psy_offline_addresses', arr.length ? arr : defaultAddresses);
    renderAdminAddressSettings();
    renderPublicAddresses();
    alert('Адреси збережено');
  }

  function bindAdmin(){
    const add = document.getElementById('addOfflineAddressBtn');
    const save = document.getElementById('saveOfflineAddressesBtn');

    if(add && add.dataset.bound !== 'yes'){
      add.dataset.bound = 'yes';
      add.onclick = ()=>{
        const arr = getAddresses();
        arr.push({city:'', address:'', mapUrl:''});
        write('psy_offline_addresses', arr);
        renderAdminAddressSettings();
      };
    }

    if(save && save.dataset.bound !== 'yes'){
      save.dataset.bound = 'yes';
      save.onclick = saveAdminAddresses;
    }
  }

  function removeUnclearMiniWindow(){
    document.querySelectorAll('.home-availability-panel .availability-mini, .home-availability-panel .small-floating-card').forEach(el=>el.remove());
  }

  function run(){
    renderPublicAddresses();
    renderAdminAddressSettings();
    bindAdmin();
    removeUnclearMiniWindow();
  }

  const old = window.renderAll;
  if(typeof old === 'function' && !window.__wideAddressSettings){
    window.__wideAddressSettings = true;
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
