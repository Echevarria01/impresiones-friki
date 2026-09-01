// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhHOjeRPhbgp3_IZ1KoaIrc1hZwq_gViQ",
  authDomain: "friki-impre3d.firebaseapp.com",
  projectId: "friki-impre3d",
  storageBucket: "friki-impre3d.firebasestorage.app",
  messagingSenderId: "149466029112",
  appId: "1:149466029112:web:e5bf8dc40d2a1b1da65acd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);