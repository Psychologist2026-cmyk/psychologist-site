
(function(){
  function cleanText(s){ return String(s || '').replace(/\s+/g, ' ').trim(); }

  const iconMap = {
    instagram: 'Instagram',
    telegram: 'Telegram',
    facebook: 'Facebook',
    email: 'Email',
    phone: 'Телефон',
    site: 'Сайт'
  };

  function detectType(row){
    const text = cleanText(row.textContent).toLowerCase();
    const href = (row.getAttribute && row.getAttribute('href') || '').toLowerCase();
    const full = text + ' ' + href;

    if(full.includes('instagram')) return 'instagram';
    if(full.includes('telegram') || full.includes('t.me')) return 'telegram';
    if(full.includes('facebook') || full.includes('fb.com')) return 'facebook';
    if(full.includes('@') || full.includes('mail')) return 'email';
    if(full.includes('+') || full.includes('тел') || full.match(/\d{6,}/)) return 'phone';
    return 'site';
  }

  function getValue(row, type){
    const cloned = row.cloneNode(true);
    cloned.querySelectorAll('.social-icon-svg,.contact-icon-real,.contact-title-line,.contact-value-line').forEach(x => x.remove());
    let value = cleanText(cloned.textContent);

    if(!value && row.getAttribute) value = row.getAttribute('href') || '';
    value = value.replace(/^instagram[:\s-]*/i, '')
                 .replace(/^telegram[:\s-]*/i, '')
                 .replace(/^facebook[:\s-]*/i, '')
                 .replace(/^email[:\s-]*/i, '')
                 .replace(/^телефон[:\s-]*/i, '')
                 .trim();

    if(!value) {
      if(type === 'telegram') value = '@USERNAME';
      if(type === 'email') value = 'psychologist@example.com';
      if(type === 'phone') value = '+380000000000';
      if(type === 'instagram') value = '@USERNAME';
      if(type === 'facebook') value = 'Facebook';
    }
    return value;
  }

  function formatContactRows(){
    document.querySelectorAll('.footer-contacts a, .contact-card, .contact-item, .contact-row').forEach(row => {
      if(row.dataset.contactFormatted === 'yes') return;

      const icons = row.querySelectorAll('.social-icon-svg,.contact-icon-real');
      icons.forEach((icon, index) => {
        if(index > 0) icon.remove();
      });

      let icon = row.querySelector('.social-icon-svg,.contact-icon-real');
      const type = detectType(row);
      const title = iconMap[type] || 'Контакт';
      const value = getValue(row, type);

      if(!icon) {
        icon = document.createElement('span');
        icon.className = 'contact-icon-real ' + type;
        row.prepend(icon);
      }

      const titleEl = document.createElement('span');
      titleEl.className = 'contact-title-line';
      titleEl.textContent = title;

      const valueEl = document.createElement('b');
      valueEl.className = 'contact-value-line';
      valueEl.textContent = value;

      Array.from(row.childNodes).forEach(node => {
        if(node !== icon) node.remove();
      });

      row.appendChild(titleEl);
      row.appendChild(valueEl);
      row.dataset.contactFormatted = 'yes';
    });
  }

  function removeBadFloatingButtons(){
    document.querySelectorAll('.floating-actions,.float-actions,.sticky-actions,.sticky-cta,.quick-actions,.quick-contact,.fixed-cta,.fixed-buttons').forEach(el => el.remove());

    document.querySelectorAll('body > a, body > button').forEach(el => {
      const text = cleanText(el.textContent).toLowerCase();
      const href = (el.getAttribute && el.getAttribute('href') || '').toLowerCase();
      const cls = el.className || '';

      const looksFloating = getComputedStyle(el).position === 'fixed' || String(cls).includes('float') || String(cls).includes('sticky');
      const isCta = text.includes('запис') || text.includes('telegram') || href.includes('telegram') || href.includes('t.me');
      if(looksFloating && isCta) el.remove();
    });
  }

  function makeHeaderSticky(){
    document.querySelectorAll('.header,.site-header,.navbar,header').forEach(h => {
      h.style.position = 'fixed';
      h.style.zIndex = '9990';
    });
  }

  function run(){
    formatContactRows();
    removeBadFloatingButtons();
    makeHeaderSticky();
  }

  const old = window.renderAll;
  if(typeof old === 'function' && !window.__stickyContactFix){
    window.__stickyContactFix = true;
    window.renderAll = function(){
      old();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    run();
    setTimeout(run, 300);
    setTimeout(run, 1000);
    setTimeout(run, 1800);
  });
})();
