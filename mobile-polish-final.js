
(function(){
  function key(el){return (el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase()}
  function removeDuplicateButtons(){
    document.querySelectorAll('.service-card,.hero-actions,.booking-box,.urgent-standalone-card,.footer,.contact-card,.contact-item,.contact-row').forEach(scope=>{
      const seen=new Set();
      scope.querySelectorAll('button,a.btn,.btn').forEach(btn=>{
        const k=key(btn)+'|'+(btn.getAttribute('href')||'')+'|'+(btn.dataset.service||'');
        if(!k.trim()) return;
        if(seen.has(k)) btn.remove(); else seen.add(k);
      });
    });
  }
  function fixMobileMenu(){
    document.querySelectorAll('.menu-toggle,.burger,.hamburger,[data-menu-toggle]').forEach(btn=>{
      if(btn.dataset.mobilePolishBound==='yes') return;
      btn.dataset.mobilePolishBound='yes';
      btn.addEventListener('click',()=>setTimeout(()=>{
        document.querySelectorAll('.nav.open,.mobile-menu.open,.menu-panel.open,.side-menu.open,.mobile-nav.open').forEach(menu=>{
          menu.style.maxWidth='calc(100vw - 32px)';
          menu.style.width='min(360px, calc(100vw - 32px))';
        });
      },30));
    });
  }
  function centerFooterRows(){
    document.querySelectorAll('.footer-contacts a,.contact-card,.contact-item,.contact-row').forEach(row=>{
      row.style.alignItems='center';
      Array.from(row.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()).forEach(n=>{
        const span=document.createElement('span'); span.textContent=n.textContent.trim(); n.replaceWith(span);
      });
    });
  }
  function removeEmptySpaces(){
    document.querySelectorAll('.section,.card,.admin-card,.client-card,.booking-summary,.about-custom-card').forEach(el=>{
      const txt=key(el), useful=el.querySelector('input,textarea,select,button,a,img,svg,canvas');
      if(!txt&&!useful) el.remove();
    });
  }
  function stopInitialFlicker(){
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
    const pp=document.getElementById('psychologistPhoto');
    if(pp && pp.querySelector('span') && !pp.querySelector('img')) pp.classList.add('placeholder-empty');
  }
  function closeDropdownOnScroll(){
    if(window.__mobilePolishScrollBound) return;
    window.__mobilePolishScrollBound=true;
    window.addEventListener('scroll',()=>document.querySelectorAll('.custom-select-ui.open').forEach(x=>x.classList.remove('open')),{passive:true});
  }
  function run(){stopInitialFlicker();removeDuplicateButtons();fixMobileMenu();centerFooterRows();removeEmptySpaces();closeDropdownOnScroll()}
  const old=window.renderAll;
  if(typeof old==='function'&&!window.__mobilePolishFinal){window.__mobilePolishFinal=true;window.renderAll=function(){old();run()}}
  document.addEventListener('DOMContentLoaded',()=>{run();setTimeout(run,250);setTimeout(run,800);setTimeout(run,1600)});
})();
