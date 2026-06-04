
(function(){
function txt(el){return(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase()}
function removeUselessPhotoLabels(){document.querySelectorAll('#psychologistPhoto>span,#homePsychologistPhoto>span,.photo-placeholder>span').forEach(el=>{const t=txt(el);if(t.includes('фото психолога')||t==='фото')el.remove()})}
function removeBrokenFloatingButtons(){document.querySelectorAll('.floating-actions,.float-actions,.sticky-actions,.sticky-cta').forEach(el=>el.remove());document.querySelectorAll('button,a.btn,.btn').forEach(btn=>{const t=txt(btn),href=btn.getAttribute&&btn.getAttribute('href'),onclick=btn.getAttribute&&btn.getAttribute('onclick'),has=t||href||onclick||btn.type==='submit';if(!has)btn.remove()})}
function dedupeButtons(){document.querySelectorAll('.service-card,.booking-box,.footer,.contact-card,.contact-item,.contact-row').forEach(scope=>{const seen=new Set();scope.querySelectorAll('button,a.btn,.btn').forEach(btn=>{const key=txt(btn)+'|'+(btn.getAttribute('href')||'')+'|'+(btn.dataset.service||'');if(!key.trim())return;if(seen.has(key))btn.remove();else seen.add(key)})})}
function alignContactIcons(){document.querySelectorAll('.footer-contacts a,.contact-card,.contact-item,.contact-row').forEach(row=>{row.querySelectorAll('.social-icon-svg,.contact-icon-real').forEach((icon,i)=>{if(i>0)icon.remove()});row.style.display='grid';row.style.gridTemplateColumns='44px minmax(0,1fr)';row.style.alignItems='center'})}
function removeEmptyBookingSummary(){document.querySelectorAll('.booking-summary').forEach(box=>{const result=box.querySelector('#bookingResult,.booking-result');if(result&&!txt(result))box.classList.add('empty-booking-summary');else box.classList.remove('empty-booking-summary')})}
function run(){removeUselessPhotoLabels();removeBrokenFloatingButtons();dedupeButtons();alignContactIcons();removeEmptyBookingSummary()}
const old=window.renderAll;if(typeof old==='function'&&!window.__mobileCleanFix){window.__mobileCleanFix=true;window.renderAll=function(){old();run()}}
document.addEventListener('DOMContentLoaded',()=>{run();setTimeout(run,250);setTimeout(run,900);setTimeout(run,1600)})
})();
