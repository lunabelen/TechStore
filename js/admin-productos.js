document.addEventListener("DOMContentLoaded", function () {

    const formularioProducto = document.getElementById("formProducto");

    if (formularioProducto) {
        precargarProductoParaEditar();
        formularioProducto.addEventListener("submit", validarProducto);
    }

});


function precargarProductoParaEditar() {

    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));

    if (!id || typeof buscarProductoPorId !== "function") {
        return;
    }

    const producto = buscarProductoPorId(id);

    if (!producto) {
        return;
    }

    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("codigo").setAttribute("readonly", "readonly");
    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion || "";
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("stockCritico").value =
        producto.stockCritico !== null && producto.stockCritico !== undefined
            ? producto.stockCritico
            : "";
    document.getElementById("categoria").value = producto.categoria || "";
}


function validarProducto(evento) {

    evento.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("stock").value;
    const stockCritico = document.getElementById("stockCritico").value;
    const categoria = document.getElementById("categoria").value;
    const mensaje = document.getElementById("mensajeProducto");

    if (codigo === "") {
    mensaje.textContent = "Debes ingresar el código del producto.";
    return;
}

if (codigo.length < 3) {
    mensaje.textContent = "El código debe tener al menos 3 caracteres.";
    return;
}

if (nombre === "") {
    mensaje.textContent = "Debes ingresar el nombre del producto.";
    return;
}

if (nombre.length > 100) {
    mensaje.textContent = "El nombre no puede superar los 100 caracteres.";
    return;
}

if (descripcion.length > 500) {
    mensaje.textContent =
        "La descripción no puede superar los 500 caracteres.";
    return;
}

if (precio === "") {
    mensaje.textContent = "Debes ingresar el precio del producto.";
    return;
}

if (Number(precio) < 0) {
    mensaje.textContent = "El precio no puede ser menor que 0.";
    return;
}

if (stock === "") {
    mensaje.textContent = "Debes ingresar el stock del producto.";
    return;
}

if (Number(stock) < 0) {
    mensaje.textContent = "El stock no puede ser menor que 0.";
    return;
}

if (!Number.isInteger(Number(stock))) {
    mensaje.textContent = "El stock debe ser un número entero.";
    return;
}

if (stockCritico !== "") {

    if (Number(stockCritico) < 0) {
        mensaje.textContent = "El stock crítico no puede ser menor que 0.";
        return;
    }

    if (!Number.isInteger(Number(stockCritico))) {
        mensaje.textContent = "El stock crítico debe ser un número entero.";
        return;
    }
}


if (categoria === "") {
    mensaje.textContent = "Debes seleccionar una categoría.";
    return;
}

if (
    stockCritico !== "" &&
    Number(stock) <= Number(stockCritico)
) {
    alert("Alerta: el producto tiene stock crítico.");
}

const parametros = new URLSearchParams(window.location.search);
const idExistente = Number(parametros.get("id"));

const producto = {
    codigo: codigo,
    nombre: nombre,
    descripcion: descripcion,
    precio: Number(precio),
    stock: Number(stock),
    stockCritico: stockCritico === "" ? null : Number(stockCritico),
    categoria: categoria
};

if (idExistente && typeof guardarEdicionProducto === "function") {

    guardarEdicionProducto(idExistente, producto);
    mensaje.textContent = "Producto actualizado correctamente. Redirigiendo...";

} else if (typeof guardarProductoNuevo === "function") {

    guardarProductoNuevo(producto);
    mensaje.textContent = "Producto creado correctamente. Redirigiendo...";

} else {

    mensaje.textContent = "Producto validado correctamente.";
    return;
}

setTimeout(function () {
    window.location.href = "productos-admin.html";
}, 900);

}