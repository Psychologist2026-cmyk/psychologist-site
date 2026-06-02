
const OWNER_EMAIL = "psychologist@example.com";
const OWNER_PASSWORD = "123456";

const DEFAULT_SITE = {
  homeEyebrow: "Онлайн та офлайн консультації",
  homeTitle: "Психологічна підтримка у спокійному просторі",
  homeText: "Консультації українською для тих, хто хоче краще зрозуміти себе, впоратися з тривогою, стресом, емоційним вигоранням або складними життєвими ситуаціями.",
  homeCardTitle: "Оберіть послугу, день та зручний час",
  homeCardText: "Запис проходить у кілька простих кроків: вибір послуги, дати, часу та контактних даних.",
  psychologistName: "Імʼя Психолога",
  aboutIntro: "Тут буде короткий опис спеціаліста, досвіду, освіти, підходу до роботи та напрямків консультацій.",
  aboutTitle: "Професійний шлях",
  aboutText: "Тут варто написати про освіту, практичний досвід, методи роботи, цінності та формат консультацій.",
  aboutBulletsText: "Індивідуальні онлайн-консультації\nРобота з тривогою, стресом та вигоранням\nКонфіденційний та етичний формат\nМожливість офлайн-консультацій за містом",
  photoUrl: "",
  contactEmail: "psychologist@example.com",
  contactPhone: "+380 XX XXX XX XX",
  contactTelegram: "@USERNAME",
  telegramUrl: "https://t.me/USERNAME",
  zoomLink: "",
  privacyTextRaw: "Сайт може збирати імʼя, email, номер телефону, інформацію про обрану консультацію, дату та час запису. Дані використовуються для організації консультацій, звʼязку з клієнтом та підтвердження запису."
};

const DEFAULT_SERVICES = [
  { id:"s1", title:"Індивідуальна консультація онлайн", format:"Онлайн", duration:"50 хв", price:1500, text:"Онлайн-зустріч у Zoom. Підходить для роботи з тривогою, стресом, самооцінкою та емоційним станом." },
  { id:"s2", title:"Офлайн консультація", format:"Офлайн", duration:"50 хв", price:1800, text:"Особиста зустріч у кабінеті. Місто та адреса вказуються психологом для доступних офлайн-годин." },
  { id:"s3", title:"Повторна консультація", format:"Онлайн або офлайн", duration:"50 хв", price:1400, text:"Для клієнтів, які вже були на першій консультації та хочуть продовжити роботу." }
];

const DEFAULT_DIRECTIONS = [
  { id:"d1", title:"Тривога та стрес", text:"Робота з напругою, навʼязливими думками, панічними проявами та внутрішнім неспокоєм." },
  { id:"d2", title:"Емоційне вигорання", text:"Підтримка при втомі, втраті мотивації, перевантаженні, виснаженні та апатії." },
  { id:"d3", title:"Стосунки та кордони", text:"Допомога у розумінні себе, конфліктів, особистих кордонів і повторюваних сценаріїв." }
];

const DEFAULT_FAQ = [
  { id:"f1", q:"Як проходить онлайн консультація?", a:"Після підтвердження запису клієнт отримує посилання на Zoom або інструкцію для підключення." },
  { id:"f2", q:"Чи можна скасувати консультацію?", a:"Так. Умови скасування узгоджуються з психологом." },
  { id:"f3", q:"Чи є консультації конфіденційними?", a:"Так, конфіденційність є базовою умовою роботи з клієнтом." }
];

const DEFAULT_REVIEWS = [
  { id:"r1", name:"Клієнт", text:"Тут буде реальний відгук клієнта." },
  { id:"r2", name:"Клієнт", text:"Текст можна змінити у кабінеті психолога." }
];

const DEFAULT_CERTS = [
  { id:"c1", title:"Сертифікат 1", image:"" },
  { id:"c2", title:"Сертифікат 2", image:"" },
  { id:"c3", title:"Сертифікат 3", image:"" }
];

const DEFAULT_SLOTS = [
  { id:"slot1", date:"2026-06-05", time:"10:00", format:"online", city:"" },
  { id:"slot2", date:"2026-06-05", time:"12:00", format:"online", city:"" },
  { id:"slot3", date:"2026-06-06", time:"14:00", format:"offline", city:"Київ" }
];

function getJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function setJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function initData() {
  if (!localStorage.getItem("psy_site")) setJSON("psy_site", DEFAULT_SITE);
  if (!localStorage.getItem("psy_services")) setJSON("psy_services", DEFAULT_SERVICES);
  if (!localStorage.getItem("psy_directions")) setJSON("psy_directions", DEFAULT_DIRECTIONS);
  if (!localStorage.getItem("psy_faq")) setJSON("psy_faq", DEFAULT_FAQ);
  if (!localStorage.getItem("psy_reviews")) setJSON("psy_reviews", DEFAULT_REVIEWS);
  if (!localStorage.getItem("psy_certs")) setJSON("psy_certs", DEFAULT_CERTS);
  if (!localStorage.getItem("psy_slots")) setJSON("psy_slots", DEFAULT_SLOTS);
  if (!localStorage.getItem("psy_bookings")) setJSON("psy_bookings", []);
}
initData();

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  menuBtn.onclick = () => { nav.classList.toggle("active"); menuBtn.classList.toggle("active"); };
}

const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting)e.target.classList.add("visible") }), { threshold:.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function site() { return getJSON("psy_site", DEFAULT_SITE); }
function services() { return getJSON("psy_services", DEFAULT_SERVICES); }
function directions() { return getJSON("psy_directions", DEFAULT_DIRECTIONS); }
function faqs() { return getJSON("psy_faq", DEFAULT_FAQ); }
function reviews() { return getJSON("psy_reviews", DEFAULT_REVIEWS); }
function certs() { return getJSON("psy_certs", DEFAULT_CERTS); }
function slots() { return getJSON("psy_slots", DEFAULT_SLOTS); }
function bookings() { return getJSON("psy_bookings", []); }

function applyPublicContent() {
  const s = site();
  document.querySelectorAll("[data-field]").forEach(el => {
    const key = el.dataset.field;
    if (key === "privacyText") return;
    if (s[key] !== undefined) el.textContent = s[key];
  });
  const float = document.getElementById("telegramFloat");
  if (float) float.href = s.telegramUrl || "#";
  const tgBtn = document.getElementById("telegramContactBtn");
  if (tgBtn) tgBtn.href = s.telegramUrl || "#";
  const photo = document.getElementById("psychologistPhoto");
  if (photo && s.photoUrl) photo.innerHTML = `<img src="${escapeHTML(s.photoUrl)}" alt="Фото психолога">`;
  const aboutBullets = document.getElementById("aboutBullets");
  if (aboutBullets) aboutBullets.innerHTML = (s.aboutBulletsText || "").split("\n").filter(Boolean).map(x => `<li>${escapeHTML(x)}</li>`).join("");
  const privacy = document.querySelector("[data-field='privacyText']");
  if (privacy) privacy.innerHTML = `<h2>Основні положення</h2><p>${escapeHTML(s.privacyTextRaw).replace(/\n/g,"</p><p>")}</p>`;
}
function escapeHTML(str="") {
  return String(str).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
}

function renderDirectionsPublic() {
  const grid = document.getElementById("directionsGrid");
  if (!grid) return;
  grid.innerHTML = directions().map((d,i)=>`<article class="info-card reveal visible"><div class="icon-bubble">${String(i+1).padStart(2,"0")}</div><h3>${escapeHTML(d.title)}</h3><p>${escapeHTML(d.text)}</p></article>`).join("");
}

function renderServicesPublic() {
  const grid = document.getElementById("servicesGrid");
  const select = document.getElementById("bookingService");
  if (grid) grid.innerHTML = services().map(s=>`<article class="service-card reveal visible"><div class="service-tag">${escapeHTML(s.format)}</div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.text)}</p><ul class="mini-list"><li>Формат: ${escapeHTML(s.format)}</li><li>Тривалість: ${escapeHTML(s.duration)}</li></ul><div class="price">${Number(s.price)||0} грн</div><button class="btn primary open-booking" data-service="${escapeHTML(s.title)}">Обрати час</button></article>`).join("");
  if (select) select.innerHTML = `<option value="">Оберіть послугу</option>` + services().map(s=>`<option value="${escapeHTML(s.title)}">${escapeHTML(s.title)} — ${Number(s.price)||0} грн</option>`).join("");
  document.querySelectorAll(".open-booking").forEach(btn => btn.onclick = () => {
    if(select) select.value = btn.dataset.service;
    document.getElementById("booking")?.scrollIntoView({behavior:"smooth"});
  });
}

function renderFaqPublic() {
  const list = document.getElementById("faqList");
  if (!list) return;
  list.innerHTML = faqs().map((f,i)=>`<details ${i===0?"open":""}><summary>${escapeHTML(f.q)}</summary><p>${escapeHTML(f.a)}</p></details>`).join("");
}
function renderReviewsPublic() {
  const grid = document.getElementById("reviewsGrid");
  if (!grid) return;
  grid.innerHTML = reviews().map(r=>`<article class="review-card reveal visible"><p>“${escapeHTML(r.text)}”</p><strong>${escapeHTML(r.name)}</strong></article>`).join("");
}
function renderCertsPublic() {
  const grid = document.getElementById("certificatesGrid");
  if (!grid) return;
  grid.innerHTML = certs().map(c=>`<article class="cert-card reveal visible">${c.image?`<img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.title)}">`:""}<span>${escapeHTML(c.title)}</span></article>`).join("");
}

function bookedKeys() { return bookings().filter(b=>b.status!=="cancelled").map(b=>`${b.date}_${b.time}`); }
function updateBookingTimes() {
  const date = document.getElementById("bookingDate");
  const time = document.getElementById("bookingTime");
  if(!date || !time) return;
  const selected = date.value;
  const keys = bookedKeys();
  const available = slots().filter(s => s.date === selected && !keys.includes(`${s.date}_${s.time}`));
  time.innerHTML = !selected ? `<option value="">Спочатку оберіть дату</option>` : available.length ? `<option value="">Оберіть час</option>` + available.map(s=>`<option value="${s.time}">${s.time} — ${s.format==="offline"?"офлайн":"онлайн"}${s.city ? ", " + s.city : ""}</option>`).join("") : `<option value="">На цей день немає вільного часу</option>`;
}
document.getElementById("bookingDate")?.addEventListener("change", updateBookingTimes);

document.getElementById("bookingForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const serviceTitle = document.getElementById("bookingService").value;
  const service = services().find(s=>s.title===serviceTitle);
  const data = {
    id: "b"+Date.now(),
    clientName: document.getElementById("clientName").value,
    clientEmail: document.getElementById("clientEmail").value,
    clientPhone: document.getElementById("clientPhone").value,
    service: serviceTitle,
    price: service ? service.price : 0,
    date: document.getElementById("bookingDate").value,
    time: document.getElementById("bookingTime").value,
    comment: document.getElementById("clientComment").value,
    status: "new",
    createdAt: new Date().toISOString()
  };
  if(!data.time) return;
  const all = bookings(); all.push(data); setJSON("psy_bookings", all);
  const res = document.getElementById("bookingResult");
  res.style.display = "block";
  res.innerHTML = `<strong>Запис створено.</strong><br>${escapeHTML(data.service)}<br>${data.date} о ${data.time}`;
  e.target.reset(); updateBookingTimes();
});

document.getElementById("contactForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const res = document.getElementById("contactResult");
  res.style.display = "block"; res.textContent = "Повідомлення відправлено.";
  e.target.reset();
});

document.getElementById("clientSearchForm")?.addEventListener("submit", e => {
  e.preventDefault();
  renderClientBookings(document.getElementById("clientSearchEmail").value);
});
function renderClientBookings(email="") {
  const box = document.getElementById("clientBookings");
  if(!box) return;
  const list = bookings().filter(b => !email || b.clientEmail.toLowerCase() === email.toLowerCase());
  box.innerHTML = list.length ? list.map(b=>`<div class="booking-item"><strong>${escapeHTML(b.service)}</strong><br>${b.date} о ${b.time}<br>Статус: ${b.status==="confirmed"?"підтверджено":b.status==="cancelled"?"скасовано":"новий запис"}</div>`).join("") : `<div class="booking-item">Записів не знайдено.</div>`;
}

document.getElementById("adminLoginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value.trim();
  const pass = document.getElementById("adminPassword").value;
  if(email === OWNER_EMAIL && pass === OWNER_PASSWORD) {
    localStorage.setItem("psy_admin_auth", "yes");
    location.href = "admin.html";
  } else {
    const res = document.getElementById("adminLoginResult");
    res.style.display = "block"; res.textContent = "Неправильний email або пароль.";
  }
});

if(location.pathname.endsWith("admin.html") && localStorage.getItem("psy_admin_auth") !== "yes") {
  location.href = "login.html";
}
document.getElementById("logoutBtn")?.addEventListener("click", e => {
  e.preventDefault(); localStorage.removeItem("psy_admin_auth"); location.href = "login.html";
});

document.querySelectorAll(".tab-btn").forEach(btn => btn.onclick = () => {
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".admin-tab").forEach(t=>t.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("tab-"+btn.dataset.tab)?.classList.add("active");
});

function fillEditors() {
  const s = site();
  document.querySelectorAll("[data-edit]").forEach(el => {
    el.value = s[el.dataset.edit] || "";
  });
}
function saveSiteFromForm(form) {
  const s = site();
  form.querySelectorAll("[data-edit]").forEach(el => s[el.dataset.edit] = el.value);
  setJSON("psy_site", s); applyPublicContent(); fillEditors();
}
["homeEditor","aboutEditor","contactsEditor","privacyEditor"].forEach(id => {
  document.getElementById(id)?.addEventListener("submit", e => { e.preventDefault(); saveSiteFromForm(e.target); });
});

function renderAdminLists() {
  const ad = document.getElementById("adminDirections");
  if(ad) ad.innerHTML = directions().map((x,i)=>listItem(x.title,x.text,`deleteItem('psy_directions',${i})`)).join("");
  const as = document.getElementById("adminServices");
  if(as) as.innerHTML = services().map((x,i)=>listItem(x.title,`${x.price} грн · ${x.format} · ${x.duration}`,`deleteItem('psy_services',${i})`)).join("");
  const ac = document.getElementById("adminCertificates");
  if(ac) ac.innerHTML = certs().map((x,i)=>listItem(x.title,x.image||"",`deleteItem('psy_certs',${i})`)).join("");
  const ar = document.getElementById("adminReviews");
  if(ar) ar.innerHTML = reviews().map((x,i)=>listItem(x.name,x.text,`deleteItem('psy_reviews',${i})`)).join("");
  const af = document.getElementById("adminFaq");
  if(af) af.innerHTML = faqs().map((x,i)=>listItem(x.q,x.a,`deleteItem('psy_faq',${i})`)).join("");
  document.getElementById("statBookings") && (document.getElementById("statBookings").textContent = bookings().length);
  document.getElementById("statServices") && (document.getElementById("statServices").textContent = services().length);
  document.getElementById("statSlots") && (document.getElementById("statSlots").textContent = slots().length);
}
function listItem(title,text,onclick) {
  return `<div class="list-item"><strong>${escapeHTML(title)}</strong><p>${escapeHTML(text)}</p><div class="item-actions"><button class="small-btn danger" onclick="${onclick}">Видалити</button></div></div>`;
}
window.deleteItem = function(key, index) {
  const arr = getJSON(key, []); arr.splice(index,1); setJSON(key, arr); renderAll();
}

document.getElementById("directionForm")?.addEventListener("submit", e => {
  e.preventDefault(); const arr = directions(); arr.push({id:"d"+Date.now(), title:directionTitle.value, text:directionText.value}); setJSON("psy_directions", arr); e.target.reset(); renderAll();
});
document.getElementById("serviceForm")?.addEventListener("submit", e => {
  e.preventDefault(); const arr = services(); arr.push({id:"s"+Date.now(), title:serviceTitle.value, format:serviceFormat.value, duration:serviceDuration.value, price:Number(servicePrice.value), text:serviceText.value}); setJSON("psy_services", arr); e.target.reset(); renderAll();
});
document.getElementById("certificateForm")?.addEventListener("submit", e => {
  e.preventDefault(); const arr = certs(); arr.push({id:"c"+Date.now(), title:certTitle.value, image:certImage.value}); setJSON("psy_certs", arr); e.target.reset(); renderAll();
});
document.getElementById("reviewForm")?.addEventListener("submit", e => {
  e.preventDefault(); const arr = reviews(); arr.push({id:"r"+Date.now(), name:reviewName.value, text:reviewText.value}); setJSON("psy_reviews", arr); e.target.reset(); renderAll();
});
document.getElementById("faqForm")?.addEventListener("submit", e => {
  e.preventDefault(); const arr = faqs(); arr.push({id:"f"+Date.now(), q:faqQuestion.value, a:faqAnswer.value}); setJSON("psy_faq", arr); e.target.reset(); renderAll();
});

let calDate = new Date();
function renderCalendar() {
  const grid = document.getElementById("adminCalendar");
  const title = document.getElementById("calendarTitle");
  if(!grid || !title) return;
  const y = calDate.getFullYear(), m = calDate.getMonth();
  title.textContent = calDate.toLocaleDateString("uk-UA", {month:"long", year:"numeric"});
  const first = new Date(y,m,1);
  const start = new Date(first);
  const offset = (first.getDay()+6)%7;
  start.setDate(first.getDate()-offset);
  const names = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];
  grid.innerHTML = names.map(n=>`<div class="calendar-day-name">${n}</div>`).join("");
  for(let i=0;i<42;i++) {
    const d = new Date(start); d.setDate(start.getDate()+i);
    const iso = d.toISOString().slice(0,10);
    const daySlots = slots().filter(s=>s.date===iso);
    grid.innerHTML += `<div class="calendar-day ${d.getMonth()!==m?"other":""}" onclick="selectSlotDate('${iso}')"><div class="day-number">${d.getDate()}</div>${daySlots.map(s=>`<span class="slot-chip">${s.time} ${s.format==="offline"?"офлайн":"онлайн"}</span>`).join("")}</div>`;
  }
}
window.selectSlotDate = function(iso) {
  const input = document.getElementById("slotDate");
  if(input) input.value = iso;
}
document.getElementById("prevMonth")?.addEventListener("click", e => { e.preventDefault(); calDate.setMonth(calDate.getMonth()-1); renderCalendar(); });
document.getElementById("nextMonth")?.addEventListener("click", e => { e.preventDefault(); calDate.setMonth(calDate.getMonth()+1); renderCalendar(); });
document.getElementById("slotForm")?.addEventListener("submit", e => {
  e.preventDefault(); const arr=slots(); arr.push({id:"slot"+Date.now(), date:slotDate.value, time:slotTime.value, format:slotFormat.value, city:slotCity.value}); setJSON("psy_slots", arr); e.target.reset(); renderAll();
});

function renderAdminBookings() {
  const box = document.getElementById("adminBookings");
  if(!box) return;
  const list = bookings();
  box.innerHTML = list.length ? list.map(b=>`<div class="booking-item"><strong>${escapeHTML(b.clientName)}</strong><br>${escapeHTML(b.service)}<br>${b.date} о ${b.time}<br>${escapeHTML(b.clientPhone)} · ${escapeHTML(b.clientEmail)}<br>${escapeHTML(b.comment || "")}<div class="item-actions"><button class="small-btn" onclick="setBookingStatus('${b.id}','confirmed')">Підтвердити</button><button class="small-btn danger" onclick="setBookingStatus('${b.id}','cancelled')">Скасувати</button></div></div>`).join("") : `<div class="booking-item">Записів поки немає.</div>`;
}
window.setBookingStatus = function(id,status) {
  const arr = bookings().map(b => b.id===id ? {...b,status} : b);
  setJSON("psy_bookings", arr); renderAll();
}

function renderAll() {
  applyPublicContent(); renderDirectionsPublic(); renderServicesPublic(); renderFaqPublic(); renderReviewsPublic(); renderCertsPublic(); updateBookingTimes(); fillEditors(); renderAdminLists(); renderCalendar(); renderAdminBookings(); renderClientBookings();
}
renderAll();
