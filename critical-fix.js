
(function(){
  function esc(s){
    return String(s || '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }
  function read(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; }
  }
  function write(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }
  function pad(n){ return String(n).padStart(2,'0'); }
  function localISO(d){ return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
  function today(){ return localISO(new Date()); }
  function tomorrow(){ var d = new Date(); d.setDate(d.getDate()+1); return localISO(d); }
  function formatDate(iso){
    var p = String(iso || '').split('-');
    return p.length === 3 ? p[2] + '-' + p[1] + '-' + p[0] : iso;
  }

  function setActiveNav(){
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function(a){
      var href = (a.getAttribute('href') || '').split('#')[0] || 'index.html';
      a.classList.remove('active-nav', 'current-page');
      a.removeAttribute('aria-current');
      if(href === page || (page === '' && href === 'index.html')){
        a.classList.add('active-nav', 'current-page');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function serviceTypes(){
    var arr = read('psy_service_categories', []);
    if(!arr.length){
      arr = [
        {id:'type1', title:'Індивідуальні консультації', description:'Планові консультації з записом від завтра.', urgent:false, order:1},
        {id:'type2', title:'Термінові консультації', description:'Консультації сьогодні або запит без часу через Telegram.', urgent:true, order:2}
      ];
      write('psy_service_categories', arr);
    }
    arr.forEach(function(t,i){
      if(t.order === undefined) t.order = i + 1;
      if(t.urgent === undefined) t.urgent = String(t.title || '').toLowerCase().includes('термін');
    });
    write('psy_service_categories', arr);
    return arr.sort(function(a,b){ return (a.order||0) - (b.order||0); });
  }
  function servicesList(){
    return typeof services === 'function' ? services() : read('psy_services', []);
  }
  function saveServices(arr){ write('psy_services', arr); }
  function typeForService(service){
    return serviceTypes().find(function(t){ return t.title === service.category; });
  }
  function isUrgent(service){
    if(!service) return false;
    var t = typeForService(service);
    return !!(t && t.urgent) || String(service.title || '').toLowerCase().includes('термін') || String(service.category || '').toLowerCase().includes('термін');
  }
  window.serviceIsUrgent = isUrgent;

  function selectedService(){
    var title = document.getElementById('bookingService')?.value || '';
    return servicesList().find(function(s){ return s.title === title; });
  }
  function bookingsList(){
    return typeof bookings === 'function' ? bookings() : read('psy_bookings', []);
  }
  function slotsList(){
    return typeof slots === 'function' ? slots() : read('psy_slots', []);
  }
  function daysOffList(){
    return typeof daysOff === 'function' ? daysOff() : read('psy_days_off', []);
  }
  function takenKeys(){
    return bookingsList().filter(function(b){ return b.status !== 'cancelled' && b.time; }).map(function(b){ return b.date + '_' + b.time; });
  }
  function availableForBooking(date){
    var s = selectedService();
    var min = isUrgent(s) ? today() : tomorrow();
    if(date < min) return [];
    var keys = takenKeys();
    var off = daysOffList();
    return slotsList().filter(function(slot){
      return slot.date === date && !keys.includes(slot.date + '_' + slot.time) && !off.includes(slot.date);
    });
  }
  window.availableForBooking = availableForBooking;

  window.updateTimes = function(){
    var dateInput = document.getElementById('bookingDate');
    var timeSelect = document.getElementById('bookingTime');
    if(!dateInput || !timeSelect) return;
    var s = selectedService();
    dateInput.min = isUrgent(s) ? today() : tomorrow();
    var arr = dateInput.value ? availableForBooking(dateInput.value) : [];
    timeSelect.innerHTML = !dateInput.value ? '<option value="">Спочатку оберіть дату</option>' :
      arr.length ? '<option value="">Оберіть час</option>' + arr.map(function(slot){
        return '<option value="' + esc(slot.time) + '">' + esc(slot.time) + ' — ' + (slot.format === 'offline' ? 'офлайн' : 'онлайн') + '</option>';
      }).join('') : '<option value="">Немає доступного часу</option>';
  };

  window.renderBookingDateStrip = function(){
    var strip = document.getElementById('bookingDateStrip');
    var grid = document.getElementById('bookingTimeGrid');
    var dateInput = document.getElementById('bookingDate');
    if(!strip || !grid || !dateInput) return;

    var s = selectedService();
    var urgent = isUrgent(s);
    var start = new Date();
    if(!urgent) start.setDate(start.getDate()+1);

    var days = [];
    for(var i=0; i<21; i++){
      var d = new Date(start);
      d.setDate(start.getDate()+i);
      var iso = localISO(d);
      var av = availableForBooking(iso);
      if(av.length){
        days.push({iso:iso, label:formatDate(iso), weekday:d.toLocaleDateString('uk-UA',{weekday:'short'}), count:av.length, urgentToday:urgent && iso === today()});
      }
    }

    strip.innerHTML = days.length ? days.map(function(d){
      return '<button type="button" class="booking-date-card ' + (dateInput.value === d.iso ? 'active' : '') + (d.urgentToday ? ' urgent-today' : '') + '" data-date="' + d.iso + '"><strong>' + d.label + '</strong><small>' + d.weekday + ' · ' + d.count + ' год.</small></button>';
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
    grid.innerHTML = arr.length ? arr.map(function(slot){
      return '<button type="button" class="time-pill ' + (timeSelect.value === slot.time ? 'active' : '') + '" data-time="' + esc(slot.time) + '">' + esc(slot.time) + '</button>';
    }).join('') : '<div class="time-pill normal-disabled">Оберіть доступний день</div>';
    grid.querySelectorAll('[data-time]').forEach(function(btn){
      btn.onclick = function(){
        timeSelect.value = btn.dataset.time;
        window.renderBookingTimeGrid();
      };
    });
  };

  function toggleUrgent(){
    var panel = document.getElementById('urgentRequestPanelCritical') || document.getElementById('urgentRequestPanelFinal');
    if(panel) panel.classList.toggle('active', isUrgent(selectedService()));
  }

  function createBooking(noTime){
    var s = selectedService();
    if(!s){ alert('Оберіть консультацію.'); return; }
    var urgent = isUrgent(s);
    var name = document.getElementById('clientFullName')?.value || '';
    var email = (document.getElementById('clientEmail')?.value || '').trim().toLowerCase();
    var phone = document.getElementById('clientPhone')?.value || '';
    var date = document.getElementById('bookingDate')?.value || '';
    var time = document.getElementById('bookingTime')?.value || '';
    if(!name || !email || !phone){ alert('Заповніть ПІБ, пошту та телефон.'); return; }
    if(!noTime && (!date || !time)){ alert('Оберіть дату та час.'); return; }

    var b = {
      id: 'b' + Date.now(),
      clientFullName:name,
      clientEmail:email,
      clientPhone:phone,
      clientSocial:document.getElementById('clientSocial')?.value || '',
      service:s.title,
      price:Number(s.price || 0),
      date:noTime ? today() : date,
      time:noTime ? '' : time,
      noTime:!!noTime,
      comment:document.getElementById('clientComment')?.value || (noTime ? 'Клієнт хоче узгодити час у Telegram' : ''),
      status:urgent ? 'urgent_requested' : 'new',
      urgent:urgent,
      zoom:'',
      createdAt:new Date().toISOString()
    };
    var arr = bookingsList();
    arr.push(b);
    write('psy_bookings', arr);

    var result = document.getElementById('bookingResult');
    var site = read('psy_site', {});
    var tg = site.telegramUrl || '#';
    if(result){
      result.style.display = 'block';
      result.innerHTML = urgent
        ? '<strong>Терміновий запит створено.</strong><br>' + (noTime ? 'Час буде узгоджено особисто.' : formatDate(b.date) + ' о ' + esc(b.time) + ', час за Києвом.') + '<br>Після підтвердження психологом у кабінеті зʼявиться можливість оплати: <b>' + b.price + ' грн</b>.<br><a class="btn primary" href="' + esc(tg) + '" target="_blank">Написати психологу в Telegram</a>'
        : '<strong>Запис створено.</strong><br>' + esc(b.service) + '<br>' + formatDate(b.date) + ' о ' + esc(b.time) + '<br><small>Час за Києвом</small>';
    }
    document.getElementById('bookingForm')?.reset();
    run();
  }

  function bindBooking(){
    var form = document.getElementById('bookingForm');
    if(form && form.dataset.criticalBooking !== 'yes'){
      form.dataset.criticalBooking = 'yes';
      form.addEventListener('submit', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        createBooking(false);
      }, true);
    }
    var noTime = document.getElementById('urgentNoTimeBtn');
    if(noTime && noTime.dataset.criticalUrgent !== 'yes'){
      noTime.dataset.criticalUrgent = 'yes';
      noTime.onclick = function(){
        if(!isUrgent(selectedService())){ alert('Спочатку оберіть термінову консультацію.'); return; }
        createBooking(true);
      };
    }
    var select = document.getElementById('bookingService');
    if(select && select.dataset.criticalSelect !== 'yes'){
      select.dataset.criticalSelect = 'yes';
      select.addEventListener('change', function(){
        toggleUrgent();
        window.updateTimes();
        window.renderBookingDateStrip();
      });
    }
    var urgentBtn = document.getElementById('urgentStandaloneBtn');
    if(urgentBtn && urgentBtn.dataset.criticalStandalone !== 'yes'){
      urgentBtn.dataset.criticalStandalone = 'yes';
      urgentBtn.addEventListener('click', function(){
        setTimeout(function(){
          var select = document.getElementById('bookingService');
          if(select){
            var urgentService = servicesList().find(function(s){ return isUrgent(s); });
            if(urgentService){
              select.value = urgentService.title;
              select.dispatchEvent(new Event('change'));
            }
          }
        }, 100);
      });
    }
  }

  function renderAboutWindows(){
    var publicBox = document.getElementById('aboutCustomWindows');
    if(!publicBox) return;
    var arr = read('psy_about_custom_windows', []);
    if(!arr.length){
      arr = [
        {title:'Основна експертиза', text:'Стосунки, тривога, стрес, адаптація до змін, депресивні стани.', order:1},
        {title:'Методи роботи', text:'Арт-терапія, психодинамічний і системний підхід, екзистенційний аналіз та логотерапія.', order:2},
        {title:'Освіта', text:'Практична психологія, досвід індивідуальної роботи з дорослими клієнтами.', order:3}
      ];
      write('psy_about_custom_windows', arr);
    }
    arr.sort(function(a,b){ return (a.order||0) - (b.order||0); });
    publicBox.innerHTML = arr.map(function(w){
      return '<article class="about-custom-card reveal visible"><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></article>';
    }).join('');
  }

  function rerenderPhotos(){
    var site = read('psy_site', {});
    var url = site.photoUrl || site.homePhotoUrl || '';
    var homeUrl = site.homePhotoUrl || site.photoUrl || '';
    var home = document.getElementById('homePsychologistPhoto');
    var about = document.getElementById('psychologistPhoto');
    if(home && homeUrl){
      home.innerHTML = '<img src="' + homeUrl + '" alt="Фото психолога">';
      home.classList.add('has-photo');
    }
    if(about && url){
      about.innerHTML = '<img src="' + url + '" alt="Фото психолога">';
      about.classList.add('has-photo');
    }
  }

  function renderFooterIcons(){
    var box = document.getElementById('footerContacts');
    if(!box) return;
    if(window.__footerSvgRendered) return;
    window.__footerSvgRendered = true;
    var contacts = (typeof window.contacts === 'function') ? window.contacts() : read('psy_contacts', []);
    if(!contacts.length){
      contacts = [
        {title:'Instagram', value:'Instagram', link:'#'},
        {title:'Telegram', value:'Telegram', link:'#'},
        {title:'Facebook', value:'Facebook', link:'#'},
        {title:'Телефон', value:'+380000000000', link:'tel:+380000000000'},
        {title:'Email', value:'psychologist@example.com', link:'mailto:psychologist@example.com'}
      ];
    }
    function icon(c){
      var s = ((c.title||'') + ' ' + (c.value||'') + ' ' + (c.link||'')).toLowerCase();
      if(s.includes('instagram')) return '<span class="social-icon-svg instagram">IG</span>';
      if(s.includes('telegram') || s.includes('t.me')) return '<span class="social-icon-svg telegram">TG</span>';
      if(s.includes('facebook') || s.includes('fb.com')) return '<span class="social-icon-svg facebook">FB</span>';
      if(s.includes('@')) return '<span class="social-icon-svg email">@</span>';
      return '<span class="social-icon-svg phone">☎</span>';
    }
    box.innerHTML = contacts.map(function(c){
      return '<a href="' + esc(c.link || '#') + '" target="_blank">' + icon(c) + '<b>' + esc(c.value || c.title || 'Контакт') + '</b></a>';
    }).join('');
  }

  function styleFooterIconFallback(){
    var style = document.getElementById('critical-icon-style');
    if(style) return;
    style = document.createElement('style');
    style.id = 'critical-icon-style';
    style.textContent = '.social-icon-svg{width:34px;height:34px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:950;font-size:12px;flex:0 0 auto}.social-icon-svg.instagram{background:radial-gradient(circle at 30% 110%,#feda75 0%,#fa7e1e 28%,#d62976 55%,#962fbf 76%,#4f5bd5 100%)}.social-icon-svg.telegram{background:#2AABEE}.social-icon-svg.facebook{background:#1877F2}.social-icon-svg.email,.social-icon-svg.phone{background:linear-gradient(135deg,#4b2d20,#2c1710)}';
    document.head.appendChild(style);
  }

  function run(){
    setActiveNav();
    bindBooking();
    toggleUrgent();
    window.updateTimes();
    window.renderBookingDateStrip();
    renderAboutWindows();
    rerenderPhotos();
    renderFooterIcons();
    styleFooterIconFallback();
  }

  var oldRenderAll = window.renderAll || null;
  if(typeof oldRenderAll === 'function' && !window.__criticalFixPatch){
    window.__criticalFixPatch = true;
    window.renderAll = function(){
      oldRenderAll();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded', function(){
    run();
    setTimeout(run, 300);
    setTimeout(run, 900);
  });
})();
