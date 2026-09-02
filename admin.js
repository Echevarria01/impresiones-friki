let imagenes = [];
let dragIndex = null;

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const btn = document.getElementById("loginBtn");
const error = document.getElementById("error");

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "panel.html";

  } catch {

    error.textContent = "Correo o contraseña incorrectos";

  }

});