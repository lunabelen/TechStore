/* ============================================================
   sesion.js
   Muestra el estado de inicio de sesión en TODAS las páginas
   (tienda pública y panel administrador) y permite cerrar
   sesión desde cualquiera de ellas.

   - En la tienda pública: si hay sesión activa, el enlace
     "Login" del menú se convierte en "Cerrar sesión" y se
     agrega un saludo ("Hola, Cliente"). Si no hay sesión,
     el menú se deja tal cual (ya incluye "Login"/"Registro").
   - En el panel administrador: siempre se muestra quién inició
     sesión y un botón para cerrarla, dentro del contenedor
     #cabeceraSesion del <header>.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    actualizarNavTienda(tipoUsuario);
    actualizarCabeceraAdmin(tipoUsuario);
});


function actualizarNavTienda(tipoUsuario) {

    const nav = document.querySelector("header nav");

    if (!nav || !tipoUsuario) {
        return;
    }

    const enlaceLogin = nav.querySelector('a[href$="login.html"]');
    const enlaceRegistro = nav.querySelector('a[href$="registro.html"]');

    if (enlaceRegistro) {
        enlaceRegistro.style.display = "none";
    }

    if (!enlaceLogin) {
        return;
    }

    const saludo = document.createElement("span");
    saludo.className = "saludo-sesion";
    saludo.textContent = "Hola, " + capitalizarTexto(tipoUsuario);
    nav.insertBefore(saludo, enlaceLogin);

    enlaceLogin.textContent = "Cerrar sesión";
    enlaceLogin.removeAttribute("href");
    enlaceLogin.classList.add("cerrar-sesion");
    enlaceLogin.addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
    });
}


function actualizarCabeceraAdmin(tipoUsuario) {

    const contenedor = document.getElementById("cabeceraSesion");

    if (!contenedor) {
        return;
    }

    if (!tipoUsuario) {

        contenedor.innerHTML =
            "<a href='../pages/login.html'>Iniciar sesión</a>";
        return;
    }

    contenedor.innerHTML =
        "<span class='saludo-sesion'>Hola, " + capitalizarTexto(tipoUsuario) + "</span>" +
        "<button type='button' id='btnCerrarSesionAdmin'>Cerrar sesión</button>";

    document
        .getElementById("btnCerrarSesionAdmin")
        .addEventListener("click", cerrarSesion);
}


function cerrarSesion() {

    localStorage.removeItem("tipoUsuario");
    localStorage.removeItem("correoSesion");

    const ruta = window.location.pathname;

    if (ruta.includes("/admin/") || ruta.includes("/pages/")) {
        window.location.href = "../index.html";
    } else {
        window.location.href = "index.html";
    }
}


function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
