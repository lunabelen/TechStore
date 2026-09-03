document.addEventListener("DOMContentLoaded", function () {

    const formularioRegistro = document.getElementById("formRegistro");
    const formularioLogin = document.getElementById("formLogin");
    const formularioContacto = document.getElementById("formContacto");


    if (formularioRegistro) {

        formularioRegistro.addEventListener("submit", validarRegistro);

    }


    if (formularioLogin) {

        formularioLogin.addEventListener("submit", validarLogin);

    }

    const passwordLogin = document.getElementById("password");
    const mensajePassword = document.getElementById("mensajePassword");

if (passwordLogin && mensajePassword) {

    passwordLogin.addEventListener("input", function () {

        const cantidad = passwordLogin.value.length;

        if (cantidad === 0) {
            mensajePassword.textContent = "";
        } else if (cantidad < 4) {
            mensajePassword.textContent = "La contraseña es demasiado corta.";
        } else if (cantidad > 10) {
            mensajePassword.textContent = "La contraseña supera los 10 caracteres.";
        } else {
            mensajePassword.textContent = "La contraseña cumple con el largo permitido.";
        }

    });

}

    

    if (formularioContacto) {

        formularioContacto.addEventListener("submit", validarContacto);

    }


});


function validarRegistro(evento) {

    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const run = document.getElementById("run").value.trim().toUpperCase();
    const direccion = document.getElementById("direccion").value.trim();
    const comuna = document.getElementById("comuna").value.trim();
    const region = document.getElementById("region").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmarPassword").value;
    const mensaje = document.getElementById("mensajeValidacion");

    if (nombre === "") {

        mensaje.textContent = "Debes ingresar tu nombre.";
        return;

    }

    if (nombre.length > 50) {
    mensaje.textContent = "El nombre no puede superar los 50 caracteres.";
    return;
}

    if (apellido === "") {
    mensaje.textContent = "Debes ingresar tus apellidos.";
    return;
}

if (apellido.length > 100) {
    mensaje.textContent = "Los apellidos no pueden superar los 100 caracteres.";
    return;
}

if (run === "") {
    mensaje.textContent = "Debes ingresar tu RUN.";
    return;
}

if (run.length < 7 || run.length > 9) {
    mensaje.textContent = "El RUN debe tener entre 7 y 9 caracteres.";
    return;
}
if (!/^[0-9]{6,8}[0-9K]$/.test(run)) {
    mensaje.textContent = "Ingresa el RUN sin puntos ni guion. Ejemplo: 19011022K";
    return;
}

if (!validarRun(run)) {
    mensaje.textContent = "El RUN ingresado no es válido.";
    return;
}


    if (direccion === "") {
    mensaje.textContent = "Debes ingresar tu dirección.";
    return;
}

if (direccion.length > 300) {
    mensaje.textContent = "La dirección no puede superar los 300 caracteres.";
    return;
}

    if (comuna === "") {
    mensaje.textContent = "Debes ingresar tu comuna.";
    return;
}

    if (region === "") {
    mensaje.textContent = "Debes ingresar tu región.";
    return;
}


    if (correo === "" || !correo.includes("@") || !correo.includes(".")) {

        mensaje.textContent =
            "Ingresa un correo válido. Ejemplo: usuario@correo.cl";
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




    if (password.length < 6) {

        mensaje.textContent =
            "La contraseña debe tener al menos 6 caracteres.";
        return;

    }


    if (password !== confirmar) {

        mensaje.textContent =
            "Las contraseñas no coinciden. Inténtalo nuevamente.";
        return;

    }


    if (typeof guardarUsuarioNuevo === "function") {

        guardarUsuarioNuevo({
            run: run,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            password: password,
            tipoUsuario: "cliente",
            region: region,
            comuna: comuna,
            direccion: direccion,
            fechaNacimiento: document.getElementById("fechaNacimiento")
                ? document.getElementById("fechaNacimiento").value
                : ""
        });

        mensaje.textContent =
            "¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1200);

    } else {

        mensaje.textContent =
            "Registro validado correctamente.";
    }

}

function validarLogin(evento) {

    evento.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensajeLogin");


    if (correo === "" || !correo.includes("@") || !correo.includes(".")) {

        mensaje.textContent =
            "Ingresa un correo válido. Ejemplo: usuario@correo.cl";
        return;

    }

    if (correo.length > 100) {
    mensaje.textContent =
        "El correo no puede superar los 100 caracteres.";
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


    if (password === "") {

        mensaje.textContent =
            "Debes ingresar tu contraseña.";
        return;

    }

    if (password.length < 4 || password.length > 10) {
    mensaje.textContent =
        "La contraseña debe tener entre 4 y 10 caracteres.";
    return;
}


    const usuarios = [
    {
        correo: "admin@duoc.cl",
        password: "1234",
        tipo: "Administrador"
    },
    {
        correo: "vendedor@duoc.cl",
        password: "1234",
        tipo: "Vendedor"
    },
    {
        correo: "cliente@gmail.com",
        password: "1234",
        tipo: "Cliente"
    }
];

let usuarioEncontrado = usuarios.find(function (usuario) {
    return usuario.correo === correo &&
           usuario.password === password;
});

// Si no es una de las 3 cuentas demo, se busca entre los
// clientes que se registraron desde pages/registro.html.
if (!usuarioEncontrado && typeof buscarUsuarioPorCorreo === "function") {

    const registrado = buscarUsuarioPorCorreo(correo);

    if (registrado && registrado.password === password) {
        usuarioEncontrado = {
            correo: registrado.correo,
            tipo: "Cliente"
        };
    }
}

if (!usuarioEncontrado) {
    mensaje.textContent =
        "Correo o contraseña incorrectos.";
    return;
}

localStorage.setItem(
    "tipoUsuario",
    usuarioEncontrado.tipo
);

localStorage.setItem(
    "correoSesion",
    correo
);

if (usuarioEncontrado.tipo === "Administrador") {
    window.location.href = "../admin/index.html";

} else if (usuarioEncontrado.tipo === "Vendedor") {
    window.location.href = "../admin/productos-admin.html";

} else {
    window.location.href = "../index.html";
}

}

function validarContacto(evento) {

    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensajeTexto = document.getElementById("mensaje").value.trim();
    const mensaje = document.getElementById("mensajeContacto");


    if (nombre === "") {

        mensaje.textContent =
            "Debes ingresar tu nombre.";
        return;

    }

    if (nombre.length > 100) {
    mensaje.textContent =
        "El nombre no puede superar los 100 caracteres.";
    return;
}


    if (correo !== "") {

    if (!correo.includes("@") || !correo.includes(".")) {
        mensaje.textContent =
            "Ingresa un correo válido.";
        return;
    }

    if (correo.length > 100) {
        mensaje.textContent =
            "El correo no puede superar los 100 caracteres.";
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
}




    if (mensajeTexto === "") {

        mensaje.textContent =
            "Debes escribir un mensaje.";
        return;

    }

    if (mensajeTexto.length > 500) {
    mensaje.textContent =
        "El mensaje no puede superar los 500 caracteres.";
    return;
}


    mensaje.textContent =
        "Mensaje validado correctamente.";

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
