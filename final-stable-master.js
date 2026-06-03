
(function(){
  const $ = (id)=>document.getElementById(id);
  const esc = (s)=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const read = (k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}};
  const write = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const pad=(n)=>String(n).padStart(2,'0');
  const localISO=(d)=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const today=()=>localISO(new Date());
  const tomorrow=()=>{const d=new Date(); d.setDate(d.getDate()+1); return localISO(d)};
  const fmt=(iso)=>{const p=String(iso||'').split('-'); return p.length===3?`${p[2]}-${p[1]}-${p[0]}`:iso};

  function seed(){
    const site = read('psy_site',{});
    Object.assign(site,{
      psychologistName: site.psychologistName && site.psychologistName !== 'Імʼя Психолога' ? site.psychologistName : 'Анастасія Марчук',
      homeTitle: site.homeTitle || 'Психотерапевт для важливих розмов',
      homeText: site.homeText || 'Підтримка при тривозі, стресі, емоційному вигоранні, депресивних станах, адаптації до змін і труднощах у стосунках.',
      aboutIntro: site.aboutIntro || 'Дипломований спеціаліст, практикуючий психотерапевт.',
      aboutTitle: site.aboutTitle || 'Професійний підхід',
      aboutText: site.aboutText || 'Анастасія допомагає клієнтам краще розуміти свої стани, знаходити внутрішні ресурси й поступово проходити складні періоди. У роботі поєднує уважне слухання, творчі методи, глибинне дослідження переживань і фокус на реальних змінах.',
      aboutBulletsText: site.aboutBulletsText || 'Індивідуальні консультації для дорослих\nРобота з тривогою, стресом і вигоранням\nПідтримка у стосунках та адаптації до змін\nКонфіденційний формат',
      homeTagsText: site.homeTagsText || 'Конфіденційно\nОнлайн\nОфлайн\nZoom'
    });
    write('psy_site', site);

    if(!read('psy_about_facts',[]).length) write('psy_about_facts',[
      {label:'Вік', value:'41', order:1},
      {label:'Досвід', value:'14 років', order:2},
      {label:'Мови', value:'Українська, російська', order:3},
      {label:'Формат', value:'Індивідуальна терапія', order:4}
    ]);
    if(!read('psy_about_custom_windows',[]).length) write('psy_about_custom_windows',[
      {title:'Основна експертиза', text:'Стосунки, тривога, стрес, адаптація до змін, депресивні стани.', order:1},
      {title:'Методи роботи', text:'Арт-терапія, психодинамічний і системний підхід, екзистенційний аналіз та логотерапія.', order:2},
      {title:'Освіта', text:'Практична психологія, досвід індивідуальної роботи з дорослими клієнтами.', order:3}
    ]);

    let types = read('psy_service_categories',[]);
    if(!types.length){
      types = [
        {id:'type_regular', title:'Персональна терапія', description:'Планові консультації з записом від наступного дня.', urgent:false, order:1},
        {id:'type_urgent', title:'Термінові консультації', description:'Консультації сьогодні або запит без часу через Telegram.', urgent:true, order:2}
      ];
      write('psy_service_categories',types);
    } else if(!types.some(t=>t.urgent || String(t.title).toLowerCase().includes('термін'))){
      types.push({id:'type_urgent', title:'Термінові консультації', description:'Консультації сьогодні або запит без часу.', urgent:true, order:types.length+1});
      write('psy_service_categories',types);
    }
    const allTypes = read('psy_service_categories',[]);
    const urgentType = allTypes.find(t=>t.urgent || String(t.title).toLowerCase().includes('термін'));
    const regularType = allTypes.find(t=>!t.urgent) || {title:'Персональна терапія'};
    let services = read('psy_services',[]);
    if(!services.length){
      services = [
        {id:'srv_regular', title:'Індивідуальна консультація', category:regularType.title, format:'Онлайн / офлайн', duration:'50 хв', price:1500, text:'Особиста зустріч для роботи з вашим запитом.'},
        {id:'srv_urgent', title:'Термінова консультація', category:urgentType.title, format:'Онлайн', duration:'50 хв', price:3000, text:'Для ситуацій, коли консультація потрібна сьогодні. Після запиту психолог підтверджує консультацію.'}
      ];
      write('psy_services',services);
    } else if(!services.some(s=>String(s.title).toLowerCase().includes('термін') || s.category === urgentType.title)){
      services.push({id:'srv_urgent', title:'Термінова консультація', category:urgentType.title, format:'Онлайн', duration:'50 хв', price:3000, text:'Для ситуацій, коли консультація потрібна сьогодні. Після запиту психолог підтверджує консультацію.'});
      write('psy_services',services);
    }
  }

  const site=()=>read('psy_site',{});
  const services=()=>read('psy_services',[]);
  const types=()=>read('psy_service_categories',[]).sort((a,b)=>(a.order||0)-(b.order||0));
  const slots=()=>read('psy_slots',[]);
  const bookings=()=>read('psy_bookings',[]);
  const daysOff=()=>read('psy_days_off',[]);
  const contacts=()=>read('psy_contacts',[]);
  const serviceType=(s)=>types().find(t=>t.title===s.category);
  const isUrgent=(s)=>!!s && ((serviceType(s)&&serviceType(s).urgent) || String(s.title||'').toLowerCase().includes('термін') || String(s.category||'').toLowerCase().includes('термін'));
  window.serviceIsUrgent = isUrgent;

  function activeNav(){
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a=>{
      const href=(a.getAttribute('href')||'').split('#')[0] || 'index.html';
      const active = href===page || (page==='' && href==='index.html');
      a.classList.toggle('active-nav', active);
      if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
  }

  function renderSiteText(){
    const s=site();
    document.querySelectorAll('[data-site]').forEach(el=>{
      const key=el.dataset.site;
      if(s[key] !== undefined) el.textContent = s[key];
    });
    const bullets=$('aboutBullets');
    if(bullets){
      bullets.innerHTML = String(s.aboutBulletsText || '').split('\n').filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join('');
    }
  }

  function renderFooter(){
    const box=$('footerContacts'); if(!box) return;
    const items = contacts().length ? contacts() : [
      {title:'Instagram', value:'Instagram', link:'#'},
      {title:'Telegram', value:'Telegram', link:'#'},
      {title:'Facebook', value:'Facebook', link:'#'},
      {title:'Телефон', value:'+380000000000', link:'tel:+380000000000'},
      {title:'Email', value:'psychologist@example.com', link:'mailto:psychologist@example.com'}
    ];
    const type = c => {
      const s=((c.title||'')+' '+(c.value||'')+' '+(c.link||'')).toLowerCase();
      if(s.includes('instagram')) return ['instagram','IG'];
      if(s.includes('telegram')||s.includes('t.me')) return ['telegram','TG'];
      if(s.includes('facebook')||s.includes('fb.com')) return ['facebook','FB'];
      if(s.includes('@')) return ['email','@'];
      return ['phone','☎'];
    };
    box.innerHTML = items.map(c=>{const [cls,label]=type(c); return `<a href="${esc(c.link||'#')}" target="_blank"><span class="social-icon-svg ${cls}">${label}</span><b>${esc(c.value||c.title)}</b></a>`}).join('');
  }

  function renderPhotos(){
    const s=site();
    const photo=s.photoUrl||s.homePhotoUrl||'';
    const home=s.homePhotoUrl||s.photoUrl||'';
    if($('psychologistPhoto') && photo) $('psychologistPhoto').innerHTML=`<img src="${photo}" alt="Фото психолога">`;
    if($('homePsychologistPhoto') && home) $('homePsychologistPhoto').innerHTML=`<img src="${home}" alt="Фото психолога">`;
  }

  async function imageFileToData(file){
    const url=URL.createObjectURL(file);
    try{
      const img=await new Promise((res,rej)=>{const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=url;});
      const max=1400; let w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
      if(w>max||h>max){ if(w>=h){h=Math.round(h*(max/w)); w=max;} else {w=Math.round(w*(max/h)); h=max;} }
      const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext('2d'); ctx.fillStyle='#fffaf3'; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h);
      return canvas.toDataURL('image/jpeg',.82);
    } finally { URL.revokeObjectURL(url); }
  }
  function bindPhotoInputs(){
    [['psychologistPhotoFile','photoUrl','homePhotoUrl'],['homePhotoFile','homePhotoUrl',null]].forEach(([id,key,also])=>{
      const input=$(id); if(!input || input.dataset.masterPhoto==='yes') return;
      input.dataset.masterPhoto='yes';
      input.addEventListener('change', async()=>{
        const f=input.files && input.files[0]; if(!f) return;
        const data=await imageFileToData(f);
        const s=site(); s[key]=data; if(also) s[also]=data; write('psy_site',s); renderPhotos();
        let status=$(id+'Status'); if(!status){status=document.createElement('small'); status.id=id+'Status'; status.className='photo-save-status'; input.insertAdjacentElement('afterend',status);}
        status.textContent='Фото збережено і додано на сайт';
      });
    });
  }

  function renderAbout(){
    const factsBox=$('aboutFactsGrid');
    if(factsBox){
      const facts=read('psy_about_facts',[]).sort((a,b)=>(a.order||0)-(b.order||0));
      factsBox.innerHTML=facts.map(f=>`<article><span>${esc(f.label)}</span><strong>${esc(f.value)}</strong></article>`).join('');
    }
    const custom=$('aboutCustomWindows');
    if(custom){
      custom.innerHTML=read('psy_about_custom_windows',[]).sort((a,b)=>(a.order||0)-(b.order||0)).map(w=>`<article class="about-custom-card reveal visible"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></article>`).join('');
    }
  }

  function renderServices(){
    const grid=$('servicesGrid'), select=$('bookingService'), filters=$('serviceCategoryFilters');
    const allTypes=types(), allServices=services();
    window.currentServiceCategory = window.currentServiceCategory || 'all';
    if(filters){
      filters.innerHTML = `<button class="filter-btn ${window.currentServiceCategory==='all'?'active':''}" data-cat="all">Усі</button>` + allTypes.map(t=>`<button class="filter-btn ${window.currentServiceCategory===t.title?'active':''}" data-cat="${esc(t.title)}">${esc(t.title)}</button>`).join('');
      filters.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{window.currentServiceCategory=b.dataset.cat; renderServices();});
    }
    if(grid){
      const shownTypes = window.currentServiceCategory==='all' ? allTypes : allTypes.filter(t=>t.title===window.currentServiceCategory);
      grid.innerHTML = shownTypes.map(t=>{
        const list=allServices.filter(s=>(s.category||allTypes[0]?.title)===t.title);
        if(!list.length) return '';
        return `<section class="service-type-group"><div class="service-type-head"><p class="eyebrow">${t.urgent?'Терміново':'Тип консультацій'}</p><h2>${esc(t.title)}</h2><p>${esc(t.description||'')}</p></div><div class="cards">${list.map(s=>`<article class="service-card reveal visible ${isUrgent(s)?'urgent-service':''}"><div class="service-tag">${esc(s.format||'')}</div><h3>${esc(s.title)}</h3><p>${esc(s.text||'')}</p><p>${esc(s.duration||'')}</p><div class="price">${Number(s.price||0)} грн</div><button class="btn primary open-booking" data-service="${esc(s.title)}">${isUrgent(s)?'Терміновий запис':'Обрати час'}</button></article>`).join('')}</div></section>`;
      }).join('');
      grid.querySelectorAll('.open-booking').forEach(btn=>btn.onclick=()=>{
        if(select){ select.value=btn.dataset.service; select.dispatchEvent(new Event('change',{bubbles:true})); updateCustomSelects(); }
        $('booking')?.scrollIntoView({behavior:'smooth'});
      });
    }
    if(select){
      const current=select.value;
      select.innerHTML='<option value="">Оберіть консультацію</option>'+allServices.map(s=>`<option value="${esc(s.title)}">${esc(s.title)} — ${Number(s.price||0)} грн</option>`).join('');
      if(allServices.some(s=>s.title===current)) select.value=current;
    }
  }

  function selectedService(){ return services().find(s=>s.title===($('bookingService')?.value||'')); }
  function takenKeys(){ return bookings().filter(b=>b.status!=='cancelled' && b.time).map(b=>`${b.date}_${b.time}`); }
  function available(date){
    const s=selectedService(); if(!s) return [];
    const min=isUrgent(s)?today():tomorrow();
    if(date<min) return [];
    return slots().filter(sl=>sl.date===date && !takenKeys().includes(`${sl.date}_${sl.time}`) && !daysOff().includes(sl.date));
  }
  window.availableForBooking=available;

  function updateTimes(){
    const d=$('bookingDate'), t=$('bookingTime'); if(!d||!t) return;
    const arr=d.value?available(d.value):[];
    t.innerHTML = !d.value ? '<option value="">Спочатку оберіть дату</option>' : arr.length ? '<option value="">Оберіть час</option>'+arr.map(s=>`<option value="${esc(s.time)}">${esc(s.time)} — ${s.format==='offline'?'офлайн':'онлайн'}</option>`).join('') : '<option value="">Немає доступного часу</option>';
    updateCustomSelects();
  }
  window.updateTimes=updateTimes;

  function renderDateStrip(){
    const strip=$('bookingDateStrip'), dateInput=$('bookingDate'); if(!strip||!dateInput) return;
    const s=selectedService();
    const start=new Date();
    if(!isUrgent(s)) start.setDate(start.getDate()+1);
    const days=[];
    for(let i=0;i<35;i++){
      const d=new Date(start); d.setDate(start.getDate()+i);
      const iso=localISO(d), arr=available(iso);
      if(arr.length) days.push({iso,label:fmt(iso),weekday:d.toLocaleDateString('uk-UA',{weekday:'short'}),count:arr.length, today:iso===today()&&isUrgent(s)});
    }
    if(!dateInput.value && days[0]) dateInput.value=days[0].iso;
    strip.innerHTML = days.length ? days.map(d=>`<button type="button" class="booking-date-card ${dateInput.value===d.iso?'active':''} ${d.today?'urgent-today':''}" data-date="${d.iso}"><strong>${d.label}</strong><small>${d.weekday} · ${d.count} год.</small></button>`).join('') : '<div class="booking-date-card normal-disabled">Немає доступних днів</div>';
    strip.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{dateInput.value=b.dataset.date; updateTimes(); renderDateStrip(); renderTimeGrid();});
    updateTimes(); renderTimeGrid();
  }
  window.renderBookingDateStrip=renderDateStrip;

  function renderTimeGrid(){
    const grid=$('bookingTimeGrid'), d=$('bookingDate'), t=$('bookingTime'); if(!grid||!d||!t) return;
    const arr=d.value?available(d.value):[];
    grid.innerHTML=arr.length?arr.map(s=>`<button type="button" class="time-pill ${t.value===s.time?'active':''}" data-time="${esc(s.time)}">${esc(s.time)}</button>`).join(''):'<div class="time-pill normal-disabled">Оберіть доступний день</div>';
    grid.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{t.value=b.dataset.time; renderTimeGrid(); updateCustomSelects();});
  }
  window.renderBookingTimeGrid=renderTimeGrid;

  function setUrgent(){
    const urgent=services().find(s=>isUrgent(s)), sel=$('bookingService');
    if(urgent&&sel){ sel.value=urgent.title; sel.dispatchEvent(new Event('change',{bubbles:true})); updateCustomSelects(); }
  }

  function toggleUrgentPanel(){
    const p=$('urgentRequestPanel');
    if(p) p.classList.toggle('active', isUrgent(selectedService()));
  }

  function bookingModal(html){
    let m=$('bookingFlowModal');
    if(!m){ m=document.createElement('div'); m.id='bookingFlowModal'; m.className='booking-flow-modal'; m.innerHTML='<div class="booking-flow-card" id="bookingFlowCard"></div>'; document.body.appendChild(m); m.onclick=e=>{if(e.target===m)m.classList.remove('active')}; }
    $('bookingFlowCard').innerHTML=html; m.classList.add('active');
  }
  window.closeBookingFlowModal=()=>$('bookingFlowModal')?.classList.remove('active');

  function getForm(noTime){
    const s=selectedService(); if(!s) return {error:'Оберіть консультацію.'};
    const data={service:s, urgent:isUrgent(s), noTime, fullName:$('clientFullName')?.value.trim(), email:($('clientEmail')?.value||'').trim().toLowerCase(), phone:$('clientPhone')?.value.trim(), social:$('clientSocial')?.value.trim(), comment:$('clientComment')?.value.trim(), date:noTime?today():$('bookingDate')?.value, time:noTime?'':$('bookingTime')?.value, price:Number(s.price||0)};
    if(!data.fullName||!data.email||!data.phone) return {error:'Заповніть ПІБ, пошту та телефон.'};
    if(!noTime&&(!data.date||!data.time)) return {error:'Оберіть дату та час.'};
    return data;
  }
  function rows(d){ return `<div class="booking-flow-row"><span>Консультація</span><strong>${esc(d.service.title||d.service)}</strong></div><div class="booking-flow-row"><span>Дата</span><strong>${d.noTime?'Узгоджується':fmt(d.date)}</strong></div><div class="booking-flow-row"><span>Час</span><strong>${d.noTime?'Узгоджується з психологом':esc(d.time)+' · за Києвом'}</strong></div><div class="booking-flow-row"><span>Клієнт</span><strong>${esc(d.fullName)}</strong></div><div class="booking-flow-row"><span>Контакти</span><strong>${esc(d.phone)}<br>${esc(d.email)}${d.social?'<br>'+esc(d.social):''}</strong></div><div class="booking-flow-row"><span>Вартість</span><strong>${d.price} грн</strong></div>`; }
  function startBooking(noTime){
    const d=getForm(noTime); if(d.error){alert(d.error); return;}
    bookingModal(`<h2>Підтвердження запису</h2><p>${d.urgent?'Терміновий запит потребує підтвердження психолога.':'Перевірте дані перед оплатою.'}</p>${rows(d)}<div class="booking-flow-actions"><button class="btn primary" id="confirmBookingBtn">Підтвердити</button><button class="btn secondary" onclick="closeBookingFlowModal()">Назад</button></div>`);
    $('confirmBookingBtn').onclick=()=>createBooking(d);
  }
  function createBooking(d){
    const b={id:'b'+Date.now(), clientFullName:d.fullName, clientEmail:d.email, clientPhone:d.phone, clientSocial:d.social, service:d.service.title, price:d.price, date:d.date, time:d.time, noTime:d.noTime, comment:d.comment||'', status:d.urgent?'urgent_requested':'awaiting_payment', urgent:d.urgent, zoom:site().zoomLink||'Zoom-посилання буде додано психологом', createdAt:new Date().toISOString()};
    const arr=bookings(); arr.push(b); write('psy_bookings',arr); localStorage.psy_client_email=d.email;
    if(d.urgent){
      bookingModal(`<h2>Терміновий запит створено</h2><p>Психолог підтвердить запит у кабінеті. Після цього у клієнта зʼявиться оплата.</p>${rows({...d,service:{title:b.service}})}<div class="booking-flow-actions"><a class="btn primary" href="${esc(site().telegramUrl||'#')}" target="_blank">Написати в Telegram</a><a class="btn secondary" href="client-dashboard.html">Мій кабінет</a></div>`);
    } else paymentStep(b);
  }
  function paymentStep(b){
    bookingModal(`<h2>Оплата консультації</h2><p>Оплата буде підключена наступним етапом. Зараз це демо-крок, щоб схема працювала повністю.</p><div class="payment-placeholder"><strong>До оплати: ${Number(b.price||0)} грн</strong><br>Тут буде LiqPay / WayForPay.</div><div class="booking-flow-actions"><button class="btn primary" id="demoPayBtn">Оплату виконано</button><button class="btn secondary" onclick="closeBookingFlowModal()">Пізніше</button></div>`);
    $('demoPayBtn').onclick=()=>markPaid(b.id);
  }
  function markPaid(id){
    let paid=null, arr=bookings().map(b=>b.id===id?(paid={...b,status:'paid',paidAt:new Date().toISOString(),zoom:site().zoomLink||'Zoom-посилання буде додано психологом'}):b);
    write('psy_bookings',arr);
    bookingModal(`<h2>Запис підтверджено</h2><p>Запис збережено в кабінеті клієнта.</p><div class="zoom-box"><strong>Zoom / посилання:</strong><br>${esc(paid.zoom)}</div><div class="booking-flow-actions"><a class="btn primary" href="client-dashboard.html">Мій кабінет</a><button class="btn secondary" onclick="closeBookingFlowModal()">Закрити</button></div>`);
  }
  window.payFromClientCabinetFinal=markPaid;

  function bindBooking(){
    const form=$('bookingForm');
    if(form && form.dataset.masterBound!=='yes'){
      form.dataset.masterBound='yes';
      form.addEventListener('submit',e=>{e.preventDefault(); e.stopImmediatePropagation(); startBooking(false);},true);
    }
    const urgent=$('urgentNoTimeBtn');
    if(urgent && urgent.dataset.masterBound!=='yes'){ urgent.dataset.masterBound='yes'; urgent.onclick=()=>startBooking(true); }
    const sel=$('bookingService');
    if(sel && sel.dataset.masterBound!=='yes'){ sel.dataset.masterBound='yes'; sel.addEventListener('change',()=>{ if($('bookingDate')) $('bookingDate').value=''; if($('bookingTime')) $('bookingTime').value=''; toggleUrgentPanel(); renderDateStrip(); updateCustomSelects(); });}
    const standalone=$('urgentStandaloneBtn');
    if(standalone && standalone.dataset.masterBound!=='yes'){ standalone.dataset.masterBound='yes'; standalone.onclick=()=>setTimeout(setUrgent,50); }
  }

  function renderAdminCalendar(){
    const grid=$('adminCalendar'), title=$('calendarTitle'); if(!grid||!title) return;
    window.calDate = window.calDate || new Date();
    window.selectedDate = window.selectedDate || today();
    const y=window.calDate.getFullYear(), m=window.calDate.getMonth(), first=new Date(y,m,1), start=new Date(first), offset=(first.getDay()+6)%7; start.setDate(first.getDate()-offset);
    title.textContent=window.calDate.toLocaleDateString('uk-UA',{month:'long',year:'numeric'});
    grid.innerHTML=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(n=>`<div class="calendar-day-name">${n}</div>`).join('');
    for(let i=0;i<42;i++){
      const d=new Date(start); d.setDate(start.getDate()+i); const iso=localISO(d), off=daysOff().includes(iso);
      const sl=slots().filter(s=>s.date===iso), bs=bookings().filter(b=>b.date===iso&&b.status!=='cancelled');
      grid.innerHTML += `<div class="calendar-day ${d.getMonth()!==m?'other':''} ${off?'off':''} ${iso===window.selectedDate?'selected':''}" data-date="${iso}"><div class="day-number">${d.getDate()}</div>${off?'<span class="slot-chip request">Вихідний</span>':''}${!off?sl.map(s=>`<span class="slot-chip free">${esc(s.time)}</span>`).join(''):''}${bs.map(b=>`<span class="slot-chip ${b.urgent?'urgent':(String(b.status).includes('request')?'request':'booked')}">${esc(b.time||'без часу')}</span>`).join('')}</div>`;
    }
    grid.querySelectorAll('.calendar-day[data-date]').forEach(day=>day.onclick=()=>{ window.selectedDate=day.dataset.date; document.querySelectorAll('.calendar-day').forEach(x=>x.classList.remove('selected')); day.classList.add('selected'); renderDayPanelClean(); });
    renderDayPanelClean();
  }
  function renderDayPanelClean(){
    const title=$('selectedDayTitle'), slotDate=$('slotDate'), box=$('selectedDaySlots'); if(!title||!slotDate||!box) return;
    title.textContent=fmt(window.selectedDate); slotDate.value=window.selectedDate; slotDate.min=today();
    const free=slots().filter(s=>s.date===window.selectedDate), booked=bookings().filter(b=>b.date===window.selectedDate);
    box.innerHTML = [...free.map(s=>`<div class="slot-item"><strong>${esc(s.time)}</strong> · ${s.format==='offline'?'офлайн':'онлайн'}<div class="item-actions"><button class="small-btn danger" onclick="deleteSlot('${s.id}')">Видалити</button></div></div>`), ...booked.map(b=>`<div class="booking-item"><strong>${esc(b.time||'без часу')} · ${esc(b.clientFullName)}</strong><br>${esc(b.service)}<br>${esc(b.status)}<div class="item-actions"><button class="small-btn" onclick="showBooking('${b.id}')">Деталі</button></div></div>`)].join('') || '<div class="slot-item">Немає годин.</div>';
  }
  window.renderCalendar=renderAdminCalendar;
  window.selectDay=(iso)=>{window.selectedDate=iso; renderAdminCalendar();};

  function createSelectUI(select){
    if(!select || select.dataset.customUi==='yes') return;
    select.dataset.customUi='yes';
    const wrap=document.createElement('div'); wrap.className='custom-select-ui';
    const button=document.createElement('button'); button.type='button'; button.className='custom-select-button';
    const menu=document.createElement('div'); menu.className='custom-select-menu';
    wrap.appendChild(button); wrap.appendChild(menu); select.insertAdjacentElement('afterend',wrap);
    function render(){
      const selected=select.options[select.selectedIndex];
      button.innerHTML='<span>'+esc(selected?selected.textContent.trim():'Оберіть')+'</span>';
      menu.innerHTML=Array.from(select.options).map(opt=>`<button type="button" class="custom-select-option ${opt.value===select.value?'active':''}" data-value="${esc(opt.value)}">${esc(opt.textContent.trim())}</button>`).join('');
      menu.querySelectorAll('[data-value]').forEach(item=>item.onclick=(e)=>{e.stopPropagation(); select.value=item.dataset.value; select.dispatchEvent(new Event('change',{bubbles:true})); wrap.classList.remove('open'); render();});
    }
    button.onclick=(e)=>{e.stopPropagation(); document.querySelectorAll('.custom-select-ui.open').forEach(x=>{if(x!==wrap)x.classList.remove('open')}); wrap.classList.toggle('open'); render();};
    select.addEventListener('change',render); render();
  }
  function updateCustomSelects(){
    document.querySelectorAll('select[data-custom-ui="yes"]').forEach(sel=>{
      const wrap=sel.nextElementSibling;
      if(wrap && wrap.classList.contains('custom-select-ui')){
        const selected=sel.options[sel.selectedIndex];
        const btn=wrap.querySelector('.custom-select-button span');
        if(btn) btn.textContent = selected ? selected.textContent.trim() : 'Оберіть';
      }
    });
  }
  window.updateCustomSelects=updateCustomSelects;
  function bindCustomUI(){
    createSelectUI($('bookingService'));
    createSelectUI($('bookingTime'));
    const date=$('bookingDate');
    if(date && date.dataset.masterDateUi!=='yes'){
      date.dataset.masterDateUi='yes';
      const label=document.createElement('div'); label.className='custom-field-label'; label.textContent='Оберіть дату';
      date.insertAdjacentElement('afterend',label);
    }
  }

  function clientPaymentPanels(){
    const host=$('clientBookings'); if(!host) return;
    const email=localStorage.psy_client_email || '';
    bookings().filter(b=>b.clientEmail===email && b.status==='awaiting_payment').forEach(b=>{
      if(host.querySelector(`[data-master-pay="${b.id}"]`)) return;
      const div=document.createElement('div'); div.className='client-pay-box'; div.dataset.masterPay=b.id;
      div.innerHTML=`<strong>Очікує оплату</strong><br>${esc(b.service)}<br>${b.noTime?'Час узгоджується':fmt(b.date)+' · '+esc(b.time)}<br>До оплати: ${Number(b.price||0)} грн<br><button class="small-btn green" onclick="payFromClientCabinetFinal('${b.id}')">Оплатити</button>`;
      host.prepend(div);
    });
  }

  function adminUrgentPanels(){
    const host=$('adminBookings'); if(!host) return;
    const old=$('adminUrgentRequestsMaster'); if(old) old.remove();
    const urgent=bookings().filter(b=>b.urgent && b.status==='urgent_requested');
    if(!urgent.length) return;
    const panel=document.createElement('div'); panel.id='adminUrgentRequestsMaster'; panel.className='admin-card admin-urgent-panel';
    panel.innerHTML='<h2>Термінові запити</h2>'+urgent.map(b=>`<div class="booking-item urgent-request"><strong>${esc(b.clientFullName)}</strong><br>${esc(b.service)}<br>${b.noTime?'Час узгоджується':fmt(b.date)+' · '+esc(b.time)}<br>Вартість: ${Number(b.price||0)} грн<div class="item-actions"><button class="small-btn green" onclick="confirmUrgentRequestMaster('${b.id}')">Підтвердити</button><button class="small-btn danger" onclick="declineUrgentRequestMaster('${b.id}')">Відхилити</button></div></div>`).join('');
    host.prepend(panel);
  }
  window.confirmUrgentRequestMaster=(id)=>{write('psy_bookings', bookings().map(b=>b.id===id?{...b,status:'awaiting_payment',urgentConfirmedAt:new Date().toISOString()}:b)); run();};
  window.declineUrgentRequestMaster=(id)=>{write('psy_bookings', bookings().map(b=>b.id===id?{...b,status:'urgent_declined'}:b)); run();};

  function run(){
    seed();
    activeNav();
    renderSiteText();
    renderFooter();
    renderPhotos();
    bindPhotoInputs();
    renderAbout();
    renderServices();
    bindBooking();
    bindCustomUI();
    toggleUrgentPanel();
    renderDateStrip();
    renderAdminCalendar();
    clientPaymentPanels();
    adminUrgentPanels();
    updateCustomSelects();
  }

  const old=window.renderAll;
  if(typeof old==='function' && !window.__stableMaster){
    window.__stableMaster=true;
    window.renderAll=function(){ old(); run(); };
  }
  document.addEventListener('click',()=>document.querySelectorAll('.custom-select-ui.open').forEach(x=>x.classList.remove('open')));
  document.addEventListener('DOMContentLoaded',()=>{run(); setTimeout(run,300); setTimeout(run,900);});
})();
