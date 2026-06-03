
(function(){
  function fixAboutClasses(){
    var aboutSection = document.querySelector('.about-critical-layout, .about-final-layout, .about-profile-layout');
    if(!aboutSection && location.pathname.includes('about')){
      var candidates = Array.from(document.querySelectorAll('main > section'));
      aboutSection = candidates.find(function(s){
        return s.querySelector('#psychologistPhoto') || s.querySelector('.photo-placeholder');
      });
      if(aboutSection) aboutSection.classList.add('about-critical-layout');
    }
  }

  function normalizeFactText(){
    document.querySelectorAll('.about-facts-grid article, .about-facts-grid strong, .about-facts-grid p').forEach(function(el){
      el.style.wordBreak = 'normal';
      el.style.overflowWrap = 'normal';
      el.style.hyphens = 'none';
    });
  }

  function run(){
    fixAboutClasses();
    normalizeFactText();
  }

  var old = window.renderAll;
  if(typeof old === 'function' && !window.__wideLayoutFix){
    window.__wideLayoutFix = true;
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
