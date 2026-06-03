
(function(){
  function esc2(s){
    return String(s || '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }
  function read(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; }
  }
  function write(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function pad(n){ return String(n).padStart(2,'0'); }
  function localISO(d){ return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
  function todayLocal(){ return localISO(new Date()); }
  function tomorrowISO(){ var d = new Date(); d.setDate(d.getDate()+1); return localISO(d); }
  function formatUA(iso){
    var p = String(iso || '').split('-');
    return p.length === 3 ? p[2] + '-' + p[1] + '-' + p[0] : iso;
  }
  window.formatDateUA = formatUA;

  var PLESO_SEED_VERSION = 'review_final_v1';

  function seedReviewContent(){
    if(localStorage.getItem('psy_review_final_seed') === PLESO_SEED_VERSION) return;

    var siteData = read('psy_site', {});
    siteData.psychologistName = siteData.psychologistName && siteData.psychologistName !== 'Імʼя Психолога' ? siteData.psychologistName : 'Марчук Анастасія';
    siteData.homeTitle = 'Психотерапевт для важливих розмов';
    siteData.homeText = 'Підтримка при тривозі, стресі, емоційному вигоранні, депресивних станах, адаптації до змін і труднощах у стосунках.';
    siteData.aboutIntro = 'Дипломований спеціаліст, практикуючий психотерапевт.';
    siteData.aboutTitle = 'Професійний підхід';
    siteData.aboutText = 'Анастасія допомагає клієнтам краще розуміти свої стани, знаходити внутрішні ресурси й поступово проходити складні періоди. У роботі поєднує уважне слухання, творчі методи, глибинне дослідження переживань і фокус на реальних змінах.';
    siteData.aboutBulletsText = 'Індивідуальні консультації для дорослих\nРобота з тривогою, стресом і вигоранням\nПідтримка у стосунках та адаптації до змін\nКонфіденційний формат';
    siteData.homeTagsText = 'Конфіденційно\nОнлайн\nОфлайн\nZoom';
    write('psy_site', siteData);

    write('psy_about_facts', [
      {label:'Вік', value:'41', order:1},
      {label:'Досвід', value:'14 років', order:2},
      {label:'Мови', value:'Українська, російська', order:3},
      {label:'Формат', value:'Індивідуальна терапія', order:4}
    ]);

    write('psy_about_custom_windows', [
      {id:'aw1', title:'Основна експертиза', text:'Стосунки з партнером, стрес, тривога та страх, адаптація до нових умов життя, депресивні стани.', order:1},
      {id:'aw2', title:'Методи роботи', text:'Арт-терапія, психодинамічний і системний підхід, екзистенційний аналіз та логотерапія.', order:2},
      {id:'aw3', title:'Освіта', text:'Криворізький Державний Педагогічний університет. Спеціальність: практична психологія. Спеціалізація: практичний психолог.', order:3},
      {id:'aw4', title:'Особливості терапії', text:'Багато уваги до переживань клієнта, підтримувальний темп, пошук опори, гумор і творчі методи там, де це доречно.', order:4}
    ]);

    var types = [
      {id:'type_personal', title:'Персональна терапія', description:'Індивідуальні консультації для дорослих клієнтів.', urgent:false, order:1},
      {id:'type_urgent', title:'Термінові консультації', description:'Запит на консультацію сьогодні або узгодження часу через Telegram.', urgent:true, order:2}
    ];
    write('psy_service_categories', types);

    var existingServices = read('psy_services', []);
    var nextServices = [
      {id:'srv_personal', title:'Індивідуальна консультація', category:'Персональна терапія', format:'Онлайн / офлайн', duration:'50 хв', price:1500, text:'Особиста зустріч для роботи з вашим запитом.'},
      {id:'srv_urgent', title:'Термінова консультація', category:'Термінові консультації', format:'Онлайн', duration:'50 хв', price:3000, text:'Для ситуацій, коли консультація потрібна якнайшвидше. Потребує підтвердження психолога.'}
    ];
    if(!existingServices || !existingServices.length || existingServices.some(function(s){ return !s.category; })){
      write('psy_services', nextServices);
    }

    localStorage.setItem('psy_review_final_seed', PLESO_SEED_VERSION);
  }

  function serviceTypes(){
    var arr = read('psy_service_categories', []);
    if(!arr.length){
      arr = [
        {id:'type_personal', title:'Персональна терапія', description:'Індивідуальні консультації.', urgent:false, order:1},
        {id:'type_urgent', title:'Термінові консультації', description:'Консультації сьогодні після підтвердження психолога.', urgent:true, order:2}
      ];
      write('psy_service_categories', arr);
    }
    arr.forEach(function(t,i){
      if(t.order === undefined) t.order = i + 1;
      if(t.urgent === undefined) t.urgent = String(t.title || '').toLowerCase().includes('термін');
    });
    write('psy_service_categories', arr);
    return arr.sort(function(a,b){ return (a.order || 0) - (b.order || 0); });
  }
  function saveServiceTypes(arr){
    arr.forEach(function(t,i){ t.order = i + 1; });
    write('psy_service_categories', arr);
  }
  function allServices(){
    return typeof services === 'function' ? services() : read('psy_services', []);
  }
  function saveServices(arr){ write('psy_services', arr); }
  function typeForService(service){
    var types = serviceTypes();
    return types.find(function(t){ return t.title === service.category; }) || null;
  }
  function isUrgentService(service){
    if(!service) return false;
    var type = typeForService(service);
    return !!(type && type.urgent) || String(service.title || '').toLowerCase().includes('термін') || String(service.category || '').toLowerCase().includes('термін');
  }
  window.serviceIsUrgent = isUrgentService;

  function setActiveNav(){
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function(a){
      var href = (a.getAttribute('href') || '').split('#')[0] || 'index.html';
      if(href === page || (page === '' && href === 'index.html')){
        a.classList.add('active-nav');
        a.setAttribute('aria-current','page');
      }
    });
  }

  var icons = {
    instagram: '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id="igG" cx="30%" cy="110%" r="120%"><stop offset="0" stop-color="#feda75"/><stop offset=".28" stop-color="#fa7e1e"/><stop offset=".55" stop-color="#d62976"/><stop offset=".76" stop-color="#962fbf"/><stop offset="1" stop-color="#4f5bd5"/></radialGradient></defs><rect width="40" height="40" rx="12" fill="url(#igG)"/><rect x="10" y="10" width="20" height="20" rx="6" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="20" cy="20" r="5" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="26" cy="14" r="1.7" fill="#fff"/></svg>',
    telegram: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#2AABEE"/><path d="M30.5 10.8 26 31c-.3 1.3-1.1 1.6-2.2 1l-6.1-4.5-2.9 2.8c-.3.3-.6.6-1.2.6l.4-6.2 11.4-10.3c.5-.4-.1-.7-.8-.3L10.5 23l-6-1.9c-1.3-.4-1.3-1.3.3-1.9l23.4-9c1.1-.4 2.1.3 2.3.6Z" fill="#fff"/></svg>',
    facebook: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#1877F2"/><path d="M23.5 13.2h3V8.4c-.5-.1-2.2-.2-4.2-.2-4.2 0-7 2.5-7 7.2v4h-4.7v5.4h4.7V38h5.8V24.8h4.8l.8-5.4h-5.6v-3.5c0-1.6.4-2.7 2.4-2.7Z" fill="#fff"/></svg>',
    email: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#4b2d20"/><path d="M10 13h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2Zm1.5 3 8.5 6 8.5-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#4b2d20"/><path d="M14 9.5 18 14l-2.3 3c1.4 2.8 3.6 5 6.3 6.3l3-2.3 4.5 4c.5.5.6 1.2.2 1.8-1 1.5-2.7 3.2-4.9 3.2-5.8 0-14.8-9-14.8-14.8 0-2.2 1.7-3.9 3.2-4.9.6-.4 1.3-.3 1.8.2Z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function iconType(c){
    var s = ((c.title||'') + ' ' + (c.value||'') + ' ' + (c.link||'')).toLowerCase();
    if(s.includes('instagram')) return 'instagram';
    if(s.includes('telegram') || s.includes('t.me')) return 'telegram';
    if(s.includes('facebook') || s.includes('fb.com')) return 'facebook';
    if(s.includes('@') || s.includes('mail')) return 'email';
    if(s.includes('тел') || s.includes('phone') || s.includes('+380')) return 'phone';
    return 'email';
  }

  function renderFooter(){
    var box = document.getElementById('footerContacts');
    if(!box) return;
    var items = typeof contacts === 'function' ? contacts() : read('psy_contacts', []);
    if(!items.length){
      items = [
        {title:'Instagram', value:'Instagram', link:'#'},
        {title:'Telegram', value:'Telegram', link:'#'},
        {title:'Facebook', value:'Facebook', link:'#'},
        {title:'Телефон', value:'+380000000000', link:'tel:+380000000000'},
        {title:'Email', value:'psychologist@example.com', link:'mailto:psychologist@example.com'}
      ];
    }
    box.innerHTML = items.map(function(c){
      var type = iconType(c);
      var label = c.value || c.title || 'Контакт';
      return '<a href="' + esc2(c.link || '#') + '" target="_blank"><span class="social-icon-svg ' + type + '">' + icons[type] + '</span><b>' + esc2(label) + '</b></a>';
    }).join('');
  }

  function siteObj(){ return read('psy_site', {}); }
  function saveSiteObj(s){ write('psy_site', s); }
  function renderPhotos(){
    var s = siteObj();
    var home = document.getElementById('homePsychologistPhoto');
    if(home){
      var homeUrl = s.homePhotoUrl || s.photoUrl || '';
      if(homeUrl) home.innerHTML = '<img src="' + homeUrl + '" alt="Фото психолога">';
      home.classList.toggle('has-photo', !!homeUrl);
    }
    var about = document.getElementById('psychologistPhoto');
    if(about){
      var aboutUrl = s.photoUrl || s.homePhotoUrl || '';
      if(aboutUrl) about.innerHTML = '<img src="' + aboutUrl + '" alt="Фото психолога">';
      about.classList.toggle('has-photo', !!aboutUrl);
    }
  }
  async function fileData(input){
    var file = input.files && input.files[0];
    if(!file) return '';
    return await new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(){ resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function savedHint(input){
    var el = document.getElementById(input.id + 'Status');
    if(!el){
      el = document.createElement('small');
      el.id = input.id + 'Status';
      el.className = 'photo-save-status';
      input.insertAdjacentElement('afterend', el);
    }
    el.textContent = 'Фото збережено';
  }
  function bindPhoto(id, key, alsoKey){
    var input = document.getElementById(id);
    if(!input || input.dataset.stablePhoto === 'yes') return;
    input.dataset.stablePhoto = 'yes';
    input.addEventListener('change', async function(){
      var data = await fileData(input);
      if(!data) return;
      var s = siteObj();
      s[key] = data;
      if(alsoKey) s[alsoKey] = data;
      saveSiteObj(s);
      savedHint(input);
      renderPhotos();
      if(typeof renderAll === 'function') renderAll();
    });
  }

  function aboutWindows(){
    return read('psy_about_custom_windows', []);
  }
  function saveAboutWindows(arr){ write('psy_about_custom_windows', arr); }
  function renderAboutWindows(){
    var publicBox = document.getElementById('aboutCustomWindows');
    var adminBox = document.getElementById('adminAboutCustomWindows');
    var arr = aboutWindows().sort(function(a,b){ return (a.order||0)-(b.order||0); });
    if(publicBox){
      publicBox.innerHTML = arr.map(function(w){
        return '<article class="about-custom-card reveal visible"><h3>' + esc2(w.title) + '</h3><p>' + esc2(w.text) + '</p></article>';
      }).join('');
    }
    if(adminBox){
      adminBox.innerHTML = arr.map(function(w,i){
        return '<div class="list-item"><strong>' + esc2(w.title) + '</strong><p>' + esc2(w.text) + '</p><div class="item-actions"><button class="small-btn" onclick="moveAboutWindowFinal(' + i + ',-1)">↑</button><button class="small-btn" onclick="moveAboutWindowFinal(' + i + ',1)">↓</button><button class="small-btn" onclick="editAboutWindowFinal(' + i + ')">Редагувати</button><button class="small-btn danger" onclick="deleteAboutWindowFinal(' + i + ')">Видалити</button></div></div>';
      }).join('');
    }
  }
  window.editAboutWindowFinal = function(i){
    var arr = aboutWindows().sort(function(a,b){ return (a.order||0)-(b.order||0); });
    var title = prompt('Назва вікна', arr[i].title);
    if(!title) return;
    var text = prompt('Опис', arr[i].text || '') || '';
    arr[i].title = title;
    arr[i].text = text;
    saveAboutWindows(arr);
    renderAboutWindows();
  };
  window.deleteAboutWindowFinal = function(i){
    var arr = aboutWindows().sort(function(a,b){ return (a.order||0)-(b.order||0); });
    arr.splice(i,1);
    arr.forEach(function(x,k){ x.order = k + 1; });
    saveAboutWindows(arr);
    renderAboutWindows();
  };
  window.moveAboutWindowFinal = function(i,dir){
    var arr = aboutWindows().sort(function(a,b){ return (a.order||0)-(b.order||0); });
    var j = i + dir;
    if(j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    arr.forEach(function(x,k){ x.order = k + 1; });
    saveAboutWindows(arr);
    renderAboutWindows();
  };
  function bindAboutForm(){
    var form = document.getElementById('aboutCustomWindowForm');
    if(!form || form.dataset.stableBound === 'yes') return;
    form.dataset.stableBound = 'yes';
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var title = document.getElementById('aboutCustomTitle').value.trim();
      var text = document.getElementById('aboutCustomText').value.trim();
      if(!title) return;
      var arr = aboutWindows();
      arr.push({id:'aw' + Date.now(), title:title, text:text, order:arr.length + 1});
      saveAboutWindows(arr);
      form.reset();
      renderAboutWindows();
    });
  }

  window.currentServiceCategory = window.currentServiceCategory || 'all';

  function renderServiceAdmin(){
    var select = document.getElementById('serviceCategory');
    var list = document.getElementById('adminServiceCategories');
    var types = serviceTypes();

    if(select){
      select.innerHTML = types.map(function(t){
        return '<option value="' + esc2(t.title) + '">' + esc2(t.title) + (t.urgent ? ' · терміновий' : '') + '</option>';
      }).join('');
    }
    if(list){
      list.innerHTML = types.map(function(t,i){
        return '<div class="list-item"><strong>' + esc2(t.title) + (t.urgent ? ' · терміновий' : '') + '</strong><p>' + esc2(t.description || '') + '</p><div class="item-actions"><button class="small-btn" onclick="moveServiceTypeFinal(' + i + ',-1)">↑</button><button class="small-btn" onclick="moveServiceTypeFinal(' + i + ',1)">↓</button><button class="small-btn" onclick="editServiceTypeFinal(' + i + ')">Редагувати</button><button class="small-btn danger" onclick="deleteServiceTypeFinal(' + i + ')">Видалити</button></div></div>';
      }).join('');
    }
  }
  window.editServiceTypeFinal = function(i){
    var arr = serviceTypes();
    var old = arr[i];
    var title = prompt('Назва типу консультацій', old.title);
    if(!title) return;
    var desc = prompt('Опис типу', old.description || '') || '';
    var urgent = confirm('Цей тип терміновий? OK = так, Cancel = ні');
    var oldTitle = old.title;
    old.title = title;
    old.description = desc;
    old.urgent = urgent;
    saveServiceTypes(arr);
    var serv = allServices();
    serv.forEach(function(s){ if(s.category === oldTitle) s.category = title; });
    saveServices(serv);
    rerenderAllFinal();
  };
  window.deleteServiceTypeFinal = function(i){
    var arr = serviceTypes();
    var removed = arr[i].title;
    arr.splice(i,1);
    saveServiceTypes(arr);
    var fallback = arr[0] ? arr[0].title : '';
    var serv = allServices();
    serv.forEach(function(s){ if(s.category === removed) s.category = fallback; });
    saveServices(serv);
    rerenderAllFinal();
  };
  window.moveServiceTypeFinal = function(i,dir){
    var arr = serviceTypes();
    var j = i + dir;
    if(j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    saveServiceTypes(arr);
    rerenderAllFinal();
  };

  function bindServiceTypeForm(){
    var form = document.getElementById('serviceCategoriesForm');
    if(!form || form.dataset.stableTypeBound === 'yes') return;
    form.dataset.stableTypeBound = 'yes';
    form.addEventListener('submit', function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      var titleInput = document.getElementById('serviceCategoryName');
      var descInput = document.getElementById('serviceTypeDescription');
      var urgentInput = document.getElementById('serviceTypeUrgent');
      var title = titleInput ? titleInput.value.trim() : '';
      if(!title) return;
      var arr = serviceTypes();
      arr.push({id:'type' + Date.now(), title:title, description:descInput ? descInput.value : '', urgent: urgentInput ? urgentInput.checked : title.toLowerCase().includes('термін'), order:arr.length + 1});
      saveServiceTypes(arr);
      form.reset();
      rerenderAllFinal();
    }, true);
  }

  function renderServicesFinal(){
    var grid = document.getElementById('servicesGrid');
    var bookingService = document.getElementById('bookingService');
    var filterBox = document.getElementById('serviceCategoryFilters');
    var types = serviceTypes();
    var servicesArr = allServices();

    if(filterBox){
      filterBox.innerHTML = '<button class="service-category-filter ' + (window.currentServiceCategory === 'all' ? 'active' : '') + '" data-service-cat="all">Усі</button>' + types.map(function(t){
        return '<button class="service-category-filter ' + (window.currentServiceCategory === t.title ? 'active' : '') + '" data-service-cat="' + esc2(t.title) + '">' + esc2(t.title) + '</button>';
      }).join('');
      filterBox.querySelectorAll('[data-service-cat]').forEach(function(btn){
        btn.onclick = function(){
          window.currentServiceCategory = btn.dataset.serviceCat;
          renderServicesFinal();
        };
      });
    }

    if(grid){
      var visibleTypes = window.currentServiceCategory === 'all' ? types : types.filter(function(t){ return t.title === window.currentServiceCategory; });
      grid.innerHTML = visibleTypes.map(function(type){
        var list = servicesArr.filter(function(s){ return (s.category || (types[0] && types[0].title) || '') === type.title; });
        if(!list.length) return '';
        return '<section class="service-type-group"><div class="service-type-head"><span class="service-type-badge">' + (type.urgent ? 'Терміновий тип' : 'Тип консультацій') + '</span><h2>' + esc2(type.title) + '</h2><p>' + esc2(type.description || '') + '</p></div><div class="cards">' + list.map(function(s){
          return '<article class="service-card reveal visible ' + (type.urgent ? 'urgent-service' : '') + '"><span class="service-category-label">' + esc2(type.title) + '</span><div class="service-tag">' + esc2(s.format || '') + '</div><h3>' + esc2(s.title) + '</h3><p>' + esc2(s.text || '') + '</p><p>' + esc2(s.duration || '') + '</p><div class="price">' + Number(s.price || 0) + ' грн</div><button class="btn primary open-booking" data-service="' + esc2(s.title) + '">' + (type.urgent ? 'Залишити терміновий запит' : 'Обрати час') + '</button></article>';
        }).join('') + '</div></section>';
      }).join('');
      grid.querySelectorAll('.open-booking').forEach(function(btn){
        btn.onclick = function(){
          if(bookingService){
            bookingService.value = btn.dataset.service;
            bookingService.dispatchEvent(new Event('change'));
          }
          document.getElementById('booking')?.scrollIntoView({behavior:'smooth'});
        };
      });
    }

    if(bookingService){
      bookingService.innerHTML = '<option value="">Оберіть консультацію</option>' + servicesArr.map(function(s){
        return '<option value="' + esc2(s.title) + '">' + esc2(s.title) + ' — ' + Number(s.price || 0) + ' грн</option>';
      }).join('');
    }
  }

  function selectedService(){
    var title = document.getElementById('bookingService')?.value || '';
    return allServices().find(function(s){ return s.title === title; }) || null;
  }
  function takenKeys(){
    return (typeof bookings === 'function' ? bookings() : read('psy_bookings', [])).filter(function(b){ return b.status !== 'cancelled'; }).map(function(b){ return b.date + '_' + b.time; });
  }
  function availableForBooking(date){
    var service = selectedService();
    var min = isUrgentService(service) ? todayLocal() : tomorrowISO();
    if(date < min) return [];
    var keys = takenKeys();
    var off = typeof daysOff === 'function' ? daysOff() : read('psy_days_off', []);
    var slotList = typeof slots === 'function' ? slots() : read('psy_slots', []);
    return slotList.filter(function(s){
      return s.date === date && !keys.includes(s.date + '_' + s.time) && !off.includes(s.date);
    });
  }
  window.availableForBooking = availableForBooking;

  window.updateTimes = function(){
    var dateInput = document.getElementById('bookingDate');
    var timeSelect = document.getElementById('bookingTime');
    if(!dateInput || !timeSelect) return;
    var service = selectedService();
    dateInput.min = isUrgentService(service) ? todayLocal() : tomorrowISO();
    var arr = dateInput.value ? availableForBooking(dateInput.value) : [];
    timeSelect.innerHTML = !dateInput.value ? '<option value="">Спочатку оберіть дату</option>' :
      arr.length ? '<option value="">Оберіть час</option>' + arr.map(function(s){
        return '<option value="' + s.time + '">' + s.time + ' — ' + (s.format === 'offline' ? 'офлайн' : 'онлайн') + (s.city ? ', ' + esc2(s.city) : '') + '</option>';
      }).join('') : '<option value="">Немає доступного часу</option>';
  };

  window.renderBookingDateStrip = function(){
    var strip = document.getElementById('bookingDateStrip');
    var grid = document.getElementById('bookingTimeGrid');
    var dateInput = document.getElementById('bookingDate');
    if(!strip || !grid || !dateInput) return;

    var service = selectedService();
    var urgent = isUrgentService(service);
    var start = new Date();
    if(!urgent) start.setDate(start.getDate() + 1);

    var days = [];
    for(var i=0;i<21;i++){
      var d = new Date(start);
      d.setDate(start.getDate() + i);
      var iso = localISO(d);
      var av = availableForBooking(iso);
      if(av.length){
        days.push({iso:iso, label:formatUA(iso), weekday:d.toLocaleDateString('uk-UA',{weekday:'short'}), count:av.length, urgentToday: urgent && iso === todayLocal()});
      }
    }

    strip.innerHTML = days.length ? days.map(function(d){
      return '<button type="button" class="booking-date-card ' + (dateInput.value === d.iso ? 'active' : '') + (d.urgentToday ? ' urgent-today' : '') + '" data-date="' + d.iso + '"><strong>' + d.label + '</strong><br><small>' + d.weekday + ' · ' + d.count + ' год.</small></button>';
    }).join('') : '<div class="booking-date-card normal-disabled">Немає доступних днів</div>';

    strip.querySelectorAll('[data-date]').forEach(function(btn){
      btn.onclick = function(){
        dateInput.value = btn.dataset.date;
        window.updateTimes();
        window.renderBookingDateStrip();
        window.renderBookingTimeGrid();
      };
    });

    window.renderBookingTimeGrid();
  };

  window.renderBookingTimeGrid = function(){
    var grid = document.getElementById('bookingTimeGrid');
    var dateInput = document.getElementById('bookingDate');
    var timeSelect = document.getElementById('bookingTime');
    if(!grid || !dateInput || !timeSelect) return;
    var arr = dateInput.value ? availableForBooking(dateInput.value) : [];
    grid.innerHTML = arr.length ? arr.map(function(s){
      return '<button type="button" class="time-pill ' + (timeSelect.value === s.time ? 'active' : '') + '" data-time="' + s.time + '">' + s.time + '</button>';
    }).join('') : '<div class="time-pill normal-disabled">Оберіть доступний день</div>';
    grid.querySelectorAll('[data-time]').forEach(function(btn){
      btn.onclick = function(){
        timeSelect.value = btn.dataset.time;
        window.renderBookingTimeGrid();
      };
    });
  };

  function toggleUrgentPanel(){
    var panel = document.getElementById('urgentRequestPanelFinal');
    if(!panel) return;
    panel.classList.toggle('active', isUrgentService(selectedService()));
  }

  function createBookingFromForm(noTime){
    var service = selectedService();
    if(!service) {
      alert('Оберіть консультацію.');
      return null;
    }
    var urgent = isUrgentService(service);
    var name = document.getElementById('clientFullName')?.value || '';
    var email = (document.getElementById('clientEmail')?.value || '').trim().toLowerCase();
    var phone = document.getElementById('clientPhone')?.value || '';
    var date = document.getElementById('bookingDate')?.value || '';
    var time = document.getElementById('bookingTime')?.value || '';

    if(!name || !email || !phone){
      alert('Заповніть ПІБ, пошту та телефон.');
      return null;
    }
    if(!noTime && (!date || !time)){
      alert('Оберіть дату та час.');
      return null;
    }

    var booking = {
      id: (typeof uid === 'function' ? uid() : String(Date.now())),
      clientFullName: name,
      clientEmail: email,
      clientPhone: phone,
      clientSocial: document.getElementById('clientSocial')?.value || '',
      service: service.title,
      price: Number(service.price || 0),
      date: noTime ? todayLocal() : date,
      time: noTime ? '' : time,
      noTime: !!noTime,
      comment: document.getElementById('clientComment')?.value || (noTime ? 'Клієнт хоче узгодити час у Telegram' : ''),
      status: urgent ? 'urgent_requested' : 'new',
      urgent: urgent,
      zoom: (typeof site === 'function' ? site().zoomLink : ''),
      createdAt: new Date().toISOString()
    };

    var arr = typeof bookings === 'function' ? bookings() : read('psy_bookings', []);
    arr.push(booking);
    write('psy_bookings', arr);

    var result = document.getElementById('bookingResult');
    var tg = (typeof site === 'function' ? (site().telegramUrl || '#') : '#');
    if(result){
      result.style.display = 'block';
      if(urgent){
        result.innerHTML = '<strong>Терміновий запит створено.</strong><br>' +
          (noTime ? 'Час буде узгоджено особисто.' : formatUA(booking.date) + ' о ' + booking.time + ', час за Києвом.') +
          '<br>Після підтвердження психологом у кабінеті зʼявиться можливість оплати: <b>' + booking.price + ' грн</b>.' +
          '<br><a class="btn primary" href="' + esc2(tg) + '" target="_blank">Написати психологу в Telegram</a>';
      } else {
        result.innerHTML = '<strong>Запис створено.</strong><br>' + esc2(booking.service) + '<br>' + formatUA(booking.date) + ' о ' + booking.time + '<br><small>Час за Києвом</small>';
      }
    }
    return booking;
  }

  function bindBooking(){
    var form = document.getElementById('bookingForm');
    if(form && form.dataset.stableSubmit !== 'yes'){
      form.dataset.stableSubmit = 'yes';
      form.addEventListener('submit', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        var created = createBookingFromForm(false);
        if(created){
          form.reset();
          window.updateTimes();
          window.renderBookingDateStrip();
          if(typeof renderAll === 'function') renderAll();
        }
      }, true);
    }
    var btn = document.getElementById('urgentNoTimeBtn');
    if(btn && btn.dataset.stableUrgent !== 'yes'){
      btn.dataset.stableUrgent = 'yes';
      btn.addEventListener('click', function(){
        if(!isUrgentService(selectedService())){
          alert('Спочатку оберіть термінову консультацію.');
          return;
        }
        var created = createBookingFromForm(true);
        if(created && typeof renderAll === 'function') renderAll();
      });
    }
    var serviceSelect = document.getElementById('bookingService');
    if(serviceSelect && serviceSelect.dataset.stableChange !== 'yes'){
      serviceSelect.dataset.stableChange = 'yes';
      serviceSelect.addEventListener('change', function(){
        toggleUrgentPanel();
        window.updateTimes();
        window.renderBookingDateStrip();
      });
    }
  }

  function enhanceAdminUrgent(){
    var box = document.getElementById('adminBookings');
    if(!box) return;
    var all = typeof bookings === 'function' ? bookings() : read('psy_bookings', []);
    var urgent = all.filter(function(b){ return b.urgent && (b.status === 'urgent_requested' || b.status === 'urgent_confirmed'); });
    var old = document.getElementById('urgentAdminStablePanel');
    if(old) old.remove();
    if(!urgent.length) return;
    var panel = document.createElement('div');
    panel.id = 'urgentAdminStablePanel';
    panel.className = 'admin-card';
    panel.innerHTML = '<h2>Термінові запити</h2>' + urgent.map(function(b){
      return '<div class="booking-item urgent-request"><strong>' + (b.time || 'без часу') + ' · ' + esc2(b.clientFullName) + '</strong><br>' +
        esc2(b.service) + '<br>' + formatUA(b.date) + ' · час за Києвом<br>Вартість: ' + Number(b.price || 0) + ' грн<br>Статус: ' + esc2(b.status) +
        '<div class="item-actions">' +
        (b.status === 'urgent_requested' ? '<button class="small-btn green" onclick="confirmUrgentStable(&quot;' + esc2(b.id) + '&quot;)">Підтвердити</button><button class="small-btn danger" onclick="declineUrgentStable(&quot;' + esc2(b.id) + '&quot;)">Відхилити</button>' : '') +
        '</div></div>';
    }).join('');
    box.prepend(panel);
  }
  window.confirmUrgentStable = function(id){
    var arr = typeof bookings === 'function' ? bookings() : read('psy_bookings', []);
    arr = arr.map(function(b){ return b.id === id ? Object.assign({}, b, {status:'urgent_confirmed'}) : b; });
    write('psy_bookings', arr);
    rerenderAllFinal();
  };
  window.declineUrgentStable = function(id){
    var arr = typeof bookings === 'function' ? bookings() : read('psy_bookings', []);
    arr = arr.map(function(b){ return b.id === id ? Object.assign({}, b, {status:'urgent_declined'}) : b; });
    write('psy_bookings', arr);
    rerenderAllFinal();
  };

  function renderClientPayNotice(){
    var box = document.getElementById('clientBookings');
    if(!box) return;
    var email = localStorage.psy_client_email;
    var arr = (typeof bookings === 'function' ? bookings() : read('psy_bookings', [])).filter(function(b){ return b.clientEmail === email && b.status === 'urgent_confirmed'; });
    arr.forEach(function(b){
      if(box.querySelector('[data-urgent-pay="' + b.id + '"]')) return;
      var div = document.createElement('div');
      div.className = 'client-pay-box';
      div.dataset.urgentPay = b.id;
      div.innerHTML = '<strong>Термінову консультацію підтверджено</strong><br>До оплати: ' + Number(b.price || 0) + ' грн<br><button class="small-btn green" type="button" onclick="alert(&quot;Оплату буде підключено наступним етапом.&quot;)">Оплатити</button>';
      box.prepend(div);
    });
  }

  function rerenderAllFinal(){
    if(typeof renderAll === 'function') renderAll();
    setTimeout(runStable, 0);
  }
  window.rerenderAllFinal = rerenderAllFinal;

  function runStable(){
    setActiveNav();
    renderFooter();
    renderPhotos();
    renderAboutWindows();
    bindAboutForm();
    renderServiceAdmin();
    bindServiceTypeForm();
    renderServicesFinal();
    bindBooking();
    toggleUrgentPanel();
    window.updateTimes();
    window.renderBookingDateStrip();
    enhanceAdminUrgent();
    renderClientPayNotice();
  }

  seedReviewContent();

  var oldRenderAll = window.renderAll || null;
  if(typeof oldRenderAll === 'function' && !window.__stableReviewFinal){
    window.__stableReviewFinal = true;
    window.renderAll = function(){
      oldRenderAll();
      runStable();
    };
  }

  document.addEventListener('DOMContentLoaded', function(){
    runStable();
    setTimeout(runStable, 300);
  });
  setTimeout(runStable, 500);
})();
