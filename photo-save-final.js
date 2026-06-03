
(function(){
  function read(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; }
  }
  function write(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function imageFileToCompressedDataUrl(file){
    // HEIC may not be supported by browser canvas; JPG/PNG/WebP are supported.
    const bitmapUrl = URL.createObjectURL(file);
    try{
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = bitmapUrl;
      });

      const maxSide = 1400;
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;

      if(w > maxSide || h > maxSide){
        if(w >= h){
          h = Math.round(h * (maxSide / w));
          w = maxSide;
        } else {
          w = Math.round(w * (maxSide / h));
          h = maxSide;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fffaf3";
      ctx.fillRect(0,0,w,h);
      ctx.drawImage(img,0,0,w,h);

      return canvas.toDataURL("image/jpeg", 0.82);
    } finally {
      URL.revokeObjectURL(bitmapUrl);
    }
  }

  async function fileToDataUrl(file){
    try{
      return await imageFileToCompressedDataUrl(file);
    }catch(e){
      console.warn("Canvas compression failed, fallback to FileReader", e);
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }

  function getSite(){
    return read("psy_site", {});
  }
  function saveSite(site){
    write("psy_site", site);
  }

  function showStatus(input, text){
    let el = document.getElementById(input.id + "Status");
    if(!el){
      el = document.createElement("small");
      el.id = input.id + "Status";
      el.className = "photo-save-status";
      input.insertAdjacentElement("afterend", el);
    }
    el.textContent = text;
  }

  function renderPhotoBox(id, url){
    const box = document.getElementById(id);
    if(!box) return;
    if(url){
      box.innerHTML = `<img src="${url}" alt="Фото психолога">`;
      box.classList.add("has-photo");
    }
  }

  function renderAllSavedPhotos(){
    const site = getSite();
    const photo = site.photoUrl || site.homePhotoUrl || "";
    const homePhoto = site.homePhotoUrl || site.photoUrl || "";

    renderPhotoBox("psychologistPhoto", photo);
    renderPhotoBox("homePsychologistPhoto", homePhoto);
  }

  function bindAdminPhotoInput(id, key, alsoKey){
    const input = document.getElementById(id);
    if(!input || input.dataset.fixedPhotoSave === "yes") return;
    input.dataset.fixedPhotoSave = "yes";

    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if(!file) return;

      showStatus(input, "Зберігаю фото...");
      try{
        const data = await fileToDataUrl(file);
        const site = getSite();
        site[key] = data;
        if(alsoKey) site[alsoKey] = data;
        saveSite(site);
        renderAllSavedPhotos();
        showStatus(input, "Фото збережено і додано на сайт");
      }catch(e){
        console.error(e);
        showStatus(input, "Не вдалось зберегти фото. Спробуйте JPG або PNG меншого розміру.");
      }
    });
  }

  function bindClientPhoto(){
    const input = document.getElementById("profilePhotoFile");
    if(!input || input.dataset.fixedPhotoSave === "yes") return;
    input.dataset.fixedPhotoSave = "yes";

    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if(!file) return;
      const data = await fileToDataUrl(file);
      const hidden = document.getElementById("profilePhoto");
      if(hidden) hidden.value = data;
      const preview = document.getElementById("clientPhotoPreview");
      if(preview){
        preview.innerHTML = `<img src="${data}" alt="Фото">`;
        preview.classList.add("has-photo");
      }
    });
  }

  const oldRenderAll = window.renderAll || null;
  if(typeof oldRenderAll === "function" && !window.__photoSaveFinalPatch){
    window.__photoSaveFinalPatch = true;
    window.renderAll = function(){
      oldRenderAll();
      bindAdminPhotoInput("psychologistPhotoFile", "photoUrl", "homePhotoUrl");
      bindAdminPhotoInput("homePhotoFile", "homePhotoUrl");
      bindClientPhoto();
      renderAllSavedPhotos();
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindAdminPhotoInput("psychologistPhotoFile", "photoUrl", "homePhotoUrl");
    bindAdminPhotoInput("homePhotoFile", "homePhotoUrl");
    bindClientPhoto();
    renderAllSavedPhotos();
    setTimeout(renderAllSavedPhotos, 300);
  });
})();
