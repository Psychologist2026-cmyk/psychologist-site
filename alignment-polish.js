
(function(){
  function run(){
    // прибираємо зайві великі порожні блоки після попередніх правок, якщо вони лишились у DOM
    document.querySelectorAll('.auth-visual:empty, .empty-block:empty').forEach(el => el.remove());

    // гарантуємо активне меню
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('#')[0] || 'index.html';
      const active = href === page || (page === '' && href === 'index.html');
      a.classList.toggle('active-nav', active);
      if(active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // якщо в блоці фактів занадто довгий текст — робимо нормальний перенос, але не ламаємо по буквах
    document.querySelectorAll('.about-facts-grid strong').forEach(el => {
      el.style.wordBreak = 'normal';
      el.style.overflowWrap = 'break-word';
      el.style.hyphens = 'none';
    });
  }

  const old = window.renderAll;
  if(typeof old === 'function' && !window.__alignmentPolish){
    window.__alignmentPolish = true;
    window.renderAll = function(){
      old();
      run();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    run();
    setTimeout(run, 300);
    setTimeout(run, 800);
  });
})();
