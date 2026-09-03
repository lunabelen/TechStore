document.addEventListener("DOMContentLoaded", function () {

    const formularioUsuario =
        document.getElementById("formUsuarioAdmin");

    if (formularioUsuario) {
        precargarUsuarioParaEditar();
        formularioUsuario.addEventListener(
            "submit",
            validarUsuarioAdmin
        );
    }

});


function precargarUsuarioParaEditar() {

    const parametros = new URLSearchParams(window.location.search);
    const run = parametros.get("run");

    if (!run || typeof buscarUsuarioPorRun !== "function") {
        return;
    }

    const usuario = buscarUsuarioPorRun(run);

    if (!usuario) {
        return;
    }

    document.getElementById("run").value = usuario.run;
    document.getElementById("run").setAttribute("readonly", "readonly");
    document.getElementById("nombre").value = usuario.nombre;
    document.getElementById("apellido").value = usuario.apellido;
    document.getElementById("correo").value = usuario.correo;

    if (document.getElementById("fechaNacimiento")) {
        document.getElementById("fechaNacimiento").value = usuario.fechaNacimiento || "";
    }

    document.getElementById("tipoUsuario").value = usuario.tipoUsuario;

    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    if (regionSelect && usuario.region) {

        regionSelect.value = usuario.region;
        regionSelect.dispatchEvent(new Event("change"));

        setTimeout(function () {
            comunaSelect.value = usuario.comuna;
        }, 0);
    }

    document.getElementById("direccion").value = usuario.direccion;
}


function validarUsuarioAdmin(evento) {

    evento.preventDefault();

    const run = document.getElementById("run").value.trim().toUpperCase();
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;
    const direccion = document.getElementById("direccion").value.trim();
    const mensaje =
        document.getElementById("mensajeUsuarioAdmin");


        if (run === "") {
    mensaje.textContent = "Debes ingresar el RUN.";
    return;
}

if (run.length < 7 || run.length > 9) {
    mensaje.textContent = "El RUN debe tener entre 7 y 9 caracteres.";
    return;


}

if (!/^[0-9]{6,8}[0-9K]$/.test(run)) {
    mensaje.textContent =
        "Ingresa el RUN sin puntos ni guion. Ejemplo: 19011022K";
    return;
}

if (!validarRun(run)) {
    mensaje.textContent = "El RUN ingresado no es válido.";
    return;
}

if (nombre === "") {
    mensaje.textContent = "Debes ingresar el nombre.";
    return;
}

if (nombre.length > 50) {
    mensaje.textContent = "El nombre no puede superar los 50 caracteres.";
    return;
}

if (apellido === "") {
    mensaje.textContent = "Debes ingresar los apellidos.";
    return;
}

if (apellido.length > 100) {
    mensaje.textContent = "Los apellidos no pueden superar los 100 caracteres.";
    return;
}

if (correo === "") {
    mensaje.textContent = "Debes ingresar el correo.";
    return;
}

if (correo.length > 100) {
    mensaje.textContent = "El correo no puede superar los 100 caracteres.";
    return;
}

if (
    !correo.endsWith("@duoc.cl") &&
    !correo.endsWith("@profesor.duoc.cl") &&
    !correo.endsWith("@gmail.com")
) {
    mensaje.textContent =
        "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    return;
}

if (tipoUsuario === "") {
    mensaje.textContent = "Debes seleccionar un tipo de usuario.";
    return;
}

if (region === "") {
    mensaje.textContent = "Debes seleccionar una región.";
    return;
}

if (comuna === "") {
    mensaje.textContent = "Debes seleccionar una comuna.";
    return;
}

if (direccion === "") {
    mensaje.textContent = "Debes ingresar la dirección.";
    return;
}
if (direccion.length > 300) {
    mensaje.textContent =
        "La dirección no puede superar los 300 caracteres.";
    return;
}

const parametros = new URLSearchParams(window.location.search);
const runExistente = parametros.get("run");

const usuario = {
    run: run,
    nombre: nombre,
    apellido: apellido,
    correo: correo,
    tipoUsuario: tipoUsuario,
    region: region,
    comuna: comuna,
    direccion: direccion,
    fechaNacimiento: document.getElementById("fechaNacimiento")
        ? document.getElementById("fechaNacimiento").value
        : ""
};

if (runExistente && typeof guardarEdicionUsuario === "function") {

    guardarEdicionUsuario(runExistente, usuario);
    mensaje.textContent = "Usuario actualizado correctamente. Redirigiendo...";

} else if (typeof guardarUsuarioNuevo === "function") {

    guardarUsuarioNuevo(usuario);
    mensaje.textContent = "Usuario creado correctamente. Redirigiendo...";

} else {

    mensaje.textContent = "Usuario validado correctamente.";
    return;
}

setTimeout(function () {
    window.location.href = "usuarios-admin.html";
}, 900);

}

function validarRun(run) {

    const cuerpo = run.slice(0, -1);
    const digitoIngresado = run.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {

        suma = suma + Number(cuerpo[i]) * multiplicador;
        multiplicador++;

        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resto = 11 - (suma % 11);

    let digitoCorrecto;

    if (resto === 11) {
        digitoCorrecto = "0";
    } else if (resto === 10) {
        digitoCorrecto = "K";
    } else {
        digitoCorrecto = resto.toString();
    }

    return digitoIngresado === digitoCorrecto;
}


