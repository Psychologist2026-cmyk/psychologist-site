
(function(){
  function currentPage(){
    const path = location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  function setActiveNav(){
    const page = currentPage();
    document.querySelectorAll('.nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('#')[0] || 'index.html';
      if(href === page || (page === '' && href === 'index.html')){
        a.classList.add('active-nav');
        a.setAttribute('aria-current','page');
      }
    });
  }

  function renderFooterIcons(){
    const box = document.getElementById('footerContacts');
    if(!box) return;
    let items = [];
    try {
      items = typeof contacts === 'function' ? contacts() : [];
    } catch(e) {}
    if(!items || !items.length){
      items = [
        {title:'Instagram', value:'Instagram', link:'#'},
        {title:'Telegram', value:'Telegram', link:'#'},
        {title:'Facebook', value:'Facebook', link:'#'},
        {title:'Телефон', value:'+380000000000', link:'tel:+380000000000'},
        {title:'Email', value:'psychologist@example.com', link:'mailto:psychologist@example.com'}
      ];
    }

    function typeOf(c){
      const s = ((c.title||'') + ' ' + (c.value||'') + ' ' + (c.link||'')).toLowerCase();
      if(s.includes('instagram')) return ['instagram','ig'];
      if(s.includes('telegram') || s.includes('t.me')) return ['telegram','tg'];
      if(s.includes('facebook') || s.includes('fb.com')) return ['facebook','f'];
      if(s.includes('mail') || s.includes('@')) return ['email','@'];
      if(s.includes('тел') || s.includes('phone') || s.includes('380') || s.includes('+')) return ['phone','☎'];
      return ['email','•'];
    }

    box.innerHTML = items.map(c => {
      const [cls, symbol] = typeOf(c);
      const label = c.value || c.title || 'Контакт';
      return `<a href="${esc(c.link||'#')}" target="_blank"><span class="social-icon ${cls}">${symbol}</span><b>${esc(label)}</b></a>`;
    }).join('');
  }

  function getSiteObj(){
    try { return JSON.parse(localStorage.getItem('psy_site')) || {}; } catch(e){ return {}; }
  }

  function renderPhotos(){
    const s = getSiteObj();
    const home = document.getElementById('homePsychologistPhoto');
    if(home){
      const url = s.homePhotoUrl || s.photoUrl || '';
      if(url) home.innerHTML = `<img src="${url}" alt="Фото психолога">`;
      home.classList.toggle('has-photo', !!url);
    }
    const about = document.getElementById('psychologistPhoto');
    if(about){
      const url = s.photoUrl || s.homePhotoUrl || '';
      if(url) about.innerHTML = `<img src="${url}" alt="Фото психолога">`;
      about.classList.toggle('has-photo', !!url);
    }
  }

  function aboutCustomWindows(){
    try { return JSON.parse(localStorage.getItem('psy_about_custom_windows')) || []; } catch(e){ return []; }
  }
  function saveAboutCustomWindows(arr){
    localStorage.setItem('psy_about_custom_windows', JSON.stringify(arr));
  }
  function seedAboutWindows(){
    if(localStorage.getItem('psy_about_custom_windows')) return;
    saveAboutCustomWindows([
      {id:'aw1', title:'З чим працює психолог', text:'Тривога, емоційне виснаження, самооцінка, стосунки, особисті кризи та складні життєві періоди.', order:1},
      {id:'aw2', title:'Методи роботи', text:'Індивідуальний підхід, підтримувальна розмова, аналіз запиту та поступове формування практичних кроків.', order:2},
      {id:'aw3', title:'Формат консультацій', text:'Онлайн у Zoom або офлайн за попереднім узгодженням. Час консультацій вказано за Києвом.', order:3}
    ]);
  }

  function renderAboutCustom(){
    seedAboutWindows();
    const publicBox = document.getElementById('aboutCustomWindows');
    const adminBox = document.getElementById('adminAboutCustomWindows');
    const arr = aboutCustomWindows().sort((a,b)=>(a.order||0)-(b.order||0));
    if(publicBox){
      publicBox.innerHTML = arr.map(w => `<article class="about-custom-card reveal visible"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></article>`).join('');
    }
    if(adminBox){
      adminBox.innerHTML = arr.map((w,i) => `<div class="list-item"><strong>${esc(w.title)}</strong><p>${esc(w.text)}</p><div class="item-actions"><button class="small-btn" onclick="moveAboutWindow(${i},-1)">↑</button><button class="small-btn" onclick="moveAboutWindow(${i},1)">↓</button><button class="small-btn" onclick="editAboutWindow(${i})">Редагувати</button><button class="small-btn danger" onclick="deleteAboutWindow(${i})">Видалити</button></div></div>`).join('');
    }
  }

  window.editAboutWindow = function(i){
    const arr = aboutCustomWindows().sort((a,b)=>(a.order||0)-(b.order||0));
    const title = prompt('Назва вікна', arr[i].title);
    if(!title) return;
    const text = prompt('Опис', arr[i].text || '') || '';
    arr[i].title = title;
    arr[i].text = text;
    saveAboutCustomWindows(arr);
    renderAboutCustom();
  };

  window.deleteAboutWindow = function(i){
    const arr = aboutCustomWindows().sort((a,b)=>(a.order||0)-(b.order||0));
    arr.splice(i,1);
    arr.forEach((x,k)=>x.order=k+1);
    saveAboutCustomWindows(arr);
    renderAboutCustom();
  };

  window.moveAboutWindow = function(i,dir){
    const arr = aboutCustomWindows().sort((a,b)=>(a.order||0)-(b.order||0));
    const j = i + dir;
    if(j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    arr.forEach((x,k)=>x.order=k+1);
    saveAboutCustomWindows(arr);
    renderAboutCustom();
  };

  function bindAboutWindowForm(){
    const form = document.getElementById('aboutCustomWindowForm');
    if(!form || form.dataset.bound === 'yes') return;
    form.dataset.bound = 'yes';
    form.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('aboutCustomTitle')?.value.trim();
      const text = document.getElementById('aboutCustomText')?.value.trim();
      if(!title) return;
      const arr = aboutCustomWindows();
      arr.push({id: 'aw' + Date.now(), title, text, order: arr.length + 1});
      saveAboutCustomWindows(arr);
      form.reset();
      renderAboutCustom();
    });
  }

  function fixServicesSeed(){
    if(!localStorage.getItem('psy_service_categories')){
      localStorage.setItem('psy_service_categories', JSON.stringify([]));
    }
  }

  const oldRenderAll = window.renderAll || null;
  if(typeof oldRenderAll === 'function' && !window.__reviewFinalPatch){
    window.__reviewFinalPatch = true;
    window.renderAll = function(){
      oldRenderAll();
      setActiveNav();
      renderFooterIcons();
      renderPhotos();
      renderAboutCustom();
      bindAboutWindowForm();
      fixServicesSeed();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    renderFooterIcons();
    renderPhotos();
    renderAboutCustom();
    bindAboutWindowForm();
    fixServicesSeed();
  });

  setTimeout(() => {
    setActiveNav();
    renderFooterIcons();
    renderPhotos();
    renderAboutCustom();
    bindAboutWindowForm();
  }, 300);
})();
