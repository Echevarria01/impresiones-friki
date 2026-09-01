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

const CLOUD_NAME = "itzyfspq";
const UPLOAD_PRESET = "productos";

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagenes = document.getElementById("imagenes");
const preview = document.getElementById("preview");
const guardarBtn = document.getElementById("guardarBtn");
const lista = document.getElementById("listaProductos");
const logout = document.getElementById("logoutBtn");

let archivos = [];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "admin.html";
  } else {
    cargarProductos();
  }
});

logout.onclick = () => signOut(auth);

imagenes.onchange = (e) => {
  archivos = [...e.target.files].slice(0,4);

  preview.innerHTML = "";

  archivos.forEach(file=>{
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  });
};

guardarBtn.onclick = async ()=>{

  if(!nombre.value || !precio.value){
    alert("Completa nombre y precio");
    return;
  }

  guardarBtn.textContent = "Subiendo...";

  const urls = [];

  for(const file of archivos){

    const form = new FormData();

    form.append("file",file);
    form.append("upload_preset",UPLOAD_PRESET);
    form.append("folder","productos");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method:"POST",
        body:form
      }
    );

    const data = await res.json();

    urls.push(data.secure_url);
  }

  await addDoc(collection(db,"productos"),{

    nombre:nombre.value,
    precio:Number(precio.value),
    descripcion:descripcion.value,
    imagenes:urls

  });

  nombre.value="";
  precio.value="";
  descripcion.value="";
  imagenes.value="";
  preview.innerHTML="";
  archivos=[];

  guardarBtn.textContent="Guardar producto";

  cargarProductos();

};

async function cargarProductos(){

  lista.innerHTML="";

  const query = await getDocs(collection(db,"productos"));

  query.forEach(item=>{

    const p = item.data();

    const card=document.createElement("div");
    card.className="cardProducto";

    card.innerHTML=`
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()}</p>
      <div class="miniImgs">
        ${(p.imagenes||[]).map(img=>`<img src="${img}">`).join("")}
      </div>
      <button class="eliminarBtn">Eliminar</button>
    `;

    card.querySelector("button").onclick=async()=>{

      if(confirm("¿Eliminar producto?")){

        await deleteDoc(doc(db,"productos",item.id));

        cargarProductos();

      }

    };

    lista.appendChild(card);

  });

}