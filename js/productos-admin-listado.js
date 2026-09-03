/* ============================================================
   productos-admin-listado.js
   Pinta la tabla de productos del panel administrador usando
   el catálogo real (productosCatalogo + lo agregado/editado por
   el administrador en localStorage). Ver js/productos.js.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    pintarTablaProductos();
});

function pintarTablaProductos() {

    const cuerpo = document.getElementById("cuerpoProductos");

    if (!cuerpo) {
        return;
    }

    const productos = obtenerProductosAdmin();

    cuerpo.innerHTML = "";

    productos.forEach(function (producto) {

        const esCritico =
            producto.stockCritico !== null &&
            producto.stockCritico !== undefined &&
            producto.stock <= producto.stockCritico;

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + producto.codigo + "</td>" +

            "<td>" +
            "<a href='../pages/detalle.html?id=" + producto.id + "'>" +
            producto.nombre +
            "</a>" +
            "</td>" +

            "<td>" + (producto.categoria || "-") + "</td>" +

            "<td>$" + Number(producto.precio).toLocaleString() + "</td>" +

            "<td>" +
            "<span class='" + (esCritico ? "chip chip-critico" : "chip") + "'>" +
            producto.stock +
            (esCritico ? " ⚠ crítico" : "") +
            "</span>" +
            "</td>" +

            "<td class='solo-admin'>" +
            "<a href='editar-producto.html?id=" + producto.id + "'>Editar</a>" +
            " &nbsp; " +
            "<button type='button' onclick='eliminarProductoDesdeTabla(" + producto.id + ")'>Eliminar</button>" +
            "</td>";

        cuerpo.appendChild(fila);
    });
}

function eliminarProductoDesdeTabla(id) {

    const confirmado = confirm("¿Eliminar este producto del catálogo?");

    if (!confirmado) {
        return;
    }

    eliminarProductoAdmin(id);
    pintarTablaProductos();
}
