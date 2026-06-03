
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm8VyPlmKPQ0hd78zR79om9a2kXdnRxyE",
  authDomain: "psyspace-auth.firebaseapp.com",
  projectId: "psyspace-auth",
  storageBucket: "psyspace-auth.firebasestorage.app",
  messagingSenderId: "826689853992",
  appId: "1:826689853992:web:e68f16276ff2986b90331d",
  measurementId: "G-KVCP2GGMKS"
};

const OWNER_EMAIL = "psychologist@example.com";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function getClients(){
  try { return JSON.parse(localStorage.getItem("psy_clients")) || []; } catch(e){ return []; }
}

function setClients(arr){
  localStorage.setItem("psy_clients", JSON.stringify(arr));
}

function upsertLocalClient(user){
  const email = user.email.toLowerCase();
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

async function saveUserToFirestore(user){
  const email = user.email.toLowerCase();
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email,
    name: user.displayName || "",
    photo: user.photoURL || "",
    role: email === OWNER_EMAIL ? "psychologist" : "client",
    updatedAt: serverTimestamp()
  }, { merge: true });
}

window.signInWithGoogleReal = async function(){
  try{
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const email = user.email.toLowerCase();
    await saveUserToFirestore(user);

    if(email === OWNER_EMAIL){
      localStorage.psy_admin_auth = "yes";
      localStorage.removeItem("psy_client_email");
      location.href = "admin.html";
    } else {
      upsertLocalClient(user);
      localStorage.psy_client_email = email;
      localStorage.removeItem("psy_admin_auth");
      location.href = "client-dashboard.html";
    }
  } catch(error){
    alert("Google-вхід не спрацював: " + error.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("googleClientBtn");
  if(btn){
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.signInWithGoogleReal();
    });
  }
});
