/* ============================================================
   usuarios-admin-listado.js
   Pinta la tabla de usuarios del panel administrador usando
   los datos reales (usuariosSeed + clientes registrados +
   usuarios creados/editados por el administrador). Ver
   js/usuarios.js.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    pintarTablaUsuarios();
});

function pintarTablaUsuarios() {

    const cuerpo = document.getElementById("cuerpoUsuarios");

    if (!cuerpo) {
        return;
    }

    const usuarios = obtenerUsuariosAdmin();

    cuerpo.innerHTML = "";

    usuarios.forEach(function (usuario) {

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + usuario.run + "</td>" +
            "<td>" + usuario.nombre + "</td>" +
            "<td>" + usuario.apellido + "</td>" +
            "<td>" + usuario.correo + "</td>" +
            "<td><span class='chip'>" + usuario.tipoUsuario + "</span></td>" +
            "<td>" + (usuario.comuna || "-") + ", " + (usuario.region || "-") + "</td>" +
            "<td>" +
            "<a href='editar-usuario.html?run=" + usuario.run + "'>Editar</a>" +
            " &nbsp; " +
            "<button type='button' onclick=\"eliminarUsuarioDesdeTabla('" + usuario.run + "')\">Eliminar</button>" +
            "</td>";

        cuerpo.appendChild(fila);
    });
}

function eliminarUsuarioDesdeTabla(run) {

    const confirmado = confirm("¿Eliminar este usuario?");

    if (!confirmado) {
        return;
    }

    eliminarUsuarioAdmin(run);
    pintarTablaUsuarios();
}
