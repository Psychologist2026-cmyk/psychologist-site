
/* demo client safety seed */
(function(){
  try{
    const raw = localStorage.getItem('psy_clients');
    const arr = raw ? JSON.parse(raw) : [];
    if(!arr.some(c => c.email === 'client@psyspace.ua')){
      arr.push({email:'client@psyspace.ua',name:'Тестовий клієнт',password:'123456',phone:'+380000000000',social:'@client',photo:''});
      localStorage.setItem('psy_clients', JSON.stringify(arr));
    }
  }catch(e){}
})();


const OWNER_EMAIL = 'psychologist@example.com';
const OWNER_PASSWORD = '123456';

const FIREBASE_GOOGLE_READY = {
  enabled: false,
  config: { apiKey:'', authDomain:'', projectId:'', appId:'' }
};

const D_SITE = {
  homeEyebrow:'Особисті консультації',
  homeTitle:'Спокійний простір для важливих розмов',
  homeText:'Індивідуальна робота з тривогою, напругою, стосунками, самооцінкою та складними періодами.',
  homeTagsText:'Конфіденційно\nОнлайн\nОфлайн\nZoom',
  psychologistName:'Імʼя Психолога',
  aboutIntro:'Коротко про спеціаліста, досвід і підхід.',
  aboutTitle:'Підхід до роботи',
  aboutText:'Тут буде основний опис.',
  aboutBulletsText:'Індивідуальні консультації\nПідтримка у складні періоди\nКонфіденційний формат',
  photoUrl:'',
  telegramUrl:'https://t.me/USERNAME',
  zoomLink:'',
  privacyText:'Сайт збирає дані, необхідні для запису та звʼязку з клієнтом.'
};

const D_SERVICES = [
  {id:'s1', title:'Індивідуальна консультація', format:'Онлайн', duration:'50 хв', price:1500, text:'Особиста зустріч для роботи з вашим запитом.'},
  {id:'s2', title:'Офлайн консультація', format:'Офлайн', duration:'50 хв', price:1800, text:'Зустріч у кабінеті за доступним містом і часом.'}
];

const D_DIRECTIONS = [
  {id:'d1', title:'Тривога', text:'Робота з напругою та внутрішнім неспокоєм.'},
  {id:'d2', title:'Вигорання', text:'Підтримка при виснаженні та втраті ресурсу.'},
  {id:'d3', title:'Стосунки', text:'Кордони, конфлікти, повторювані сценарії.'}
];

const D_CONTACTS = [
  {id:'c1', title:'Telegram', value:'@USERNAME', link:'https://t.me/USERNAME'},
  {id:'c2', title:'Email', value:'psychologist@example.com', link:'mailto:psychologist@example.com'}
];

const D_CERTS = [{id:'cert1', title:'Сертифікат 1', category:'Освіта', image:''}];
const D_REVIEWS = [{id:'r1', name:'Клієнт', text:'Дякую за підтримку.', status:'published'}];
const D_FAQ = [{id:'f1', q:'Як проходить зустріч?', a:'Після запису ви отримаєте деталі зустрічі.'}];
const D_SLOTS = [
  {id:'sl1', date:'2026-06-05', time:'10:00', format:'online', city:''},
  {id:'sl2', date:'2026-06-05', time:'12:00', format:'online', city:''},
  {id:'sl3', date:'2026-06-06', time:'14:00', format:'offline', city:'Київ'}
];
const D_CLIENTS = [{email:'client@example.com', name:'Тестовий Клієнт', password:'123456', phone:'+380991112233', social:'@client_demo', photo:''}];

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function esc(s){ return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function get(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e) { return fallback; } }
function set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

function init(){
  const defaults = [
    ['psy_site',D_SITE],['psy_services',D_SERVICES],['psy_directions',D_DIRECTIONS],
    ['psy_contacts',D_CONTACTS],['psy_certs',D_CERTS],['psy_reviews',D_REVIEWS],
    ['psy_faq',D_FAQ],['psy_slots',D_SLOTS],['psy_bookings',[]],
    ['psy_days_off',[]],['psy_clients',D_CLIENTS],['psy_about_extra',[]]
  ];
  defaults.forEach(([key,value]) => {
    if(!localStorage.getItem(key)) set(key,value);
  });
  // guarantee demo client exists even if old localStorage already exists
  const cs = get('psy_clients',[]);
  if(!cs.some(c => c.email === 'client@example.com')){
    cs.push(D_CLIENTS[0]);
    set('psy_clients', cs);
  }
}
init();

const site=()=>get('psy_site',D_SITE);
const services=()=>get('psy_services',D_SERVICES);
const directions=()=>get('psy_directions',D_DIRECTIONS);
const contacts=()=>get('psy_contacts',D_CONTACTS);
const certs=()=>get('psy_certs',D_CERTS);
const reviews=()=>get('psy_reviews',D_REVIEWS);
const faqs=()=>get('psy_faq',D_FAQ);
const slots=()=>get('psy_slots',D_SLOTS);
const bookings=()=>get('psy_bookings',[]);
const daysOff=()=>get('psy_days_off',[]);
const clients=()=>get('psy_clients',D_CLIENTS);

function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function openModal(html){
  const m=document.getElementById('appModal'), b=document.getElementById('modalBody');
  if(m && b){ b.innerHTML=html; m.classList.add('active'); }
}

const modalClose=document.getElementById('modalClose');
if(modalClose) modalClose.addEventListener('click',()=>document.getElementById('appModal').classList.remove('active'));

const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
if(menuBtn && nav) menuBtn.addEventListener('click',()=>{ nav.classList.toggle('active'); menuBtn.classList.toggle('active'); });

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); }),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function currentClient(){
  return clients().find(c => c.email === localStorage.psy_client_email);
}

function applySite(){
  const s=site();
  document.querySelectorAll('[data-site], [data-field]').forEach(el=>{
    const key = el.dataset.site || el.dataset.field;
    if(s[key] !== undefined) el.textContent=s[key];
  });
  const tg=document.getElementById('telegramFloat'); if(tg) tg.href=s.telegramUrl || '#';
  const tags=document.getElementById('homeTags');
  if(tags) tags.innerHTML=(s.homeTagsText || '').split('\n').filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
  const bullets=document.getElementById('aboutBullets');
  if(bullets) bullets.innerHTML=(s.aboutBulletsText || '').split('\n').filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join('');
  const ph=document.getElementById('psychologistPhoto');
  if(ph && s.photoUrl) ph.innerHTML=`<img src="${esc(s.photoUrl)}" alt="Фото психолога">`;
  const privacy=document.getElementById('privacyBlock');
  if(privacy) privacy.innerHTML=`<p>${esc(s.privacyText || '').replace(/\n/g,'</p><p>')}</p>`;
}

window.currentCertFilter = window.currentCertFilter || 'all';

function certificateCategories(){
  const base = ['Усі'];
  certs().forEach(c => {
    const cat = c.category || 'Інше';
    if(!base.includes(cat)) base.push(cat);
  });
  return base;
}

function renderCertificateToolbar(){
  const bar = document.getElementById('certificateToolbar');
  if(!bar) return;
  bar.innerHTML = certificateCategories().map(cat => {
    const value = cat === 'Усі' ? 'all' : cat;
    const active = window.currentCertFilter === value ? 'active' : '';
    return `<button class="filter-btn ${active}" data-cert-filter="${esc(value)}" type="button">${esc(cat)}</button>`;
  }).join('');
  bar.querySelectorAll('[data-cert-filter]').forEach(btn => {
    btn.onclick = () => { window.currentCertFilter = btn.dataset.certFilter; renderAll(); };
  });
}

function renderCertCategoryOptions(){
  const list=document.getElementById('certCategoryList');
  if(!list) return;
  const categories=['Освіта','Курси','Семінари','Супервізії','Інше'];
  certs().forEach(c=>{ if(c.category && !categories.includes(c.category)) categories.push(c.category); });
  list.innerHTML=categories.map(c=>`<option value="${esc(c)}"></option>`).join('');
}

window.showCertificate=function(certId){
  const c=certs().find(x=>x.id===certId);
  if(!c || !c.image) return;
  if(String(c.image).startsWith('data:application/pdf')){
    openModal(`<h2>${esc(c.title)}</h2><p>${esc(c.category||'Інше')}</p><a class="btn primary full" href="${c.image}" target="_blank">Відкрити PDF</a>`);
  } else {
    openModal(`<h2>${esc(c.title)}</h2><p>${esc(c.category||'Інше')}</p><img src="${c.image}" style="width:100%;border-radius:18px;margin-top:12px;">`);
  }
};

function renderPublic(){
  applySite();

  const directionsGrid=document.getElementById('directionsGrid');
  if(directionsGrid) directionsGrid.innerHTML=directions().map((d,i)=>`<article class="info-card reveal visible"><div class="icon-bubble">${i+1}</div><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></article>`).join('');

  const extra=document.getElementById('aboutExtraGrid');
  if(extra) extra.innerHTML=get('psy_about_extra',[]).map(x=>`<article class="info-card reveal visible"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('');

  const servicesGrid=document.getElementById('servicesGrid');
  const bookingService=document.getElementById('bookingService');
  if(servicesGrid) servicesGrid.innerHTML=services().map(s=>`<article class="service-card reveal visible"><div class="service-tag">${esc(s.format)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><p>${esc(s.duration)}</p><div class="price">${s.price} грн</div><button class="btn primary open-booking" data-service="${esc(s.title)}">Обрати час</button></article>`).join('');
  if(bookingService) bookingService.innerHTML='<option value="">Оберіть консультацію</option>'+services().map(s=>`<option value="${esc(s.title)}">${esc(s.title)} — ${s.price} грн</option>`).join('');
  document.querySelectorAll('.open-booking').forEach(btn=>btn.addEventListener('click',()=>{ if(bookingService) bookingService.value=btn.dataset.service; document.getElementById('booking')?.scrollIntoView({behavior:'smooth'}); }));

  const certGrid=document.getElementById('certificatesGrid');
  if(certGrid){
    const f=window.currentCertFilter || 'all';
    const visible=certs().filter(c => f === 'all' || (c.category || 'Інше') === f);
    certGrid.innerHTML=visible.map(c=>`<article class="cert-card reveal visible">${c.image && !String(c.image).startsWith('data:application/pdf') ? `<img src="${c.image}" alt="">` : ''}<span>${esc(c.category || 'Інше')}</span><h3>${esc(c.title)}</h3>${c.image ? `<button class="small-btn" onclick="showCertificate('${c.id}')">Переглянути</button>` : ''}</article>`).join('');
  }

  const reviewsGrid=document.getElementById('reviewsGrid');
  if(reviewsGrid) reviewsGrid.innerHTML=reviews().filter(r=>r.status!=='hidden').map(r=>`<article class="review-card reveal visible"><p>“${esc(r.text)}”</p><strong>${esc(r.name)}</strong></article>`).join('');

  const faqList=document.getElementById('faqList');
  if(faqList) faqList.innerHTML=faqs().map((f,i)=>`<details ${i===0?'open':''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');

  const contactsGrid=document.getElementById('contactsGrid');
  if(contactsGrid) contactsGrid.innerHTML=contacts().map(c=>`<a class="contact-card reveal visible" href="${esc(c.link||'#')}" target="_blank"><h3>${esc(c.title)}</h3><p>${esc(c.value)}</p></a>`).join('');

  renderNextSlots();
}

function takenKeys(){ return bookings().filter(b=>b.status!=='cancelled').map(b=>`${b.date}_${b.time}`); }
function availableFor(date){
  const keys=takenKeys();
  return slots().filter(s=>s.date===date && !keys.includes(`${s.date}_${s.time}`) && !daysOff().includes(s.date) && s.date>=todayISO());
}

function updateTimes(){
  const d=document.getElementById('bookingDate'), t=document.getElementById('bookingTime');
  if(!d || !t) return;
  d.min=todayISO();
  const a=availableFor(d.value);
  t.innerHTML=!d.value ? '<option value="">Спочатку оберіть дату</option>' : a.length ? '<option value="">Оберіть час</option>'+a.map(s=>`<option value="${s.time}">${s.time} — ${s.format==='offline'?'офлайн':'онлайн'}${s.city?', '+s.city:''}</option>`).join('') : '<option value="">Немає вільного часу</option>';
}

function fillBookingFromClientProfile(){
  const client=currentClient();
  if(!client) return;
  const nameInput=document.getElementById('clientFullName');
  const emailInput=document.getElementById('clientEmail');
  const phoneInput=document.getElementById('clientPhone');
  const socialInput=document.getElementById('clientSocial');
  if(nameInput && !nameInput.value) nameInput.value=client.name || '';
  if(emailInput && !emailInput.value) emailInput.value=client.email || '';
  if(phoneInput && !phoneInput.value) phoneInput.value=client.phone || '';
  if(socialInput && !socialInput.value) socialInput.value=client.social || '';
}

document.getElementById('bookingDate')?.addEventListener('change',updateTimes);

document.getElementById('bookingForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const serviceTitle=document.getElementById('bookingService').value;
  const service=services().find(s=>s.title===serviceTitle);
  const time=document.getElementById('bookingTime').value;
  if(!time) return;
  const b={
    id:uid(),
    clientFullName:clientFullName.value,
    clientEmail:clientEmail.value.trim().toLowerCase(),
    clientPhone:clientPhone.value,
    clientSocial:clientSocial.value,
    service:serviceTitle,
    price:service ? service.price : 0,
    date:document.getElementById('bookingDate').value,
    time,
    comment:clientComment.value,
    status:'new',
    zoom:site().zoomLink,
    createdAt:new Date().toISOString()
  };
  const arr=bookings(); arr.push(b); set('psy_bookings',arr);
  let cs=clients();
  if(!cs.some(c=>c.email===b.clientEmail)){
    cs.push({email:b.clientEmail,name:b.clientFullName,password:'123456',phone:b.clientPhone,social:b.clientSocial,photo:''});
    set('psy_clients',cs);
  }
  bookingResult.style.display='block';
  bookingResult.innerHTML=`<strong>Запис створено.</strong><br>${esc(b.service)}<br>${b.date} о ${b.time}`;
  e.target.reset();
  updateTimes();
  renderAll();
});

document.getElementById('openReviewForm')?.addEventListener('click',()=>document.getElementById('reviewFormCard').classList.toggle('active'));

function addReview(name,text){
  const arr=reviews(); arr.push({id:uid(),name,text,status:'published'}); set('psy_reviews',arr); renderAll();
}

document.getElementById('publicReviewForm')?.addEventListener('submit',e=>{ e.preventDefault(); addReview(publicReviewName.value,publicReviewText.value); e.target.reset(); });
document.getElementById('clientReviewForm')?.addEventListener('submit',e=>{ e.preventDefault(); addReview(clientReviewName.value,clientReviewText.value); e.target.reset(); });

document.getElementById('unifiedAuthForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const email=document.getElementById('authEmail').value.trim().toLowerCase();
  const password=document.getElementById('authPassword').value;
  const name=document.getElementById('authName').value || email.split('@')[0];

  if(email === OWNER_EMAIL){
    if(password === OWNER_PASSWORD){
      localStorage.psy_admin_auth='yes';
      localStorage.removeItem('psy_client_email');
      location.href='admin.html';
    } else {
      openModal('<h2>Помилка</h2><p>Неправильний пароль психолога.</p>');
    }
    return;
  }

  let cs=clients();
  let client=cs.find(c=>c.email===email);
  if(!client){
    client={email,name,password,phone:'',social:'',photo:''};
    cs.push(client);
    set('psy_clients',cs);
  } else if(client.password && client.password !== password){
    openModal('<h2>Помилка</h2><p>Неправильний пароль клієнта.</p>');
    return;
  }

  localStorage.psy_client_email=email;
  localStorage.removeItem('psy_admin_auth');
  location.href='client-dashboard.html';
});

async function signInWithGooglePrepared(){
  openModal('<h2>Google-вхід</h2><p>Схема готова: треба створити Firebase project, увімкнути Google provider, додати домен Netlify і вставити Firebase config у script.js.</p>');
}
document.getElementById('googleClientBtn')?.addEventListener('click',signInWithGooglePrepared);

if(location.pathname.endsWith('admin.html') && localStorage.psy_admin_auth !== 'yes') location.href='auth.html';
if(location.pathname.endsWith('client-dashboard.html') && !localStorage.psy_client_email) location.href='auth.html';

document.getElementById('logoutBtn')?.addEventListener('click',e=>{
  e.preventDefault();
  localStorage.removeItem('psy_admin_auth');
  localStorage.removeItem('psy_client_email');
  location.href='auth.html';
});

document.querySelectorAll('.client-tab-btn').forEach(btn=>btn.addEventListener('click',()=>openClientTab(btn.dataset.clientTab)));
document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+btn.dataset.tab)?.classList.add('active');
}));

window.openClientTab=function(tab){
  document.querySelectorAll('.client-tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.client-tab').forEach(x=>x.classList.remove('active'));
  const btn=document.querySelector(`[data-client-tab="${tab}"]`);
  const panel=document.getElementById('client-tab-'+tab);
  if(btn) btn.classList.add('active');
  if(panel) panel.classList.add('active');
};

function statusLabel(s){
  return {new:'новий',confirmed:'підтверджено',completed:'завершено',cancelled:'скасовано',cancel_requested:'клієнт просить скасувати',change_requested:'клієнт просить перенести'}[s] || s;
}

function renderClient(){
  const email=localStorage.psy_client_email;
  const u=currentClient();

  const title=document.getElementById('clientDashboardTitle');
  if(title) title.textContent=u ? (u.name || 'Мій кабінет') : 'Мій кабінет';

  const heroPhoto=document.getElementById('clientHeroPhoto');
  if(heroPhoto) heroPhoto.innerHTML=u && u.photo ? `<img src="${u.photo}" alt="Фото">` : 'Фото';

  const cards=document.getElementById('clientMainCards');
  if(cards){
    const myBookings=bookings().filter(b=>b.clientEmail===email);
    const activeBookings=myBookings.filter(b=>b.status!=='cancelled');
    cards.innerHTML=
      `<article class="info-card"><h3>Найближчі записи</h3><p>${activeBookings.length} активних консультацій</p><div class="client-main-action"><a class="btn primary" href="services.html#booking">Записатись</a></div></article>`+
      `<article class="info-card"><h3>Профіль</h3><p>ПІБ, телефон, соцмережа та фото для автозаповнення форми запису.</p><div class="client-main-action"><button class="small-btn" type="button" onclick="openClientTab('profile')">Налаштування</button></div></article>`+
      `<article class="info-card"><h3>Історія</h3><p>Усі записи та запити на перенесення або скасування.</p><div class="client-main-action"><button class="small-btn" type="button" onclick="openClientTab('bookings')">Мої записи</button></div></article>`;
  }

  const box=document.getElementById('clientBookings');
  if(box){
    const list=bookings().filter(b=>b.clientEmail===email);
    box.innerHTML=list.length ? list.map(b=>
      `<div class="booking-item"><strong>${esc(b.service)}</strong><br>${b.date} о ${b.time}<br>Статус: ${statusLabel(b.status)}${b.zoom?`<br><a class="small-btn" href="${esc(b.zoom)}" target="_blank">Zoom</a>`:''}<div class="item-actions">${b.status!=='cancelled'?`<button class="small-btn danger" onclick="clientCancel('${b.id}')">Запит на скасування</button><button class="small-btn" onclick="clientMove('${b.id}')">Запит на перенесення</button>`:''}</div></div>`
    ).join('') : '<div class="booking-item">Записів поки немає.</div>';
  }
}

function renderClientProfile(){
  const form=document.getElementById('clientProfileForm');
  if(!form) return;
  const client=currentClient();
  if(!client) return;

  document.getElementById('profilePhoto').value=client.photo || '';
  document.getElementById('profileName').value=client.name || '';
  document.getElementById('profileEmail').value=client.email || '';
  document.getElementById('profilePhone').value=client.phone || '';
  document.getElementById('profileSocial').value=client.social || '';

  const preview=document.getElementById('clientPhotoPreview');
  if(preview) preview.innerHTML=client.photo ? `<img src="${client.photo}" alt="Фото">` : 'Фото';
}

function bindClientProfileForm(){
  const form=document.getElementById('clientProfileForm');
  if(!form || form.dataset.bound==='yes') return;
  form.dataset.bound='yes';

  const fileInput=document.getElementById('profilePhotoFile');
  if(fileInput){
    fileInput.addEventListener('change',async e=>{
      const file=e.target.files && e.target.files[0];
      if(!file) return;
      const data=await fileToBase64(file);
      document.getElementById('profilePhoto').value=data;
      const preview=document.getElementById('clientPhotoPreview');
      if(preview) preview.innerHTML=`<img src="${data}" alt="Фото">`;
    });
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const oldEmail=localStorage.psy_client_email;
    const newEmail=document.getElementById('profileEmail').value.trim().toLowerCase();
    let cs=clients();
    const index=cs.findIndex(c=>c.email===oldEmail);
    const old=index>=0 ? cs[index] : {};
    const updated={
      ...old,
      email:newEmail,
      name:document.getElementById('profileName').value,
      phone:document.getElementById('profilePhone').value,
      social:document.getElementById('profileSocial').value,
      photo:document.getElementById('profilePhoto').value,
      password:old.password || '123456'
    };
    if(index>=0) cs[index]=updated;
    else cs.push(updated);
    set('psy_clients',cs);
    localStorage.psy_client_email=newEmail;
    renderAll();
    openModal('<h2>Збережено</h2><p>Профіль оновлено.</p>');
  });
}

window.clientCancel=function(id){
  set('psy_bookings',bookings().map(b=>b.id===id ? {...b,status:'cancel_requested'} : b));
  renderAll();
};

window.clientMove=function(id){
  openModal(`<h2>Запит на перенесення</h2><form onsubmit="submitMoveRequest(event,'${id}')"><input type="date" id="moveDate" min="${todayISO()}" required><input type="time" id="moveTime" required><textarea id="moveComment" placeholder="Коментар"></textarea><button class="btn primary full">Надіслати</button></form>`);
};

window.submitMoveRequest=function(e,id){
  e.preventDefault();
  set('psy_bookings',bookings().map(b=>b.id===id ? {...b,status:'change_requested',requestedDate:moveDate.value,requestedTime:moveTime.value,requestComment:moveComment.value} : b));
  document.getElementById('appModal').classList.remove('active');
  renderAll();
};

let calDate=new Date();
let selectedDate=todayISO();

function renderNextSlots(){
  const box=document.getElementById('nextSlots');
  if(!box) return;
  const list=slots().filter(s=>s.date>=todayISO() && !daysOff().includes(s.date) && !takenKeys().includes(`${s.date}_${s.time}`)).slice(0,4);
  box.innerHTML=list.length ? list.map(s=>`<div class="slot-item"><strong>${s.date}</strong><br>${s.time} · ${s.format==='offline'?'офлайн':'онлайн'}</div>`).join('') : '<div class="slot-item">Скоро зʼявляться нові години.</div>';
}

function renderCalendar(){
  const grid=document.getElementById('adminCalendar');
  const title=document.getElementById('calendarTitle');
  if(!grid || !title) return;

  const y=calDate.getFullYear();
  const m=calDate.getMonth();
  const first=new Date(y,m,1);
  const start=new Date(first);
  const offset=(first.getDay()+6)%7;
  start.setDate(first.getDate()-offset);

  title.textContent=calDate.toLocaleDateString('uk-UA',{month:'long',year:'numeric'});
  grid.innerHTML=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(n=>`<div class="calendar-day-name">${n}</div>`).join('');

  for(let i=0;i<42;i++){
    const d=new Date(start);
    d.setDate(start.getDate()+i);
    const iso=d.toISOString().slice(0,10);
    const daySlots=slots().filter(s=>s.date===iso);
    const dayBookings=bookings().filter(b=>b.date===iso && b.status!=='cancelled');
    const off=daysOff().includes(iso);
    grid.innerHTML+=`<div class="calendar-day ${d.getMonth()!==m?'other':''} ${off?'off':''} ${iso===selectedDate?'selected':''}" onclick="selectDay('${iso}')"><div class="day-number">${d.getDate()}</div>${off?'<span class="slot-chip request">вихідний</span>':''}${daySlots.map(s=>`<span class="slot-chip free">${s.time}</span>`).join('')}${dayBookings.map(b=>`<span class="slot-chip ${b.status.includes('requested')?'request':'booked'}">${b.time}</span>`).join('')}</div>`;
  }
  renderDayPanel();
}

window.selectDay=function(iso){
  selectedDate=iso;
  renderCalendar();
};

document.getElementById('prevMonth')?.addEventListener('click',()=>{ calDate.setMonth(calDate.getMonth()-1); renderCalendar(); });
document.getElementById('nextMonth')?.addEventListener('click',()=>{ calDate.setMonth(calDate.getMonth()+1); renderCalendar(); });

function renderDayPanel(){
  const title=document.getElementById('selectedDayTitle');
  const slotDate=document.getElementById('slotDate');
  const box=document.getElementById('selectedDaySlots');
  if(!title || !slotDate || !box) return;
  title.textContent=selectedDate;
  slotDate.value=selectedDate;
  slotDate.min=todayISO();

  const free=slots().filter(s=>s.date===selectedDate);
  const booked=bookings().filter(b=>b.date===selectedDate);
  const html=[
    ...free.map(s=>`<div class="slot-item"><strong>${s.time}</strong> · ${s.format==='offline'?'офлайн':'онлайн'}<div class="item-actions"><button class="small-btn danger" onclick="deleteSlot('${s.id}')">Видалити</button></div></div>`),
    ...booked.map(b=>`<div class="booking-item"><strong>${b.time} · ${esc(b.clientFullName)}</strong><br>${esc(b.service)}<br>${statusLabel(b.status)}<div class="item-actions"><button class="small-btn" onclick="showBooking('${b.id}')">Деталі</button><button class="small-btn" onclick="adminMove('${b.id}')">Перенести</button><button class="small-btn danger" onclick="adminCancel('${b.id}')">Скасувати</button></div></div>`)
  ];
  box.innerHTML=html.join('') || '<div class="slot-item">Немає годин.</div>';
}

document.getElementById('slotForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const slotDateEl=document.getElementById('slotDate');
  if(slotDateEl.value<todayISO()) return;
  const arr=slots();
  arr.push({id:uid(),date:slotDateEl.value,time:document.getElementById('slotTime').value,format:document.getElementById('slotFormat').value,city:document.getElementById('slotCity').value});
  set('psy_slots',arr);
  e.target.reset();
  renderAll();
});

document.getElementById('toggleDayOff')?.addEventListener('click',()=>{
  let arr=daysOff();
  arr=arr.includes(selectedDate) ? arr.filter(x=>x!==selectedDate) : [...arr,selectedDate];
  set('psy_days_off',arr);
  renderAll();
});

window.deleteSlot=function(id){
  set('psy_slots',slots().filter(s=>s.id!==id));
  renderAll();
};

function renderAdminBookings(){
  const box=document.getElementById('adminBookings');
  if(!box) return;
  const fd=document.getElementById('bookingFilterDate')?.value;
  const fs=document.getElementById('bookingFilterStatus')?.value;
  const list=bookings().filter(b=>(!fd||b.date===fd)&&(!fs||b.status===fs));
  box.innerHTML=list.length ? list.map(b=>`<div class="booking-item"><strong>${b.date} ${b.time} · ${esc(b.clientFullName)}</strong><br>${esc(b.service)}<br>${statusLabel(b.status)}<br>${esc(b.clientPhone)} · ${esc(b.clientEmail)}<div class="item-actions"><button class="small-btn" onclick="showBooking('${b.id}')">Деталі</button><button class="small-btn green" onclick="setStatus('${b.id}','confirmed')">Підтвердити</button><button class="small-btn" onclick="setStatus('${b.id}','completed')">Завершено</button><button class="small-btn" onclick="adminMove('${b.id}')">Перенести</button><button class="small-btn danger" onclick="adminCancel('${b.id}')">Скасувати</button></div></div>`).join('') : '<div class="booking-item">Записів немає.</div>';
}

document.getElementById('bookingFilterDate')?.addEventListener('change',renderAdminBookings);
document.getElementById('bookingFilterStatus')?.addEventListener('change',renderAdminBookings);

window.showBooking=function(id){
  const b=bookings().find(x=>x.id===id);
  if(!b) return;
  openModal(`<h2>${esc(b.clientFullName)}</h2><p><b>${esc(b.service)}</b></p><p>${b.date} о ${b.time}</p><p>${esc(b.clientPhone)}<br>${esc(b.clientEmail)}<br>${esc(b.clientSocial||'')}</p><p>${esc(b.comment||'')}</p><p>Статус: ${statusLabel(b.status)}</p>${b.requestedDate?`<p>Запит: ${b.requestedDate} о ${b.requestedTime}<br>${esc(b.requestComment||'')}</p>`:''}`);
};

window.setStatus=function(id,status){
  set('psy_bookings',bookings().map(b=>b.id===id ? {...b,status} : b));
  renderAll();
};

window.adminCancel=function(id){ setStatus(id,'cancelled'); };

window.adminMove=function(id){
  const b=bookings().find(x=>x.id===id);
  if(!b) return;
  openModal(`<h2>Перенести запис</h2><form onsubmit="submitAdminMove(event,'${id}')"><input type="date" id="admMoveDate" min="${todayISO()}" value="${b.requestedDate||b.date}" required><input type="time" id="admMoveTime" value="${b.requestedTime||b.time}" required><button class="btn primary full">Зберегти</button></form>`);
};

window.submitAdminMove=function(e,id){
  e.preventDefault();
  set('psy_bookings',bookings().map(b=>b.id===id ? {...b,date:admMoveDate.value,time:admMoveTime.value,status:'confirmed',requestedDate:'',requestedTime:''} : b));
  document.getElementById('appModal').classList.remove('active');
  renderAll();
};

function fillEditors(){
  const s=site();
  document.querySelectorAll('[data-edit]').forEach(el=>el.value=s[el.dataset.edit] || '');
}

['siteEditor','aboutEditor','settingsEditor'].forEach(formId=>{
  const form=document.getElementById(formId);
  if(form) form.addEventListener('submit',e=>{
    e.preventDefault();
    const s=site();
    e.target.querySelectorAll('[data-edit]').forEach(el=>s[el.dataset.edit]=el.value);
    set('psy_site',s);
    renderAll();
  });
});

document.getElementById('psychologistPhotoFile')?.addEventListener('change',async e=>{
  const file=e.target.files && e.target.files[0];
  if(!file) return;
  const s=site();
  s.photoUrl=await fileToBase64(file);
  set('psy_site',s);
  renderAll();
  openModal('<h2>Фото збережено</h2><p>Фото психолога оновлено.</p>');
});

document.getElementById('certFile')?.addEventListener('change',async e=>{
  const file=e.target.files && e.target.files[0];
  if(!file) return;
  document.getElementById('certImage').value=await fileToBase64(file);
});

function listItem(title,sub,edit,del){
  return `<div class="list-item"><strong>${esc(title)}</strong><p>${esc(sub)}</p><div class="item-actions"><button class="small-btn" onclick="${edit}">Редагувати</button><button class="small-btn danger" onclick="${del}">Видалити</button></div></div>`;
}

window.del=function(key,index){
  const arr=get(key,[]);
  arr.splice(index,1);
  set(key,arr);
  renderAll();
};

function renderLists(){
  const dir=document.getElementById('adminDirections');
  if(dir) dir.innerHTML=directions().map((x,i)=>listItem(x.title,x.text,`editDirection(${i})`,`del('psy_directions',${i})`)).join('');

  const serv=document.getElementById('adminServices');
  if(serv) serv.innerHTML=services().map((x,i)=>listItem(x.title,`${x.price} грн · ${x.format}`,`editService(${i})`,`del('psy_services',${i})`)).join('');

  const cont=document.getElementById('adminContacts');
  if(cont) cont.innerHTML=contacts().map((x,i)=>listItem(x.title,x.value,`editContact(${i})`,`del('psy_contacts',${i})`)).join('');

  const cert=document.getElementById('adminCertificates');
  if(cert) cert.innerHTML=certs().map((x,i)=>listItem(x.title,`${x.category||'Інше'} · ${x.image?'файл додано':''}`,`editCert(${i})`,`del('psy_certs',${i})`)).join('');

  const rev=document.getElementById('adminReviews');
  if(rev) rev.innerHTML=reviews().map((x,i)=>listItem(x.name,x.text,`editReview(${i})`,`del('psy_reviews',${i})`)).join('');

  const faq=document.getElementById('adminFaq');
  if(faq) faq.innerHTML=faqs().map((x,i)=>listItem(x.q,x.a,`editFaq(${i})`,`del('psy_faq',${i})`)).join('');

  const aboutExtra=document.getElementById('adminAboutExtra');
  if(aboutExtra) aboutExtra.innerHTML=get('psy_about_extra',[]).map((x,i)=>listItem(x.title,x.text,`editAboutExtra(${i})`,`del('psy_about_extra',${i})`)).join('');
}

function bindSubmit(id,handler){
  const form=document.getElementById(id);
  if(form) form.addEventListener('submit',handler);
}

bindSubmit('directionForm',e=>{
  e.preventDefault();
  const arr=directions();
  arr.push({id:uid(),title:directionTitle.value,text:directionText.value});
  set('psy_directions',arr);
  e.target.reset();
  renderAll();
});
window.editDirection=function(i){
  const x=directions()[i];
  directionTitle.value=x.title;
  directionText.value=x.text;
  del('psy_directions',i);
};

bindSubmit('serviceForm',e=>{
  e.preventDefault();
  let arr=services();
  const editId=serviceEditId.value;
  const obj={id:editId||uid(),title:serviceTitle.value,format:serviceFormat.value,duration:serviceDuration.value,price:Number(servicePrice.value),text:serviceText.value};
  arr=editId ? arr.map(x=>x.id===editId?obj:x) : [...arr,obj];
  set('psy_services',arr);
  e.target.reset();
  serviceEditId.value='';
  renderAll();
});
window.editService=function(i){
  const x=services()[i];
  serviceEditId.value=x.id;
  serviceTitle.value=x.title;
  serviceFormat.value=x.format;
  serviceDuration.value=x.duration;
  servicePrice.value=x.price;
  serviceText.value=x.text;
};

bindSubmit('contactItemForm',e=>{
  e.preventDefault();
  let arr=contacts();
  const editId=contactEditId.value;
  const obj={id:editId||uid(),title:contactTitle.value,value:contactValue.value,link:contactLink.value};
  arr=editId ? arr.map(x=>x.id===editId?obj:x) : [...arr,obj];
  set('psy_contacts',arr);
  e.target.reset();
  contactEditId.value='';
  renderAll();
});
window.editContact=function(i){
  const x=contacts()[i];
  contactEditId.value=x.id;
  contactTitle.value=x.title;
  contactValue.value=x.value;
  contactLink.value=x.link;
};

bindSubmit('certificateForm',e=>{
  e.preventDefault();
  let arr=certs();
  const editId=certEditId.value;
  const obj={id:editId||uid(),title:certTitle.value,category:certCategory.value||'Інше',image:certImage.value};
  arr=editId ? arr.map(x=>x.id===editId?obj:x) : [...arr,obj];
  set('psy_certs',arr);
  e.target.reset();
  certEditId.value='';
  renderAll();
});
window.editCert=function(i){
  const x=certs()[i];
  certEditId.value=x.id;
  certTitle.value=x.title;
  certCategory.value=x.category||'Інше';
  certImage.value=x.image;
};

bindSubmit('reviewForm',e=>{
  e.preventDefault();
  let arr=reviews();
  const editId=reviewEditId.value;
  const obj={id:editId||uid(),name:reviewName.value,text:reviewText.value,status:'published'};
  arr=editId ? arr.map(x=>x.id===editId?obj:x) : [...arr,obj];
  set('psy_reviews',arr);
  e.target.reset();
  reviewEditId.value='';
  renderAll();
});
window.editReview=function(i){
  const x=reviews()[i];
  reviewEditId.value=x.id;
  reviewName.value=x.name;
  reviewText.value=x.text;
};

bindSubmit('faqForm',e=>{
  e.preventDefault();
  let arr=faqs();
  const editId=faqEditId.value;
  const obj={id:editId||uid(),q:faqQuestion.value,a:faqAnswer.value};
  arr=editId ? arr.map(x=>x.id===editId?obj:x) : [...arr,obj];
  set('psy_faq',arr);
  e.target.reset();
  faqEditId.value='';
  renderAll();
});
window.editFaq=function(i){
  const x=faqs()[i];
  faqEditId.value=x.id;
  faqQuestion.value=x.q;
  faqAnswer.value=x.a;
};

bindSubmit('aboutExtraForm',e=>{
  e.preventDefault();
  const arr=get('psy_about_extra',[]);
  arr.push({id:uid(),title:aboutExtraTitle.value,text:aboutExtraText.value});
  set('psy_about_extra',arr);
  e.target.reset();
  renderAll();
});
window.editAboutExtra=function(i){
  const arr=get('psy_about_extra',[]);
  const x=arr[i];
  aboutExtraTitle.value=x.title;
  aboutExtraText.value=x.text;
  del('psy_about_extra',i);
};

function renderAll(){
  renderPublic();
  renderCertificateToolbar();
  renderCertCategoryOptions();
  updateTimes();
  fillBookingFromClientProfile();
  renderClient();
  renderClientProfile();
  bindClientProfileForm();
  renderCalendar();
  renderAdminBookings();
  fillEditors();
  renderLists();
}
renderAll();



/* === Final UI/Firebase helper overrides === */
(function(){
  const originalRenderAll = window.renderAll || null;

  window.renderFooterContacts = function(){
    const box = document.getElementById('footerContacts');
    if(!box) return;
    const items = (typeof contacts === 'function' ? contacts() : []).length ? contacts() : [
      {title:'Instagram', value:'Instagram', link:'#'},
      {title:'Telegram', value:'Telegram', link:'#'},
      {title:'Facebook', value:'Facebook', link:'#'},
      {title:'Телефон', value:'+380000000000', link:'tel:+380000000000'},
      {title:'Email', value:'psychologist@example.com', link:'mailto:psychologist@example.com'}
    ];
    const icon = (t) => {
      const s = (t||'').toLowerCase();
      if(s.includes('inst')) return '◎';
      if(s.includes('telegram')) return '◉';
      if(s.includes('face')) return 'f';
      if(s.includes('тел') || s.includes('phone')) return '☎';
      if(s.includes('mail') || s.includes('пошта')) return '@';
      return '•';
    };
    box.innerHTML = items.map(c => `<a href="${esc(c.link||'#')}" target="_blank"><span>${icon(c.title)}</span><b>${esc(c.value || c.title)}</b></a>`).join('');
  };

  window.renderHomePhoto = function(){
    const frame = document.getElementById('homePsychologistPhoto');
    if(!frame || typeof site !== 'function') return;
    const s = site();
    const url = s.homePhotoUrl || s.photoUrl || '';
    if(url) frame.innerHTML = `<img src="${esc(url)}" alt="Фото психолога">`;
  };

  window.renderRules = function(){
    const list = document.getElementById('rulesList');
    if(!list || typeof site !== 'function') return;
    const s = site();
    const rules = (s.rulesText || 'Запис підтверджується після оплати або підтвердження психолога.\\nПеренесення та скасування можливі через кабінет клієнта.\\nДля онлайн-зустрічі посилання зʼявиться у вашому профілі.').split('\\n').filter(Boolean);
    list.innerHTML = rules.map(r => `<li>${esc(r)}</li>`).join('');
  };

  window.renderBookingDateStrip = function(){
    const strip = document.getElementById('bookingDateStrip');
    const grid = document.getElementById('bookingTimeGrid');
    const dateInput = document.getElementById('bookingDate');
    if(!strip || !grid || !dateInput || typeof slots !== 'function') return;

    const today = new Date();
    const days = [];
    for(let i=0;i<14;i++){
      const d = new Date(today);
      d.setDate(today.getDate()+i);
      const iso = d.toISOString().slice(0,10);
      const available = typeof availableFor === 'function' ? availableFor(iso) : [];
      if(available.length) days.push({iso, label:d.toLocaleDateString('uk-UA',{weekday:'short', day:'numeric', month:'short'}), count:available.length});
    }
    strip.innerHTML = days.length ? days.map(d => `<button type="button" class="booking-date-card ${dateInput.value===d.iso?'active':''}" data-date="${d.iso}"><strong>${d.label}</strong><br><small>${d.count} год.</small></button>`).join('') : '<div class="booking-date-card disabled">Немає вільних днів</div>';
    strip.querySelectorAll('[data-date]').forEach(btn => btn.onclick = () => {
      dateInput.value = btn.dataset.date;
      if(typeof updateTimes === 'function') updateTimes();
      renderBookingDateStrip();
      renderBookingTimeGrid();
    });
    renderBookingTimeGrid();
  };

  window.renderBookingTimeGrid = function(){
    const grid = document.getElementById('bookingTimeGrid');
    const dateInput = document.getElementById('bookingDate');
    const timeSelect = document.getElementById('bookingTime');
    if(!grid || !dateInput || !timeSelect) return;
    const arr = dateInput.value && typeof availableFor === 'function' ? availableFor(dateInput.value) : [];
    grid.innerHTML = arr.length ? arr.map(s => `<button type="button" class="time-pill ${timeSelect.value===s.time?'active':''}" data-time="${s.time}">${s.time}</button>`).join('') : '<div class="time-pill disabled">Оберіть день</div>';
    grid.querySelectorAll('[data-time]').forEach(btn => btn.onclick = () => {
      timeSelect.value = btn.dataset.time;
      renderBookingTimeGrid();
    });
  };

  const dateInput = document.getElementById('bookingDate');
  if(dateInput) dateInput.addEventListener('change', () => setTimeout(renderBookingDateStrip, 0));

  // File upload for new home photo
  const homeFile = document.getElementById('homePhotoFile');
  if(homeFile){
    homeFile.addEventListener('change', async e => {
      const file = e.target.files && e.target.files[0];
      if(!file || typeof fileToBase64 !== 'function' || typeof site !== 'function') return;
      const s = site();
      s.homePhotoUrl = await fileToBase64(file);
      localStorage.setItem('psy_site', JSON.stringify(s));
      if(typeof renderAll === 'function') renderAll();
    });
  }

  const rulesForm = document.getElementById('rulesEditor');
  if(rulesForm){
    rulesForm.addEventListener('submit', e => {
      e.preventDefault();
      const s = site();
      s.rulesText = document.getElementById('rulesEditorText').value;
      localStorage.setItem('psy_site', JSON.stringify(s));
      if(typeof renderAll === 'function') renderAll();
    });
  }

  // Google button should prefer real Firebase function when available
  const gbtn = document.getElementById('googleClientBtn');
  if(gbtn){
    gbtn.onclick = (e) => {
      if(window.signInWithGoogleReal){
        e.preventDefault();
        window.signInWithGoogleReal();
      }
    };
  }

  const run = () => {
    renderFooterContacts();
    renderHomePhoto();
    renderRules();
    renderBookingDateStrip();
    const rte = document.getElementById('rulesEditorText');
    if(rte && typeof site === 'function') rte.value = site().rulesText || '';
  };

  const oldRenderAll = window.renderAll;
  if(typeof oldRenderAll === 'function'){
    window.renderAll = function(){
      oldRenderAll();
      run();
      // Calendar classes by status
      document.querySelectorAll('.calendar-day').forEach(day => {
        const txt = day.textContent || '';
        if(txt.includes('Вихідний') || txt.includes('вихідний')) day.classList.add('off');
        if(day.querySelector('.slot-chip.booked')) day.classList.add('has-booked');
        if(day.querySelector('.slot-chip.request')) day.classList.add('has-request');
      });
    };
  }
  document.addEventListener('DOMContentLoaded', run);
  setTimeout(run, 200);
})();



/* === Editable v2: categories, facts, red day-off cells === */
document.addEventListener('DOMContentLoaded', () => {
  if(location.pathname.endsWith('admin.html')) document.body.classList.add('admin-page');
  if(location.pathname.endsWith('client-dashboard.html')) document.body.classList.add('client-page');
});

(function(){
  if(!localStorage.getItem('psy_service_categories')){
    localStorage.setItem('psy_service_categories', JSON.stringify([
      {id:'cat1', title:'Індивідуальні'},
      {id:'cat2', title:'Пари'},
      {id:'cat3', title:'Сімейні'},
      {id:'cat4', title:'Діти'}
    ]));
  }

  try{
    const arr = JSON.parse(localStorage.getItem('psy_services')) || [];
    let changed = false;
    arr.forEach(s => { if(!s.category){ s.category = 'Індивідуальні'; changed = true; } });
    if(changed) localStorage.setItem('psy_services', JSON.stringify(arr));
  }catch(e){}

  window.serviceCategories = function(){
    try { return JSON.parse(localStorage.getItem('psy_service_categories')) || []; } catch(e){ return []; }
  };
  window.setServiceCategories = function(arr){
    localStorage.setItem('psy_service_categories', JSON.stringify(arr));
  };
  window.currentServiceCategory = window.currentServiceCategory || 'all';

  function localSite(){
    try { return JSON.parse(localStorage.getItem('psy_site')) || {}; } catch(e){ return {}; }
  }
  function saveLocalSite(s){ localStorage.setItem('psy_site', JSON.stringify(s)); }

  window.renderAboutFacts = function(){
    const s = localSite();
    const vals = {
      factAgePublic: s.factAge || '—',
      factExperiencePublic: s.factExperience || '—',
      factLanguagePublic: s.factLanguage || '—',
      factCustomPublic: s.factCustom || '—'
    };
    Object.entries(vals).forEach(([id,val]) => {
      const el = document.getElementById(id);
      if(el) el.textContent = val;
    });
    ['factAge','factExperience','factLanguage','factCustom'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.value = s[id] || '';
    });
  };

  const factsForm = document.getElementById('aboutFactsForm');
  if(factsForm){
    factsForm.addEventListener('submit', e => {
      e.preventDefault();
      const s = localSite();
      s.factAge = document.getElementById('factAge').value;
      s.factExperience = document.getElementById('factExperience').value;
      s.factLanguage = document.getElementById('factLanguage').value;
      s.factCustom = document.getElementById('factCustom').value;
      saveLocalSite(s);
      if(typeof renderAll === 'function') renderAll();
      if(typeof openModal === 'function') openModal('<h2>Збережено</h2><p>Коротку інформацію оновлено.</p>');
    });
  }

  window.renderServiceCategoriesPublic = function(){
    const filters = document.getElementById('serviceCategoryFilters');
    if(filters){
      const cats = serviceCategories();
      filters.innerHTML = '<button class="service-category-filter '+(window.currentServiceCategory==='all'?'active':'')+'" data-service-cat="all">Усі</button>' +
        cats.map(c => '<button class="service-category-filter '+(window.currentServiceCategory===c.title?'active':'')+'" data-service-cat="'+esc(c.title)+'">'+esc(c.title)+'</button>').join('');
      filters.querySelectorAll('[data-service-cat]').forEach(btn => {
        btn.onclick = () => {
          window.currentServiceCategory = btn.dataset.serviceCat;
          if(typeof renderAll === 'function') renderAll();
        };
      });
    }

    const select = document.getElementById('serviceCategory');
    if(select){
      select.innerHTML = serviceCategories().map(c => '<option value="'+esc(c.title)+'">'+esc(c.title)+'</option>').join('');
    }

    const adminList = document.getElementById('adminServiceCategories');
    if(adminList){
      adminList.innerHTML = serviceCategories().map((c,i) => '<div class="list-item"><strong>'+esc(c.title)+'</strong><div class="item-actions"><button class="small-btn" onclick="editServiceCategory('+i+')">Редагувати</button><button class="small-btn danger" onclick="deleteServiceCategory('+i+')">Видалити</button></div></div>').join('');
    }
  };

  const catForm = document.getElementById('serviceCategoriesForm');
  if(catForm){
    catForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = document.getElementById('serviceCategoryName').value.trim();
      if(!val) return;
      const arr = serviceCategories();
      arr.push({id: (typeof uid === 'function' ? uid() : String(Date.now())), title: val});
      setServiceCategories(arr);
      e.target.reset();
      if(typeof renderAll === 'function') renderAll();
    });
  }

  window.editServiceCategory = function(i){
    const arr = serviceCategories();
    const next = prompt('Нова назва категорії', arr[i].title);
    if(!next) return;
    const old = arr[i].title;
    arr[i].title = next;
    setServiceCategories(arr);
    try{
      const serv = JSON.parse(localStorage.getItem('psy_services')) || [];
      serv.forEach(s => { if(s.category === old) s.category = next; });
      localStorage.setItem('psy_services', JSON.stringify(serv));
    }catch(e){}
    if(typeof renderAll === 'function') renderAll();
  };

  window.deleteServiceCategory = function(i){
    const arr = serviceCategories();
    const removed = arr[i].title;
    arr.splice(i,1);
    setServiceCategories(arr);
    try{
      const serv = JSON.parse(localStorage.getItem('psy_services')) || [];
      serv.forEach(s => { if(s.category === removed) s.category = 'Індивідуальні'; });
      localStorage.setItem('psy_services', JSON.stringify(serv));
    }catch(e){}
    if(typeof renderAll === 'function') renderAll();
  };

  window.renderServicesWithCategories = function(){
    const grid = document.getElementById('servicesGrid');
    const bookingService = document.getElementById('bookingService');
    if(!grid || typeof services !== 'function') return;
    const all = services();
    const visible = (window.currentServiceCategory === 'all') ? all : all.filter(s => (s.category || 'Індивідуальні') === window.currentServiceCategory);
    grid.innerHTML = visible.map(s => '<article class="service-card reveal visible"><span class="service-category-label">'+esc(s.category || 'Індивідуальні')+'</span><div class="service-tag">'+esc(s.format||'')+'</div><h3>'+esc(s.title)+'</h3><p>'+esc(s.text||'')+'</p><p>'+esc(s.duration||'')+'</p><div class="price">'+(s.price||0)+' грн</div><button class="btn primary open-booking" data-service="'+esc(s.title)+'">Обрати час</button></article>').join('');
    if(bookingService){
      bookingService.innerHTML = '<option value="">Оберіть консультацію</option>' + all.map(s => '<option value="'+esc(s.title)+'">'+esc(s.title)+' — '+(s.price||0)+' грн</option>').join('');
    }
    document.querySelectorAll('.open-booking').forEach(btn=>btn.addEventListener('click',()=>{ 
      if(bookingService) bookingService.value=btn.dataset.service; 
      document.getElementById('booking')?.scrollIntoView({behavior:'smooth'}); 
    }));
  };

  const serviceForm = document.getElementById('serviceForm');
  if(serviceForm && !serviceForm.dataset.categoryPatch){
    serviceForm.dataset.categoryPatch = 'yes';
    serviceForm.addEventListener('submit', () => {
      setTimeout(() => {
        try{
          const arr = JSON.parse(localStorage.getItem('psy_services')) || [];
          const cat = document.getElementById('serviceCategory')?.value || 'Індивідуальні';
          arr.forEach(s => { if(!s.category) s.category = cat; });
          localStorage.setItem('psy_services', JSON.stringify(arr));
        }catch(e){}
      }, 0);
    }, true);
  }

  const oldEditService = window.editService;
  if(typeof oldEditService === 'function'){
    window.editService = function(i){
      oldEditService(i);
      try{
        const s = services()[i];
        const sel = document.getElementById('serviceCategory');
        if(sel) sel.value = s.category || 'Індивідуальні';
      }catch(e){}
    };
  }

  function colorCalendarDays(){
    document.querySelectorAll('.calendar-day').forEach(day => {
      const text = (day.textContent || '').toLowerCase();
      if(text.includes('вихідний')) day.classList.add('off');
      if(day.querySelector('.slot-chip.booked')) day.classList.add('has-booked');
      if(day.querySelector('.slot-chip.request') && !text.includes('вихідний')) day.classList.add('has-request');
    });
  }

  const oldRenderAll2 = window.renderAll || (typeof renderAll === 'function' ? renderAll : null);
  if(typeof oldRenderAll2 === 'function' && !window.__editableV2Patch){
    window.__editableV2Patch = true;
    window.renderAll = function(){
      oldRenderAll2();
      renderAboutFacts();
      renderServiceCategoriesPublic();
      renderServicesWithCategories();
      colorCalendarDays();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAboutFacts();
    renderServiceCategoriesPublic();
    renderServicesWithCategories();
    colorCalendarDays();
  });
  setTimeout(() => {
    renderAboutFacts();
    renderServiceCategoriesPublic();
    renderServicesWithCategories();
    colorCalendarDays();
  }, 300);
})();



/* === Photo save/render fix + Google button handoff === */
(function(){
  function getSiteSafe(){
    try { return JSON.parse(localStorage.getItem('psy_site')) || {}; } catch(e){ return {}; }
  }
  function saveSiteSafe(s){ localStorage.setItem('psy_site', JSON.stringify(s)); }

  function markPhoto(el){
    if(!el) return;
    if(el.querySelector('img')) el.classList.add('has-photo');
    else el.classList.remove('has-photo');
  }

  window.renderAllPhotosFixed = function(){
    const s = getSiteSafe();

    const home = document.getElementById('homePsychologistPhoto');
    if(home){
      const url = s.homePhotoUrl || s.photoUrl || '';
      if(url) home.innerHTML = '<img src="'+url+'" alt="Фото психолога">';
      markPhoto(home);
    }

    const about = document.getElementById('psychologistPhoto');
    if(about){
      const url = s.photoUrl || s.homePhotoUrl || '';
      if(url) about.innerHTML = '<img src="'+url+'" alt="Фото психолога">';
      markPhoto(about);
    }

    const ch = document.getElementById('clientHeroPhoto');
    if(ch){
      try{
        const clients = JSON.parse(localStorage.getItem('psy_clients')) || [];
        const u = clients.find(c => c.email === localStorage.psy_client_email);
        if(u && u.photo) ch.innerHTML = '<img src="'+u.photo+'" alt="Фото">';
      }catch(e){}
      markPhoto(ch);
    }

    const cp = document.getElementById('clientPhotoPreview');
    if(cp) markPhoto(cp);
  };

  async function inputToBase64(input){
    const file = input.files && input.files[0];
    if(!file) return '';
    if(typeof fileToBase64 === 'function') return await fileToBase64(file);
    return await new Promise((resolve,reject)=>{
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function bindImageInput(id, siteKey, alsoKey){
    const input = document.getElementById(id);
    if(!input || input.dataset.photoFixed === 'yes') return;
    input.dataset.photoFixed = 'yes';
    input.addEventListener('change', async () => {
      const data = await inputToBase64(input);
      if(!data) return;
      const s = getSiteSafe();
      s[siteKey] = data;
      if(alsoKey) s[alsoKey] = data;
      saveSiteSafe(s);
      if(typeof renderAll === 'function') renderAll();
      renderAllPhotosFixed();
      if(typeof openModal === 'function') openModal('<h2>Фото збережено</h2><p>Фото оновлено і вже відображається на сайті.</p>');
    });
  }

  function bindClientPhoto(){
    const input = document.getElementById('profilePhotoFile');
    if(!input || input.dataset.photoFixed === 'yes') return;
    input.dataset.photoFixed = 'yes';
    input.addEventListener('change', async () => {
      const data = await inputToBase64(input);
      if(!data) return;
      const hidden = document.getElementById('profilePhoto');
      if(hidden) hidden.value = data;
      const preview = document.getElementById('clientPhotoPreview');
      if(preview) {
        preview.innerHTML = '<img src="'+data+'" alt="Фото">';
        markPhoto(preview);
      }
    });
  }

  function bindAllPhotoFixes(){
    
  }

  // JS has no None; bind manually:
  window.bindPhotoFixes = function(){
    bindImageInput('homePhotoFile', 'homePhotoUrl');
    bindImageInput('psychologistPhotoFile', 'photoUrl');
    bindClientPhoto();
    renderAllPhotosFixed();

    const gbtn = document.getElementById('googleClientBtn');
    if(gbtn && gbtn.dataset.realGoogleBound !== 'yes'){
      gbtn.dataset.realGoogleBound = 'yes';
      gbtn.addEventListener('click', (e) => {
        if(window.signInWithGoogleReal){
          e.preventDefault();
          window.signInWithGoogleReal();
        }
      }, true);
    }
  };

  const oldRenderAll = window.renderAll || (typeof renderAll === 'function' ? renderAll : null);
  if(typeof oldRenderAll === 'function' && !window.__photoFixRenderPatch){
    window.__photoFixRenderPatch = true;
    window.renderAll = function(){
      oldRenderAll();
      window.bindPhotoFixes();
    };
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(window.bindPhotoFixes, 50));
  setTimeout(window.bindPhotoFixes, 300);
})();
