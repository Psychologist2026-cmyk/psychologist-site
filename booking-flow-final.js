
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
  function formatDate(iso){
    var p = String(iso || '').split('-');
    return p.length === 3 ? p[2] + '-' + p[1] + '-' + p[0] : iso;
  }
  function site(){ return read('psy_site', {}); }
  function bookings(){ return read('psy_bookings', []); }
  function saveBookings(arr){ write('psy_bookings', arr); }
  function servicesList(){ return typeof services === 'function' ? services() : read('psy_services', []); }
  function serviceTypes(){ return read('psy_service_categories', []); }

  function selectedService(){
    var title = document.getElementById('bookingService')?.value || '';
    return servicesList().find(function(s){ return s.title === title; }) || null;
  }
  function isUrgent(service){
    if(!service) return false;
    var type = serviceTypes().find(function(t){ return t.title === service.category; });
    return !!(type && type.urgent) || String(service.title || '').toLowerCase().includes('термін') || String(service.category || '').toLowerCase().includes('термін');
  }

  function getFormData(noTime){
    var service = selectedService();
    if(!service) return {error:'Оберіть консультацію.'};

    var fullName = document.getElementById('clientFullName')?.value.trim() || '';
    var email = (document.getElementById('clientEmail')?.value || '').trim().toLowerCase();
    var phone = document.getElementById('clientPhone')?.value.trim() || '';
    var social = document.getElementById('clientSocial')?.value.trim() || '';
    var comment = document.getElementById('clientComment')?.value.trim() || '';
    var date = document.getElementById('bookingDate')?.value || '';
    var time = document.getElementById('bookingTime')?.value || '';

    if(!fullName || !email || !phone) return {error:'Заповніть ПІБ, пошту та телефон.'};
    if(!noTime && (!date || !time)) return {error:'Оберіть дату та час.'};

    var urgent = isUrgent(service);
    return {
      service: service,
      urgent: urgent,
      noTime: !!noTime,
      fullName: fullName,
      email: email,
      phone: phone,
      social: social,
      comment: comment,
      date: noTime ? localISO(new Date()) : date,
      time: noTime ? '' : time,
      price: Number(service.price || 0)
    };
  }

  function ensureModal(){
    var modal = document.getElementById('bookingFlowModal');
    if(modal) return modal;
    modal = document.createElement('div');
    modal.id = 'bookingFlowModal';
    modal.className = 'booking-flow-modal';
    modal.innerHTML = '<div class="booking-flow-card" id="bookingFlowCard"></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
    return modal;
  }
  function showModal(html){
    var modal = ensureModal();
    document.getElementById('bookingFlowCard').innerHTML = html;
    modal.classList.add('active');
  }
  function closeModal(){
    var modal = document.getElementById('bookingFlowModal');
    if(modal) modal.classList.remove('active');
  }
  window.closeBookingFlowModal = closeModal;

  function summaryRows(data){
    return '<div class="booking-flow-summary">' +
      '<div class="booking-flow-row"><span>Консультація</span><strong>' + esc(data.service.title) + '</strong></div>' +
      '<div class="booking-flow-row"><span>Дата</span><strong>' + (data.noTime ? 'Узгоджується' : formatDate(data.date)) + '</strong></div>' +
      '<div class="booking-flow-row"><span>Час</span><strong>' + (data.noTime ? 'Узгоджується з психологом' : esc(data.time) + ' · за Києвом') + '</strong></div>' +
      '<div class="booking-flow-row"><span>Клієнт</span><strong>' + esc(data.fullName) + '</strong></div>' +
      '<div class="booking-flow-row"><span>Контакти</span><strong>' + esc(data.phone) + '<br>' + esc(data.email) + (data.social ? '<br>' + esc(data.social) : '') + '</strong></div>' +
      '<div class="booking-flow-row"><span>Вартість</span><strong>' + data.price + ' грн</strong></div>' +
    '</div>';
  }

  function startFlow(noTime){
    var data = getFormData(noTime);
    if(data.error){ alert(data.error); return; }

    var intro = data.urgent
      ? '<span class="booking-status-pill">Терміновий запит</span><p>Після підтвердження психологом у кабінеті клієнт побачить оплату і посилання.</p>'
      : '<span class="booking-status-pill">Плановий запис</span><p>Перевірте дані перед підтвердженням запису.</p>';

    showModal('<h2>Підтвердження запису</h2>' + intro + summaryRows(data) +
      '<div class="booking-flow-actions">' +
      '<button class="btn primary" id="confirmBookingFlowBtn">Підтвердити</button>' +
      '<button class="btn secondary" onclick="closeBookingFlowModal()">Назад</button>' +
      '</div>');

    document.getElementById('confirmBookingFlowBtn').onclick = function(){
      createBookingAndNext(data);
    };
  }

  function createBookingAndNext(data){
    var s = site();
    var booking = {
      id: 'b' + Date.now(),
      clientFullName: data.fullName,
      clientEmail: data.email,
      clientPhone: data.phone,
      clientSocial: data.social,
      service: data.service.title,
      price: data.price,
      date: data.date,
      time: data.time,
      noTime: data.noTime,
      comment: data.comment,
      status: data.urgent ? 'urgent_requested' : 'awaiting_payment',
      urgent: data.urgent,
      zoom: s.zoomLink || 'Zoom-посилання буде додано після підтвердження',
      createdAt: new Date().toISOString()
    };
    var arr = bookings();
    arr.push(booking);
    saveBookings(arr);

    // Client account auto-link
    localStorage.psy_client_email = data.email;
    var clients = read('psy_clients', []);
    if(!clients.find(function(c){ return c.email === data.email; })){
      clients.push({email:data.email, name:data.fullName, phone:data.phone, social:data.social, password:'123456', photo:''});
      write('psy_clients', clients);
    }

    if(data.urgent){
      urgentWaitingScreen(booking);
    } else {
      paymentScreen(booking);
    }
  }

  function urgentWaitingScreen(booking){
    var tg = site().telegramUrl || '#';
    showModal('<h2>Запит створено</h2>' +
      '<span class="booking-status-pill">Очікує підтвердження психолога</span>' +
      '<p>Психолог побачить терміновий запит у кабінеті. Після підтвердження у кабінеті клієнта зʼявиться кнопка оплати.</p>' +
      summaryRows({
        service:{title:booking.service},
        noTime:booking.noTime,
        date:booking.date,
        time:booking.time,
        fullName:booking.clientFullName,
        email:booking.clientEmail,
        phone:booking.clientPhone,
        social:booking.clientSocial,
        price:booking.price
      }) +
      '<div class="booking-flow-actions">' +
      '<a class="btn primary" href="' + esc(tg) + '" target="_blank">Написати в Telegram</a>' +
      '<a class="btn secondary" href="client-dashboard.html">Перейти в кабінет</a>' +
      '<button class="btn secondary" onclick="closeBookingFlowModal()">Закрити</button>' +
      '</div>');
    renderResult('Терміновий запит створено. Очікуйте підтвердження психолога.');
  }

  function paymentScreen(booking){
    showModal('<h2>Оплата консультації</h2>' +
      '<span class="booking-status-pill">Крок 2 з 3</span>' +
      '<p>Спосіб оплати буде підключений наступним етапом. Зараз це демонстраційний крок, щоб вся схема запису вже працювала.</p>' +
      '<div class="payment-placeholder"><strong>До оплати: ' + Number(booking.price || 0) + ' грн</strong><br>Тут буде LiqPay / WayForPay / інший спосіб оплати.</div>' +
      '<div class="booking-flow-actions">' +
      '<button class="btn primary" id="fakePayBtn">Оплату виконано</button>' +
      '<button class="btn secondary" onclick="closeBookingFlowModal()">Пізніше</button>' +
      '</div>');

    document.getElementById('fakePayBtn').onclick = function(){
      markPaid(booking.id);
    };
  }

  function markPaid(id){
    var arr = bookings();
    var s = site();
    var updated = null;
    arr = arr.map(function(b){
      if(b.id === id){
        updated = Object.assign({}, b, {
          status:'paid',
          paidAt:new Date().toISOString(),
          zoom: s.zoomLink || 'Zoom-посилання буде додано психологом'
        });
        return updated;
      }
      return b;
    });
    saveBookings(arr);
    finalScreen(updated);
  }

  function finalScreen(booking){
    showModal('<h2>Запис підтверджено</h2>' +
      '<span class="booking-status-pill">Готово</span>' +
      '<p>Запис збережено в кабінеті клієнта. Посилання на консультацію доступне нижче.</p>' +
      '<div class="zoom-box"><strong>Zoom / посилання:</strong><br>' + esc(booking.zoom || 'Посилання буде додано психологом') + '</div>' +
      '<div class="booking-flow-actions">' +
      '<a class="btn primary" href="client-dashboard.html">Мій кабінет</a>' +
      '<button class="btn secondary" onclick="closeBookingFlowModal()">Закрити</button>' +
      '</div>');
    renderResult('Запис підтверджено. Інформація збережена в кабінеті клієнта.');
    var form = document.getElementById('bookingForm');
    if(form) form.reset();
  }

  function renderResult(text){
    var box = document.getElementById('bookingResult');
    if(!box) return;
    box.style.display = 'block';
    box.innerHTML = '<strong>' + esc(text) + '</strong>';
  }

  function adminPanels(){
    var host = document.getElementById('adminBookings');
    if(!host) return;

    var old = document.getElementById('adminUrgentRequestsFinal');
    if(old) old.remove();

    var urgent = bookings().filter(function(b){ return b.urgent && b.status === 'urgent_requested'; });
    if(!urgent.length) return;

    var panel = document.createElement('div');
    panel.id = 'adminUrgentRequestsFinal';
    panel.className = 'admin-card admin-urgent-panel';
    panel.innerHTML = '<h2>Термінові запити</h2>' + urgent.map(function(b){
      return '<div class="booking-item urgent-request"><strong>' + esc(b.clientFullName) + '</strong><br>' +
        esc(b.service) + '<br>' + (b.noTime ? 'Час узгоджується' : formatDate(b.date) + ' · ' + esc(b.time)) +
        '<br>Вартість: ' + Number(b.price || 0) + ' грн' +
        '<div class="item-actions">' +
        '<button class="small-btn green" onclick="confirmUrgentRequestFinal(&quot;' + esc(b.id) + '&quot;)">Підтвердити</button>' +
        '<button class="small-btn danger" onclick="declineUrgentRequestFinal(&quot;' + esc(b.id) + '&quot;)">Відхилити</button>' +
        '</div></div>';
    }).join('');
    host.prepend(panel);
  }

  window.confirmUrgentRequestFinal = function(id){
    var arr = bookings().map(function(b){
      return b.id === id ? Object.assign({}, b, {status:'awaiting_payment', urgentConfirmedAt:new Date().toISOString()}) : b;
    });
    saveBookings(arr);
    rerender();
  };
  window.declineUrgentRequestFinal = function(id){
    var arr = bookings().map(function(b){
      return b.id === id ? Object.assign({}, b, {status:'urgent_declined'}) : b;
    });
    saveBookings(arr);
    rerender();
  };

  function clientPaymentPanels(){
    var host = document.getElementById('clientBookings');
    if(!host) return;
    var email = localStorage.psy_client_email || '';
    var arr = bookings().filter(function(b){ return b.clientEmail === email && b.status === 'awaiting_payment'; });
    arr.forEach(function(b){
      if(host.querySelector('[data-final-pay="' + b.id + '"]')) return;
      var div = document.createElement('div');
      div.className = 'client-pay-box';
      div.dataset.finalPay = b.id;
      div.innerHTML = '<strong>Очікує оплату</strong><br>' + esc(b.service) + '<br>' + (b.noTime ? 'Час узгоджується' : formatDate(b.date) + ' · ' + esc(b.time)) +
        '<br>До оплати: ' + Number(b.price || 0) + ' грн<br>' +
        '<button class="small-btn green" onclick="payFromClientCabinetFinal(&quot;' + esc(b.id) + '&quot;)">Оплатити</button>';
      host.prepend(div);
    });
  }
  window.payFromClientCabinetFinal = function(id){
    markPaid(id);
    rerender();
  };

  function bind(){
    var form = document.getElementById('bookingForm');
    if(form && form.dataset.finalBookingFlow !== 'yes'){
      form.dataset.finalBookingFlow = 'yes';
      form.addEventListener('submit', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        startFlow(false);
      }, true);
    }

    var urgentBtn = document.getElementById('urgentNoTimeBtn');
    if(urgentBtn && urgentBtn.dataset.finalBookingFlow !== 'yes'){
      urgentBtn.dataset.finalBookingFlow = 'yes';
      urgentBtn.onclick = function(){
        if(!isUrgent(selectedService())){
          alert('Спочатку оберіть термінову консультацію.');
          return;
        }
        startFlow(true);
      };
    }
  }

  function rerender(){
    if(typeof renderAll === 'function') renderAll();
    setTimeout(run, 0);
  }
  function run(){
    bind();
    adminPanels();
    clientPaymentPanels();
  }

  var old = window.renderAll || null;
  if(typeof old === 'function' && !window.__bookingFlowFinal){
    window.__bookingFlowFinal = true;
    window.renderAll = function(){
      old();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded', function(){
    run();
    setTimeout(run, 300);
  });
})();
