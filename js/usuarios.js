/* ============================================================
   usuarios.js
   Datos base de usuarios + persistencia en localStorage para
   el mantenedor de Usuarios del panel administrador.

   Se combina con las cuentas de acceso definidas en
   validaciones.js (admin@duoc.cl, vendedor@duoc.cl,
   cliente@gmail.com) y con los clientes que se registran desde
   pages/registro.html.

   Claves usadas en localStorage:
   - usuariosNuevos:     arreglo de usuarios creados (admin o registro)
   - usuariosEdiciones:  objeto { run: camposModificados }
   - usuariosEliminados: arreglo de RUN ocultos del listado
   ============================================================ */

const usuariosSeed = [
    {
        run: "111111111",
        nombre: "Admin",
        apellido: "Tech Store",
        correo: "admin@duoc.cl",
        tipoUsuario: "administrador",
        region: "Metropolitana de Santiago",
        comuna: "Santiago",
        direccion: "Oficina central Tech Store",
        fechaNacimiento: ""
    },
    {
        run: "222222222",
        nombre: "Vendedor",
        apellido: "Tech Store",
        correo: "vendedor@duoc.cl",
        tipoUsuario: "vendedor",
        region: "Metropolitana de Santiago",
        comuna: "Ñuñoa",
        direccion: "Sucursal Ñuñoa",
        fechaNacimiento: ""
    },
    {
        run: "123456785",
        nombre: "Usuario",
        apellido: "Ejemplo",
        correo: "cliente@gmail.com",
        tipoUsuario: "cliente",
        region: "Valparaíso",
        comuna: "Viña del Mar",
        direccion: "Avenida Central 123",
        fechaNacimiento: ""
    }
];

function obtenerUsuariosAdmin() {

    const nuevos = JSON.parse(localStorage.getItem("usuariosNuevos") || "[]");
    const ediciones = JSON.parse(localStorage.getItem("usuariosEdiciones") || "{}");
    const eliminados = JSON.parse(localStorage.getItem("usuariosEliminados") || "[]");

    function aplicarEdicion(usuario) {
        if (ediciones[usuario.run]) {
            return Object.assign({}, usuario, ediciones[usuario.run]);
        }
        return usuario;
    }

    const base = usuariosSeed
        .filter(function (usuario) { return eliminados.indexOf(usuario.run) === -1; })
        .map(aplicarEdicion);

    const extra = nuevos
        .filter(function (usuario) { return eliminados.indexOf(usuario.run) === -1; })
        .map(aplicarEdicion);

    return base.concat(extra);
}

function guardarUsuarioNuevo(usuario) {

    const nuevos = JSON.parse(localStorage.getItem("usuariosNuevos") || "[]");

    // Si el RUN ya existe (por ejemplo, un cliente que se vuelve a registrar),
    // se actualiza en vez de duplicarlo.
    const yaExiste = usuariosSeed.concat(nuevos).some(function (u) {
        return u.run === usuario.run;
    });

    if (yaExiste) {
        guardarEdicionUsuario(usuario.run, usuario);
        return;
    }

    nuevos.push(usuario);
    localStorage.setItem("usuariosNuevos", JSON.stringify(nuevos));
}

function guardarEdicionUsuario(run, cambios) {

    const ediciones = JSON.parse(localStorage.getItem("usuariosEdiciones") || "{}");
    ediciones[run] = Object.assign({}, ediciones[run] || {}, cambios);
    localStorage.setItem("usuariosEdiciones", JSON.stringify(ediciones));
}

function eliminarUsuarioAdmin(run) {

    const eliminados = JSON.parse(localStorage.getItem("usuariosEliminados") || "[]");

    if (eliminados.indexOf(run) === -1) {
        eliminados.push(run);
    }

    localStorage.setItem("usuariosEliminados", JSON.stringify(eliminados));
}

function buscarUsuarioPorRun(run) {

    return obtenerUsuariosAdmin().find(function (usuario) {
        return usuario.run === run;
    });
}

function buscarUsuarioPorCorreo(correo) {

    return obtenerUsuariosAdmin().find(function (usuario) {
        return usuario.correo.toLowerCase() === correo.toLowerCase();
    });
}
