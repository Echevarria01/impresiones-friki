import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ================================
   CONFIG
================================ */

const CLOUD_NAME = "itzyfspq";
const UPLOAD_PRESET = "productos";

/* ================================
   ELEMENTOS
================================ */

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagenes = document.getElementById("imagenes");
const preview = document.getElementById("preview");
const guardarBtn = document.getElementById("guardarBtn");
const lista = document.getElementById("listaProductos");
const logout = document.getElementById("logoutBtn");

let archivos = [];

/* ================================
   LOGIN
================================ */

onAuthStateChanged(auth, (user) => {

  if (!user) {
    location.href = "admin.html";
    return;
  }

  cargarProductos();

});

logout.onclick = () => signOut(auth);

/* ================================
   PREVIEW + ORDENAR
================================ */

imagenes.onchange = (e) => {

  archivos = [...e.target.files].slice(0, 4);

  renderPreview();

};

function renderPreview() {

  preview.innerHTML = "";

  archivos.forEach((file, index) => {

    const item = document.createElement("div");
    item.className = "previewItem";
    item.draggable = true;
    item.dataset.index = index;

    item.innerHTML = `
      <img src="${URL.createObjectURL(file)}">
      <span>${index + 1}</span>
    `;

    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", (e) => {

      e.preventDefault();

      const desde = Number(
        document.querySelector(".dragging").dataset.index
      );

      const hasta = index;

      const mover = archivos.splice(desde, 1)[0];

      archivos.splice(hasta, 0, mover);

      renderPreview();

    });

    preview.appendChild(item);

  });

}

/* ================================
   GUARDAR PRODUCTO
================================ */

guardarBtn.onclick = async () => {

  if (!nombre.value || !precio.value) {

    alert("Completa nombre y precio");

    return;

  }

  guardarBtn.disabled = true;
  guardarBtn.textContent = "Subiendo...";

  const urls = [];

  try {

    for (const file of archivos) {

      const form = new FormData();

      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);
      form.append("folder", "productos");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: form
        }
      );

      const data = await res.json();

      urls.push(data.secure_url);

    }

    await addDoc(collection(db, "productos"), {

      nombre: nombre.value,
      precio: Number(precio.value),
      descripcion: descripcion.value,
      imagenes: urls

    });

    alert("Producto agregado correctamente");

    nombre.value = "";
    precio.value = "";
    descripcion.value = "";
    imagenes.value = "";

    archivos = [];

    renderPreview();

    cargarProductos();

  } catch (err) {

    console.error(err);

    alert("Error al subir el producto");

  }

  guardarBtn.disabled = false;
  guardarBtn.textContent = "Guardar producto";

};

/* ================================
   LISTAR PRODUCTOS
================================ */

async function cargarProductos() {

  lista.innerHTML = "";

  const query = await getDocs(collection(db, "productos"));

  query.forEach((item) => {

    const p = item.data();

    const card = document.createElement("div");

    card.className = "cardProducto";

    card.innerHTML = `

      <h3>${p.nombre}</h3>

      <p>$${Number(p.precio).toLocaleString("es-AR")}</p>

      <div class="miniImgs">

        ${(p.imagenes || []).map((img, i) => `

          <div class="miniItem">

            <img src="${img}">

            <span>${i + 1}</span>

          </div>

        `).join("")}

      </div>

      <button class="eliminarBtn">
        Eliminar
      </button>

    `;

    card.querySelector(".eliminarBtn").onclick = async () => {

      if (!confirm("¿Eliminar producto?")) return;

      await deleteDoc(doc(db, "productos", item.id));

      cargarProductos();

    };

    lista.appendChild(card);

  });

}