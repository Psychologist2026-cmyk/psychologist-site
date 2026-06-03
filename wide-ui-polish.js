
(function(){
  function esc(s){
    return String(s || '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }

  function createSelectUI(select){
    if(!select || select.dataset.customUi === 'yes') return;
    select.dataset.customUi = 'yes';

    const wrap = document.createElement('div');
    wrap.className = 'custom-select-ui';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'custom-select-button';

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';

    wrap.appendChild(button);
    wrap.appendChild(menu);
    select.insertAdjacentElement('afterend', wrap);

    function render(){
      const selected = select.options[select.selectedIndex];
      button.innerHTML = '<span>' + esc(selected ? selected.textContent.trim() : 'Оберіть') + '</span>';

      menu.innerHTML = Array.from(select.options).map(function(opt){
        const active = opt.value === select.value ? ' active' : '';
        return '<button type="button" class="custom-select-option' + active + '" data-value="' + esc(opt.value) + '">' + esc(opt.textContent.trim()) + '</button>';
      }).join('');

      menu.querySelectorAll('[data-value]').forEach(function(item){
        item.onclick = function(e){
          e.stopPropagation();
          select.value = item.dataset.value;
          select.dispatchEvent(new Event('change', {bubbles:true}));
          wrap.classList.remove('open');
          render();
        };
      });
    }

    button.onclick = function(e){
      e.stopPropagation();
      document.querySelectorAll('.custom-select-ui.open').forEach(function(x){
        if(x !== wrap) x.classList.remove('open');
      });
      wrap.classList.toggle('open');
      render();
    };

    select.addEventListener('change', render);
    render();
  }

  function makeDateUI(){
    const date = document.getElementById('bookingDate');
    if(!date || date.dataset.customDateUi === 'yes') return;
    date.dataset.customDateUi = 'yes';

    const oldLabel = document.querySelector('.custom-booking-label');
    if(oldLabel) oldLabel.style.display = 'none';

    const label = document.createElement('div');
    label.className = 'custom-field-label';
    label.textContent = 'Оберіть дату';
    date.insertAdjacentElement('afterend', label);
  }

  function polishTypography(){
    document.querySelectorAll('.about-facts-grid strong, .about-facts-grid span, .service-card h3, .service-card p, .professional-path-card p, .professional-path-card li').forEach(function(el){
      el.style.wordBreak = 'normal';
      el.style.overflowWrap = 'normal';
      el.style.hyphens = 'none';
    });
  }

  function run(){
    createSelectUI(document.getElementById('bookingService'));
    createSelectUI(document.getElementById('bookingTime'));
    makeDateUI();
    polishTypography();
  }

  const oldRenderAll = window.renderAll;
  if(typeof oldRenderAll === 'function' && !window.__wideUiPolish){
    window.__wideUiPolish = true;
    window.renderAll = function(){
      oldRenderAll();
      run();
    };
  }

  document.addEventListener('click', function(){
    document.querySelectorAll('.custom-select-ui.open').forEach(function(x){ x.classList.remove('open'); });
  });

  document.addEventListener('DOMContentLoaded', function(){
    run();
    setTimeout(run, 300);
    setTimeout(run, 900);
  });
})();
