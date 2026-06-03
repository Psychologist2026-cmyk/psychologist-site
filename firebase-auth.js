
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm8VyPlmKPQ0hd78zR79om9a2kXdnRxyE",
  authDomain: "psyspace-auth.firebaseapp.com",
  projectId: "psyspace-auth",
  storageBucket: "psyspace-auth.firebasestorage.app",
  messagingSenderId: "826689853992",
  appId: "1:826689853992:web:e68f16276ff2986b90331d",
  measurementId: "G-KVCP2GGMKS"
};

// Тут треба поставити реальну пошту психолога, коли буде відома.
// Саме ця пошта після Google-входу відкриватиме кабінет психолога.
const OWNER_EMAIL = localStorage.getItem("psy_owner_email") || "psychologist@example.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

function getClients(){
  try { return JSON.parse(localStorage.getItem("psy_clients")) || []; } catch(e){ return []; }
}
function setClients(arr){
  localStorage.setItem("psy_clients", JSON.stringify(arr));
}
function upsertLocalClient(user){
  const email = (user.email || "").toLowerCase();
  const clients = getClients();
  const idx = clients.findIndex(c => c.email === email);
  const profile = {
    email,
    name: user.displayName || email.split("@")[0],
    password: "",
    phone: "",
    social: "",
    photo: user.photoURL || ""
  };
  if(idx >= 0) clients[idx] = {...clients[idx], ...profile};
  else clients.push(profile);
  setClients(clients);
}
async function saveUser(user){
  const email = (user.email || "").toLowerCase();
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email,
    name: user.displayName || "",
    photo: user.photoURL || "",
    role: email === OWNER_EMAIL.toLowerCase() ? "psychologist" : "client",
    updatedAt: serverTimestamp()
  }, { merge: true });
}
async function finishLogin(user){
  const email = (user.email || "").toLowerCase();
  await saveUser(user);
  if(email === OWNER_EMAIL.toLowerCase()){
    localStorage.psy_admin_auth = "yes";
    localStorage.removeItem("psy_client_email");
    location.href = "admin.html";
  } else {
    upsertLocalClient(user);
    localStorage.psy_client_email = email;
    localStorage.removeItem("psy_admin_auth");
    location.href = "client-dashboard.html";
  }
}
async function googleLoginSameTab(){
  try{
    await setPersistence(auth, browserLocalPersistence);
    localStorage.setItem("psy_google_login_started", "yes");
    await signInWithRedirect(auth, provider);
  }catch(error){
    console.error(error);
    let message = error && error.message ? error.message : String(error);
    if(error.code === "auth/unauthorized-domain"){
      message = "Поточний домен не доданий у Firebase → Authentication → Settings → Authorized domains. Додай точний домен із адресного рядка без https:// і без / в кінці.";
    }
    alert("Google-вхід не спрацював: " + message);
  }
}

window.signInWithGoogleReal = googleLoginSameTab;

document.addEventListener("DOMContentLoaded", async () => {
  const oldBtn = document.getElementById("googleClientBtn");
  if(oldBtn){
    const btn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(btn, oldBtn);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      googleLoginSameTab();
    });
  }

  try{
    const result = await getRedirectResult(auth);
    if(result && result.user){
      await finishLogin(result.user);
    }
  }catch(error){
    console.error(error);
    let message = error && error.message ? error.message : String(error);
    if(error.code === "auth/unauthorized-domain"){
      message = "Додай домен сайту в Firebase Authorized domains.";
    }
    alert("Google-вхід не завершився: " + message);
  }
});
