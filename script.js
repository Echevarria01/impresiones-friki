/* =========================================================
   FRIKI IMPRE3D
   SCRIPT.JS COMPLETO
   ========================================================= */


/* =========================================================
   VARIABLES GENERALES
   ========================================================= */

let currentProject = 0;
let currentPhoto = 0;

let galleryModal = null;
let modalImage = null;
let modalTitle = null;
let modalCategory = null;
let photoCounter = null;
let thumbnails = null;
let mainPhoto = null;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("FRIKI IMPRE3D - JS CARGADO");
    console.log("=================================");

    initPrinter();
    initGallery();
    initKeyboard();
    initMobileMenu();
    initScrollReveal();
    initContactForm();

});


/* =========================================================
   🖨️ IMPRESORA 3D
   ========================================================= */

function initPrinter() {

    console.log("Iniciando impresora...");


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const loader =
        document.getElementById("loader");

    const site =
        document.getElementById("site");

    const head =
        document.getElementById("head");

    const logo =
        document.getElementById("logoPrint");

    const progressBar =
        document.getElementById("progressBar");

    const percent =
        document.getElementById("percent");

    const filament =
        document.getElementById("filament");

    const printedFilament =
        document.getElementById("printedFilament");


    /* =====================================================
       COMPROBAR ELEMENTOS
       ===================================================== */

    console.log({
        loader: loader,
        site: site,
        head: head,
        logo: logo,
        progressBar: progressBar,
        percent: percent,
        filament: filament
    });


    if (!loader) {

        console.error(
            "❌ ERROR: No existe #loader en el HTML."
        );

        return;

    }


    if (!head) {

        console.error(
            "❌ ERROR: No existe #head en el HTML."
        );

        return;

    }


    if (!logo) {

        console.error(
            "❌ ERROR: No existe #logoPrint en el HTML."
        );

        return;

    }


    if (!progressBar) {

        console.error(
            "❌ ERROR: No existe #progressBar en el HTML."
        );

        return;

    }


    /* =====================================================
       CONFIGURACIÓN
       ===================================================== */

    /*
       Tiempo total de impresión.

       18000 = 18 segundos.

       Si querés 30 segundos:
       30000

       Si querés 45 segundos:
       45000
    */

    const PRINT_TIME = 4000;


    /*
       Posición horizontal del cabezal.
    */

    const START_X = 8;

    const END_X = 92;


    /*
       Pequeño retraso antes de arrancar.
    */

    const START_DELAY = 500;


    /* =====================================================
       PREPARAR LOADER
       ===================================================== */

    document.body.style.overflow = "hidden";


    loader.style.display = "flex";

    loader.style.opacity = "1";

    loader.style.visibility = "visible";


    loader.classList.remove("finished");


    /* =====================================================
       PREPARAR SITIO
       ===================================================== */

    if (site) {

        site.classList.remove("siteVisible");

        site.style.opacity = "0";

        site.style.visibility = "hidden";

    }


    /* =====================================================
       PREPARAR CABEZAL
       ===================================================== */

    head.style.left =
        START_X + "%";


    /*
       Quitamos cualquier transformación
       que pueda interferir con left.
    */

    head.style.transform =
        "translateX(-50%)";


    /* =====================================================
       PREPARAR LOGO
       ===================================================== */

    logo.style.opacity = "1";

    logo.style.visibility = "visible";

    logo.style.clipPath =
        "inset(100% 0 0 0)";


    /*
       También usamos webkitClipPath
       para compatibilidad.
    */

    logo.style.webkitClipPath =
        "inset(100% 0 0 0)";


    /* =====================================================
       PREPARAR PROGRESO
       ===================================================== */

    progressBar.style.width = "0%";


    if (percent) {

        percent.textContent = "0%";

    }


    /* =====================================================
       PREPARAR FILAMENTO
       ===================================================== */

    if (filament) {

        filament.style.opacity = "0";

    }


    /* =====================================================
       TIEMPO DE INICIO
       ===================================================== */

    let startTime = null;


    /* =====================================================
       ANIMACIÓN
       ===================================================== */

    function print(currentTime) {


        /*
           Guardamos el primer frame.
        */

        if (startTime === null) {

            startTime = currentTime;

        }


        /*
           Tiempo transcurrido.
        */

        const elapsed =
            currentTime - startTime;


        /*
           Progreso entre 0 y 1.
        */

        let progress =
            elapsed / PRINT_TIME;


        /*
           Limitar.
        */

        if (progress < 0) {

            progress = 0;

        }


        if (progress > 1) {

            progress = 1;

        }


        /* =================================================
           PORCENTAJE
           ================================================= */

        const value =
            Math.floor(progress * 100);


        progressBar.style.width =
            value + "%";


        if (percent) {

            percent.textContent =
                value + "%";

        }


        /* =================================================
           MOVIMIENTO CABEZAL
           ================================================= */

        const HEAD_SPEED = 6;

// Hace que el cabezal vaya y vuelva
let headProgress = (progress * HEAD_SPEED) % 2;

// Convertirlo en movimiento:
// 0 → 1 → 0
if (headProgress > 1) {
    headProgress = 2 - headProgress;
}

const x =
    START_X +
    (END_X - START_X) *
    headProgress;

head.style.left = x + "%";

/* Activar animación mientras imprime */
head.classList.add("printing");

        /* =================================================
           LOGO
           ================================================= */

        const clip =
            `inset(${100 - value}% 0 0 0)`;


        logo.style.clipPath =
            clip;


        logo.style.webkitClipPath =
            clip;

        /* =================================================
           FILAMENTO
           ================================================= */

        if (filament) {

            if (progress > 0.02) {

                filament.style.opacity = "1";

            } else {

                filament.style.opacity = "0";

            }

        }


        /* =================================================
           CLASE PRINTING
           ================================================= */

        loader.classList.add("printing");


        /* =================================================
           CONTINUAR
           ================================================= */

        if (progress < 1) {

            requestAnimationFrame(print);

        } else {

            finishPrinter();

        }

    }


    /* =====================================================
       FINALIZAR IMPRESIÓN
       ===================================================== */

    function finishPrinter() {

        console.log(
            "✅ FRIKI IMPRE3D: IMPRESIÓN TERMINADA"
        );


        /* =================================================
           VALORES FINALES
           ================================================= */

        progressBar.style.width =
            "100%";


        if (percent) {

            percent.textContent =
                "100%";

        }


        logo.style.clipPath =
            "inset(0 0 0 0)";


        logo.style.webkitClipPath =
            "inset(0 0 0 0)";


        if (filament) {

            filament.style.opacity = "1";

        }

    head.classList.remove("printing");
        /* =================================================
           EFECTO FINAL
           ================================================= */

        loader.classList.remove(
            "printing"
        );


        loader.classList.add(
            "finished"
        );


        /*
           Mostrar sitio después de
           un pequeño momento.
        */

        setTimeout(function () {


            /* =============================================
               MOSTRAR SITIO
               ============================================= */

            if (site) {

                site.classList.add(
                    "siteVisible"
                );

                site.style.opacity =
                    "1";

                site.style.visibility =
                    "visible";

            }


            /* =============================================
               OCULTAR LOADER
               ============================================= */

            setTimeout(function () {

                loader.style.opacity =
                    "0";

                loader.style.visibility =
                    "hidden";


                /* =========================================
                   ELIMINARLO VISUALMENTE
                   ========================================= */

                setTimeout(function () {

                    loader.style.display =
                        "none";


                    document.body.style.overflow =
                        "";

                }, 1200);


            }, 800);


        }, 1500);

    }


    /* =====================================================
       ARRANCAR
       ===================================================== */

    setTimeout(function () {

        console.log(
            "🖨️ FRIKI IMPRE3D: INICIANDO IMPRESIÓN"
        );

        requestAnimationFrame(print);

    }, START_DELAY);

}


/* =========================================================
   🖼️ PROYECTOS / GALERÍA
   ========================================================= */

const projects = [

    {
        title: "Figura Personalizada",

        category: "TRABAJO 01",

        images: [

            "images/figura/foto1.jpg",
            "images/figura/foto2.jpg",
            "images/figura/foto3.jpg",
            "images/figura/foto4.jpg"

        ]

    },


    {
        title: "Prototipo",

        category: "TRABAJO 02",

        images: [

            "images/prototipo/foto1.jpg",
            "images/prototipo/foto2.jpg",
            "images/prototipo/foto3.jpg"

        ]

    },


    {
        title: "Decoración",

        category: "TRABAJO 03",

        images: [

            "images/decoracion/foto1.jpg",
            "images/decoracion/foto2.jpg",
            "images/decoracion/foto3.jpg"

        ]

    },


    {
        title: "MACETA HELLO KITTY",

        category: "TRABAJO 04",

        images: [

            "images/kittymaceta/foto1.jpg",
            "images/kittymaceta/foto2.jpg",
            "images/kittymaceta/foto3.jpg",
            "images/kittymaceta/foto4.jpg",
            "images/kittymaceta/foto5.jpg",
            "images/kittymaceta/foto6.jpg"

        ]

    },


    {
        title: "Llavero Personalizado",

        category: "TRABAJO 05",

        images: [

            "images/llavero/foto1.jpg",
            "images/llavero/foto2.jpg",
            "images/llavero/foto3.jpg",
            "images/llavero/foto4.jpg",
            
        ]

    },


    {
        title: "CLIP SELLADOR DE BOLSAS",

        category: "TRABAJO 06",

        images: [

            "images/clip/foto1.jpg",
            "images/clip/foto2.jpg",
            "images/clip/foto3.jpg",

        ]

    }

];


/* =========================================================
   INICIAR GALERÍA
   ========================================================= */

function initGallery() {

    galleryModal =
        document.getElementById(
            "galleryModal"
        );


    modalImage =
        document.getElementById(
            "modalImage"
        );


    modalTitle =
        document.getElementById(
            "modalTitle"
        );


    modalCategory =
        document.getElementById(
            "modalCategory"
        );


    photoCounter =
        document.getElementById(
            "photoCounter"
        );


    thumbnails =
        document.getElementById(
            "thumbnails"
        );


    mainPhoto =
        document.querySelector(
            ".mainPhoto"
        );


    /*
       La galería es opcional.
       Si no existe, la impresora
       sigue funcionando.
    */

    if (!galleryModal) {

        console.warn(
            "⚠️ No existe #galleryModal. Galería desactivada."
        );

        return;

    }


    const background =
        galleryModal.querySelector(
            ".modalBackground"
        );


    if (background) {

        background.addEventListener(
            "click",
            function () {

                closeGallery();

            }
        );

    }


    const closeButton =
        galleryModal.querySelector(
            ".closeGallery"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                closeGallery();

            }
        );

    }


    initSwipe();

}


/* =========================================================
   ABRIR GALERÍA
   ========================================================= */

function openGallery(projectIndex) {

    if (!galleryModal) {

        console.error(
            "❌ No existe #galleryModal"
        );

        return;

    }


    if (!projects[projectIndex]) {

        console.error(
            "❌ Proyecto no encontrado:",
            projectIndex
        );

        return;

    }


    currentProject =
        projectIndex;


    currentPhoto =
        0;


    const project =
        projects[currentProject];


    if (modalTitle) {

        modalTitle.textContent =
            project.title;

    }


    if (modalCategory) {

        modalCategory.textContent =
            project.category;

    }


    renderGallery();


    galleryModal.classList.add(
        "active"
    );


    galleryModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   RENDERIZAR GALERÍA
   ========================================================= */

function renderGallery() {

    const project =
        projects[currentProject];


    if (!project) {

        return;

    }


    if (
        !project.images ||
        project.images.length === 0
    ) {

        return;

    }


    if (modalImage) {

        modalImage.src =
            project.images[currentPhoto];


        modalImage.alt =
            `${project.title} - foto ${currentPhoto + 1}`;

    }


    if (photoCounter) {

        photoCounter.textContent =
            `${currentPhoto + 1} / ${project.images.length}`;

    }


    if (!thumbnails) {

        return;

    }


    thumbnails.innerHTML = "";


    project.images.forEach(
        function (image, index) {


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "thumbnail";


            if (
                index === currentPhoto
            ) {

                button.classList.add(
                    "active"
                );

            }


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image;


            img.alt =
                `${project.title} - foto ${index + 1}`;


            img.onerror =
                function () {

                    console.warn(
                        "⚠️ Imagen no encontrada:",
                        image
                    );

                };


            button.appendChild(
                img
            );


            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    currentPhoto =
                        index;


                    renderGallery();

                }
            );


            thumbnails.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   SIGUIENTE FOTO
   ========================================================= */

function nextPhoto(event) {

    if (event) {

        event.stopPropagation();

    }


    const project =
        projects[currentProject];


    if (
        !project ||
        !project.images ||
        project.images.length === 0
    ) {

        return;

    }


    currentPhoto++;


    if (
        currentPhoto >=
        project.images.length
    ) {

        currentPhoto = 0;

    }


    renderGallery();

}


/* =========================================================
   FOTO ANTERIOR
   ========================================================= */

function previousPhoto(event) {

    if (event) {

        event.stopPropagation();

    }


    const project =
        projects[currentProject];


    if (
        !project ||
        !project.images ||
        project.images.length === 0
    ) {

        return;

    }


    currentPhoto--;


    if (currentPhoto < 0) {

        currentPhoto =
            project.images.length - 1;

    }


    renderGallery();

}


/* =========================================================
   CERRAR GALERÍA
   ========================================================= */

function closeGallery() {

    if (!galleryModal) {

        return;

    }


    galleryModal.classList.remove(
        "active"
    );


    galleryModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   ⌨️ TECLADO
   ========================================================= */

function initKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {


            if (
                event.key === "Escape"
            ) {

                if (
                    galleryModal &&
                    galleryModal.classList.contains(
                        "active"
                    )
                ) {

                    closeGallery();

                }

                return;

            }


            if (
                !galleryModal ||
                !galleryModal.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextPhoto();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousPhoto();

            }

        }
    );

}


/* =========================================================
   📱 MENÚ MÓVIL
   ========================================================= */

function initMobileMenu() {

    const menuButton =
        document.querySelector(
            ".menuButton"
        );


    const menu =
        document.querySelector(
            "nav ul"
        );


    if (!menuButton || !menu) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            menu.classList.toggle(
                "active"
            );


            const expanded =
                menu.classList.contains(
                    "active"
                );


            menuButton.setAttribute(
                "aria-expanded",
                expanded
            );

        }
    );


    const links =
        menu.querySelectorAll(
            "a"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove(
                        "active"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   📱 SWIPE
   ========================================================= */

function initSwipe() {

    if (!mainPhoto) {

        return;

    }


    mainPhoto.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;


            touchStartY =
                event.changedTouches[0].screenY;

        },
        {
            passive: true
        }
    );


    mainPhoto.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].screenX;


            touchEndY =
                event.changedTouches[0].screenY;


            handleSwipe();

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   DETECTAR SWIPE
   ========================================================= */

function handleSwipe() {

    const horizontal =
        touchEndX -
        touchStartX;


    const vertical =
        touchEndY -
        touchStartY;


    if (
        Math.abs(vertical) >
        Math.abs(horizontal)
    ) {

        return;

    }


    if (
        horizontal < -50
    ) {

        nextPhoto();

    }


    if (
        horizontal > 50
    ) {

        previousPhoto();

    }

}


/* =========================================================
   🖼️ PRE-CARGAR IMÁGENES
   ========================================================= */

function preloadImages() {

    projects.forEach(
        function (project) {

            project.images.forEach(
                function (image) {

                    const preload =
                        new Image();


                    preload.src =
                        image;

                }
            );

        }
    );

}


preloadImages();


/* =========================================================
   PROTECCIÓN CONTRA IMÁGENES ROTAS
   ========================================================= */

document.addEventListener(
    "error",
    function (event) {

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            console.warn(
                "⚠️ No se pudo cargar:",
                event.target.src
            );

        }

    },
    true
);


/* =========================================================
   ✨ ANIMACIONES AL HACER SCROLL
   ========================================================= */

function initScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".scrollReveal"
        );


    if (
        elements.length === 0
    ) {

        return;

    }


    /*
       Si el navegador no soporta
       IntersectionObserver.
    */

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:0.15
            }
        );


    elements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   📩 FORMULARIO
   ========================================================= */

function initContactForm() {

    const form =
        document.querySelector(
            ".contactForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            /*
               Evitamos que la página
               se recargue si todavía
               no configuraste backend.
            */

            event.preventDefault();


            let message =
                form.querySelector(
                    ".formMessage"
                );


            /*
               Si no existe mensaje,
               lo creamos.
            */

            if (!message) {

                message =
                    document.createElement(
                        "div"
                    );

                message.className =
                    "formMessage";


                form.appendChild(
                    message
                );

            }


            message.textContent =
                "¡Mensaje preparado! Contactanos para confirmar tu presupuesto.";


            message.classList.add(
                "show"
            );


            /*
               Limpiar formulario.
            */

            form.reset();


            /*
               Ocultar mensaje.
            */

            setTimeout(
                function () {

                    message.classList.remove(
                        "show"
                    );

                },
                5000
            );

        }
    );

}


/* =========================================================
   FIN
   ========================================================= */

console.log(
    "FRIKI IMPRE3D: SCRIPT LISTO"
);

/* =====================================================
   FORMULARIO → WHATSAPP (3 NÚMEROS AL AZAR)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const telefonos = [
            "5492612326424",
            "5492612442137",
            "5492613050426"
        ];

        const telefono = telefonos[Math.floor(Math.random() * telefonos.length)];

        const name = contactForm.querySelector('[name="name"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const subject = contactForm.querySelector('[name="subject"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();

        const texto =
            "Hola FRIKI IMPRE3D\n\n" +
            "Quiero hacer una consulta.\n\n" +
            "Nombre: " + name + "\n" +
            "Email: " + email + "\n" +
            "Asunto: " + (subject || "Sin asunto") + "\n\n" +
            "Detalle del proyecto:\n" +
            message;

        const url =
            "https://wa.me/" + telefono +
            "?text=" + encodeURIComponent(texto);

        window.open(url, "_blank");

    });

});


/* ======================================
   CARRITO CON MEMORIA
====================================== */

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
});

function toggleCarrito() {
    document.getElementById("carritoPanel").classList.toggle("active");
}

function agregarAlCarrito(nombre, precio) {

    const item = carrito.find(p => p.nombre === nombre);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({
            nombre,
            precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarCarrito();

    document.getElementById("carritoPanel").classList.add("active");
}

function actualizarCarrito() {

    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("cartCount");
    const totalHTML = document.getElementById("totalCarrito");

    if (!lista) return;

    lista.innerHTML = "";

    if (carrito.length === 0) {

        lista.innerHTML =
            '<p class="carritoVacio">Tu carrito está vacío</p>';

        contador.textContent = "0";
        totalHTML.textContent = "0";
        return;
    }

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((p, index) => {

        total += p.precio * p.cantidad;
        cantidadTotal += p.cantidad;

        lista.innerHTML += `
        <div class="itemCarrito">

            <h4>${p.nombre}</h4>

            <p>$${p.precio.toLocaleString()}</p>

            <div class="controles">

                <button onclick="cambiarCantidad(${index},-1)">−</button>

                <strong>${p.cantidad}</strong>

                <button onclick="cambiarCantidad(${index},1)">+</button>

                <button class="eliminar"
                        onclick="eliminarProducto(${index})">
                    ✕
                </button>

            </div>

        </div>`;
    });

    contador.textContent = cantidadTotal;
    totalHTML.textContent = total.toLocaleString();
}

function cambiarCantidad(index, cambio) {

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    actualizarCarrito();
}

function eliminarProducto(index) {

    carrito.splice(index, 1);

    guardarCarrito();
    actualizarCarrito();
}

function vaciarCarrito() {

    carrito = [];

    guardarCarrito();
    actualizarCarrito();
}

function finalizarCompra() {

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const telefonos = [
        "5492612326424",
        "5492612442137",
        "5492613050426"
    ];

    const telefono = telefonos[Math.floor(Math.random() * telefonos.length)];

    let mensaje =
        "Hola FRIKI IMPRE3D\n\n" +
        "QUIERO REALIZAR ESTE PEDIDO\n\n";

    let total = 0;

    carrito.forEach((p, i) => {
        mensaje += `${i + 1}. ${p.nombre}\n`;
        mensaje += `Cantidad: ${p.cantidad}\n`;
        mensaje += `Precio: $${p.precio.toLocaleString()}\n\n`;
        total += p.precio * p.cantidad;
    });

    mensaje += `TOTAL: $${total.toLocaleString()}\n\n`;
    mensaje += "Quisiera consultar los medios de pago y entrega.";

    const whatsappURL =
        "https://wa.me/" + telefono +
        "?text=" + encodeURIComponent(mensaje);

    // Abrir WhatsApp
    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    // Vaciar el carrito después de enviar
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
}