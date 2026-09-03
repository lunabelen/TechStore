document.addEventListener("DOMContentLoaded", function () {

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    const paginaActual = window.location.pathname;


    // Si nadie inició sesión, vuelve al Login
    if (!tipoUsuario) {
        window.location.href = "../pages/login.html";
        return;
    }


    // El Cliente no puede entrar a páginas administrativas
    if (tipoUsuario === "Cliente") {
        window.location.href = "../index.html";
        return;
    }


    // Permisos del Vendedor
    if (tipoUsuario === "Vendedor") {

        // El vendedor solo puede entrar al listado de productos
        if (!paginaActual.includes("productos-admin.html")) {
            window.location.href = "productos-admin.html";
            return;
        }

        // Oculta las opciones exclusivas del administrador
        const opcionesAdmin =
            document.querySelectorAll(".solo-admin");

        opcionesAdmin.forEach(function (opcion) {
            opcion.style.display = "none";
        });

    }

});