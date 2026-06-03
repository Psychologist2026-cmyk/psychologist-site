
(function(){
  function textKey(el){
    return (el.textContent || '').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function hideDuplicateButtons(){
    const scopes = document.querySelectorAll('.service-card, .hero-actions, .booking-box, .urgent-standalone-card, .admin-card, .client-card');
    scopes.forEach(scope=>{
      const seen = new Set();
      scope.querySelectorAll('button, .btn, a.btn').forEach(btn=>{
        const key = textKey(btn) + '|' + (btn.getAttribute('href') || '') + '|' + (btn.dataset.service || '');
        if(!key.trim()) return;
        if(seen.has(key)){
          btn.classList.add('duplicate-hidden');
        } else {
          seen.add(key);
        }
      });
    });
  }

  function removeEmptyBlocks(){
    document.querySelectorAll('.about-custom-card, .service-card, .admin-card, .client-card, .booking-summary').forEach(el=>{
      const hasInput = el.querySelector('input, textarea, select, button, a, img');
      if(!textKey(el) && !hasInput) el.remove();
    });
  }

  function preventDoubleIcons(){
    document.querySelectorAll('.contact-card, .contact-item, .contact-row').forEach(row=>{
      const icons = row.querySelectorAll('.contact-icon-real');
      icons.forEach((icon, idx)=>{ if(idx>0) icon.remove(); });
    });
  }

  function stabilizeAbout(){
    if(!location.pathname.includes('about')) return;
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
    const photo = document.getElementById('psychologistPhoto');
    if(photo){
      photo.style.minHeight = window.innerWidth < 720 ? '480px' : '680px';
    }
  }

  function closeMenusOnScroll(){
    if(window.__closeMenusOnScrollBound) return;
    window.__closeMenusOnScrollBound = true;
    window.addEventListener('scroll', ()=>{
      document.querySelectorAll('.custom-select-ui.open').forEach(x=>x.classList.remove('open'));
    }, {passive:true});
  }

  function run(){
    hideDuplicateButtons();
    removeEmptyBlocks();
    preventDoubleIcons();
    stabilizeAbout();
    closeMenusOnScroll();
  }

  const old = window.renderAll;
  if(typeof old === 'function' && !window.__uiStabilityFix){
    window.__uiStabilityFix = true;
    window.renderAll = function(){
      old();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    run();
    setTimeout(run, 250);
    setTimeout(run, 800);
    setTimeout(run, 1500);
  });
})();
