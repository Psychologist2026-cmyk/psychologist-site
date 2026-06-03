
(function(){
  function esc(s){
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
  function todayISO(){ return localISO(new Date()); }
  function tomorrowISO(){ var d = new Date(); d.setDate(d.getDate()+1); return localISO(d); }
  function formatUA(iso){
    var p = String(iso || '').split('-');
    return p.length === 3 ? p[2] + '-' + p[1] + '-' + p[0] : iso;
  }

  // Ensure urgent service/type exists and prices are configurable by psychologist.
  function ensureUrgentService(){
    var types = read('psy_service_categories', []);
    var urgentType = types.find(function(t){ return t.urgent || String(t.title||'').toLowerCase().includes('термін'); });
    if(!urgentType){
      urgentType = {id:'type_urgent_' + Date.now(), title:'Термінові консультації', description:'Консультації сьогодні або запит без часу.', urgent:true, order:types.length+1};
      types.push(urgentType);
      write('psy_service_categories', types);
    }

    var services = read('psy_services', []);
    var urgentService = services.find(function(s){
      return String(s.category||'') === urgentType.title || String(s.title||'').toLowerCase().includes('термін');
    });
    if(!urgentService){
      services.push({
        id:'srv_urgent_' + Date.now(),
        title:'Термінова консультація',
        category:urgentType.title,
        format:'Онлайн',
        duration:'50 хв',
        price:3000,
        text:'Для ситуацій, коли консультація потрібна сьогодні. Після запиту психолог підтверджує консультацію.'
      });
      write('psy_services', services);
    }
  }

  function serviceTypes(){
    return read('psy_service_categories', []);
  }

  function servicesList(){
    return typeof window.services === 'function' ? window.services() : read('psy_services', []);
  }

  function typeForService(service){
    return serviceTypes().find(function(t){
      return t.title === service.category;
    });
  }

  function isUrgentService(service){
    if(!service) return false;
    var type = typeForService(service);
    return !!(type && type.urgent) ||
      String(service.title || '').toLowerCase().includes('термін') ||
      String(service.category || '').toLowerCase().includes('термін');
  }
  window.serviceIsUrgent = isUrgentService;

  function selectedService(){
    var select = document.getElementById('bookingService');
    var title = select ? select.value : '';
    return servicesList().find(function(s){ return s.title === title; }) || null;
  }

  function bookingList(){
    return typeof window.bookings === 'function' ? window.bookings() : read('psy_bookings', []);
  }

  function slotList(){
    return typeof window.slots === 'function' ? window.slots() : read('psy_slots', []);
  }

  function offList(){
    return typeof window.daysOff === 'function' ? window.daysOff() : read('psy_days_off', []);
  }

  function takenKeys(){
    return bookingList()
      .filter(function(b){ return b.status !== 'cancelled' && b.time; })
      .map(function(b){ return b.date + '_' + b.time; });
  }

  function availableForBooking(date){
    var service = selectedService();
    var minDate = isUrgentService(service) ? todayISO() : tomorrowISO();

    if(!service) return [];
    if(date < minDate) return [];

    var taken = takenKeys();
    return slotList().filter(function(s){
      return s.date === date &&
             !taken.includes(s.date + '_' + s.time) &&
             !offList().includes(s.date);
    });
  }
  window.availableForBooking = availableForBooking;

  function setBookingServiceToUrgent(){
    ensureUrgentService();

    var select = document.getElementById('bookingService');
    if(!select) return;

    // If old renderer did not include urgent option, rebuild options.
    var all = servicesList();
    if(!Array.from(select.options).some(function(o){ return all.some(function(s){ return s.title === o.value; }); })){
      select.innerHTML = '<option value="">Оберіть консультацію</option>' + all.map(function(s){
        return '<option value="' + esc(s.title) + '">' + esc(s.title) + ' — ' + Number(s.price || 0) + ' грн</option>';
      }).join('');
    }

    var urgent = all.find(function(s){ return isUrgentService(s); });
    if(urgent){
      select.value = urgent.title;
      select.dispatchEvent(new Event('change', {bubbles:true}));
      setTimeout(function(){
        updateBookingTimes();
        renderBookingDateStripFixed();
        renderBookingTimeGridFixed();
      }, 50);
    }
  }
  window.setBookingServiceToUrgent = setBookingServiceToUrgent;

  function updateBookingTimes(){
    var dateInput = document.getElementById('bookingDate');
    var timeSelect = document.getElementById('bookingTime');
    if(!dateInput || !timeSelect) return;

    var service = selectedService();
    dateInput.min = isUrgentService(service) ? todayISO() : tomorrowISO();

    var arr = dateInput.value ? availableForBooking(dateInput.value) : [];
    timeSelect.innerHTML = !dateInput.value
      ? '<option value="">Спочатку оберіть дату</option>'
      : arr.length
        ? '<option value="">Оберіть час</option>' + arr.map(function(s){
            return '<option value="' + esc(s.time) + '">' + esc(s.time) + ' — ' + (s.format === 'offline' ? 'офлайн' : 'онлайн') + '</option>';
          }).join('')
        : '<option value="">Немає доступного часу</option>';
  }
  window.updateTimes = updateBookingTimes;

  function renderBookingDateStripFixed(){
    var strip = document.getElementById('bookingDateStrip');
    var grid = document.getElementById('bookingTimeGrid');
    var dateInput = document.getElementById('bookingDate');
    if(!strip || !grid || !dateInput) return;

    var service = selectedService();
    var urgent = isUrgentService(service);
    var start = new Date();
    if(!urgent) start.setDate(start.getDate()+1);

    var days = [];
    for(var i=0;i<30;i++){
      var d = new Date(start);
      d.setDate(start.getDate()+i);
      var iso = localISO(d);
      var arr = availableForBooking(iso);
      if(arr.length){
        days.push({
          iso: iso,
          label: formatUA(iso),
          weekday: d.toLocaleDateString('uk-UA', {weekday:'short'}),
          count: arr.length,
          urgentToday: urgent && iso === todayISO()
        });
      }
    }

    strip.innerHTML = days.length
      ? days.map(function(d){
          return '<button type="button" class="booking-date-card ' + (dateInput.value === d.iso ? 'active' : '') + (d.urgentToday ? ' urgent-today' : '') + '" data-date="' + esc(d.iso) + '"><strong>' + esc(d.label) + '</strong><small>' + esc(d.weekday) + ' · ' + d.count + ' год.</small></button>';
        }).join('')
      : '<div class="booking-date-card normal-disabled">Немає доступних днів</div>';

    strip.querySelectorAll('[data-date]').forEach(function(btn){
      btn.onclick = function(){
        dateInput.value = btn.dataset.date;
        updateBookingTimes();
        renderBookingDateStripFixed();
        renderBookingTimeGridFixed();
      };
    });

    // Auto-select first available date after service change.
    if(!dateInput.value && days[0]){
      dateInput.value = days[0].iso;
      updateBookingTimes();
    }

    renderBookingTimeGridFixed();
  }
  window.renderBookingDateStrip = renderBookingDateStripFixed;

  function renderBookingTimeGridFixed(){
    var grid = document.getElementById('bookingTimeGrid');
    var dateInput = document.getElementById('bookingDate');
    var timeSelect = document.getElementById('bookingTime');
    if(!grid || !dateInput || !timeSelect) return;

    var arr = dateInput.value ? availableForBooking(dateInput.value) : [];
    grid.innerHTML = arr.length
      ? arr.map(function(s){
          return '<button type="button" class="time-pill ' + (timeSelect.value === s.time ? 'active' : '') + '" data-time="' + esc(s.time) + '">' + esc(s.time) + '</button>';
        }).join('')
      : '<div class="time-pill normal-disabled">Оберіть доступний день</div>';

    grid.querySelectorAll('[data-time]').forEach(function(btn){
      btn.onclick = function(){
        timeSelect.value = btn.dataset.time;
        renderBookingTimeGridFixed();
      };
    });
  }
  window.renderBookingTimeGrid = renderBookingTimeGridFixed;

  // ADMIN CALENDAR: stable local-date month render. Prevent "jump" after selecting day.
  window.renderCalendar = function(){
    var grid = document.getElementById('adminCalendar');
    var title = document.getElementById('calendarTitle');
    if(!grid || !title || typeof window.calDate === 'undefined') return;

    var y = window.calDate.getFullYear();
    var m = window.calDate.getMonth();
    var first = new Date(y, m, 1);
    var start = new Date(first);
    var offset = (first.getDay() + 6) % 7;
    start.setDate(first.getDate() - offset);

    title.textContent = window.calDate.toLocaleDateString('uk-UA', {month:'long', year:'numeric'});
    grid.innerHTML = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(function(n){
      return '<div class="calendar-day-name">' + n + '</div>';
    }).join('');

    var selected = window.selectedDate || todayISO();
    var slots = slotList();
    var bookings = bookingList();
    var off = offList();

    for(var i=0;i<42;i++){
      var d = new Date(start);
      d.setDate(start.getDate()+i);
      var iso = localISO(d);
      var daySlots = slots.filter(function(s){ return s.date === iso; });
      var dayBookings = bookings.filter(function(b){ return b.date === iso && b.status !== 'cancelled'; });
      var isOff = off.includes(iso);

      var chips = '';
      if(isOff){
        chips += '<span class="slot-chip request">Вихідний</span>';
      } else {
        chips += daySlots.map(function(s){ return '<span class="slot-chip free">' + esc(s.time) + '</span>'; }).join('');
        chips += dayBookings.map(function(b){
          var cls = b.urgent ? 'urgent' : (String(b.status||'').includes('request') ? 'request' : (b.status === 'paid' ? 'booked' : 'booked'));
          return '<span class="slot-chip ' + cls + '">' + esc(b.time || 'без часу') + '</span>';
        }).join('');
      }

      grid.innerHTML += '<div class="calendar-day ' + (d.getMonth() !== m ? 'other ' : '') + (isOff ? 'off ' : '') + (iso === selected ? 'selected ' : '') + '" data-date="' + iso + '">' +
        '<div class="day-number">' + d.getDate() + '</div>' + chips + '</div>';
    }

    grid.querySelectorAll('.calendar-day[data-date]').forEach(function(day){
      day.onclick = function(){
        window.selectedDate = day.dataset.date;
        if(typeof window.renderDayPanel === 'function'){
          window.renderDayPanel();
        }
        // Only update selected class. Do not rebuild whole month on click -> no jump.
        grid.querySelectorAll('.calendar-day').forEach(function(x){ x.classList.remove('selected'); });
        day.classList.add('selected');
      };
    });

    if(typeof window.renderDayPanel === 'function'){
      window.renderDayPanel();
    }
  };

  // Update selected day panel title in dd-mm-yyyy if it exists.
  var oldRenderDayPanel = window.renderDayPanel;
  if(typeof oldRenderDayPanel === 'function' && !window.__dayPanelPatched){
    window.__dayPanelPatched = true;
    window.renderDayPanel = function(){
      oldRenderDayPanel();
      var title = document.getElementById('selectedDayTitle');
      if(title && window.selectedDate) title.textContent = formatUA(window.selectedDate);
    };
  }

  function bindEvents(){
    var standalone = document.getElementById('urgentStandaloneBtn');
    if(standalone && standalone.dataset.urgentFixed !== 'yes'){
      standalone.dataset.urgentFixed = 'yes';
      standalone.addEventListener('click', function(){
        setTimeout(function(){
          setBookingServiceToUrgent();
          document.getElementById('booking')?.scrollIntoView({behavior:'smooth'});
        }, 50);
      });
    }

    document.querySelectorAll('.service-card .open-booking, .open-booking').forEach(function(btn){
      if(btn.dataset.fixedOpen === 'yes') return;
      btn.dataset.fixedOpen = 'yes';
      btn.addEventListener('click', function(){
        setTimeout(function(){
          var service = servicesList().find(function(s){ return s.title === btn.dataset.service; });
          var select = document.getElementById('bookingService');
          if(select && service){
            select.value = service.title;
            select.dispatchEvent(new Event('change', {bubbles:true}));
            updateBookingTimes();
            renderBookingDateStripFixed();
          }
        }, 80);
      });
    });

    var select = document.getElementById('bookingService');
    if(select && select.dataset.finalUrgentSelect !== 'yes'){
      select.dataset.finalUrgentSelect = 'yes';
      select.addEventListener('change', function(){
        // Clear old date/time when switching service to avoid stale tomorrow date.
        var date = document.getElementById('bookingDate');
        var time = document.getElementById('bookingTime');
        if(date) date.value = '';
        if(time) time.value = '';
        updateBookingTimes();
        renderBookingDateStripFixed();

        var panel = document.getElementById('urgentRequestPanelCritical') || document.getElementById('urgentRequestPanelFinal');
        if(panel) panel.classList.toggle('active', isUrgentService(selectedService()));
      });
    }
  }

  function run(){
    ensureUrgentService();
    bindEvents();
    updateBookingTimes();
    renderBookingDateStripFixed();

    if(document.getElementById('adminCalendar')){
      window.renderCalendar();
    }
  }

  var oldRenderAll = window.renderAll;
  if(typeof oldRenderAll === 'function' && !window.__calendarUrgentFix){
    window.__calendarUrgentFix = true;
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
