const productosCatalogo = [

    {
        id: 1,
        codigo: "PRO001",
        nombre: "Mouse Gamer RGB",
        descripcion: "Mouse profesional con iluminación RGB.",
        precio: 20000,
        stock: 18,
        stockCritico: 5,
        categoria: "accesorios",
        imagen: "../img/mouse.jpg"
    },

    {
        id: 2,
        codigo: "PRO002",
        nombre: "Teclado Mecánico",
        descripcion: "Teclado mecánico con iluminación RGB.",
        precio: 45000,
        stock: 12,
        stockCritico: 4,
        categoria: "computacion",
        imagen: "../img/teclado.jpg"
    },

    {
        id: 3,
        codigo: "PRO003",
        nombre: "Audífonos Bluetooth",
        descripcion: "Audífonos inalámbricos de alta calidad.",
        precio: 35000,
        stock: 25,
        stockCritico: 6,
        categoria: "audio",
        imagen: "../img/audifonos.jpg"
    },

    {
        id: 4,
        codigo: "PRO004",
        nombre: "Monitor Gamer 27 pulgadas",
        descripcion: "Monitor gamer Full HD de 27 pulgadas con 165Hz.",
        precio: 129990,
        stock: 8,
        stockCritico: 3,
        categoria: "computacion",
        imagen: "../img/monitor.jpeg"
    },

    {
        id: 5,
        codigo: "PRO005",
        nombre: "Webcam Full HD",
        descripcion: "Webcam Full HD ideal para videollamadas, clases y reuniones online.",
        precio: 29990,
        stock: 14,
        stockCritico: 4,
        categoria: "computacion",
        imagen: "../img/webcam.jpeg"
    },

    {
        id: 6,
        codigo: "PRO006",
        nombre: "Smartwatch Deportivo",
        descripcion: "Reloj inteligente deportivo ideal para actividad física y uso diario.",
        precio: 59990,
        stock: 10,
        stockCritico: 3,
        categoria: "accesorios",
        imagen: "../img/smartwatch.jpeg"
    },

    {
        id: 7,
        codigo: "PRO007",
        nombre: "Mouse Pad RGB",
        descripcion: "Mouse pad gamer con iluminación RGB, ideal para escritorio y juegos.",
        precio: 19990,
        stock: 30,
        stockCritico: 8,
        categoria: "accesorios",
        imagen: "../img/mousepad.jpeg"
    },

    {
        id: 8,
        codigo: "PRO008",
        nombre: "Parlante Bluetooth",
        descripcion: "Parlante Bluetooth portátil con sonido potente, ideal para música y entretenimiento.",
        precio: 39990,
        stock: 16,
        stockCritico: 5,
        categoria: "audio",
        imagen: "../img/parlante.jpeg"
    }

];


/* ============================================================
   Persistencia del panel administrador usando localStorage.
   Mientras no exista backend, las altas y ediciones hechas por
   el Administrador se guardan en el navegador y se combinan con
   el catálogo base (productosCatalogo) para formar el listado
   real que se muestra tanto en la tienda como en el panel admin.

   Claves usadas en localStorage:
   - productosNuevos:     arreglo de productos creados por el admin
   - productosEdiciones:  objeto { id: camposModificados }
   - productosEliminados: arreglo de ids ocultos del catálogo
   ============================================================ */

function obtenerProductosAdmin() {

    const nuevos = JSON.parse(localStorage.getItem("productosNuevos") || "[]");
    const ediciones = JSON.parse(localStorage.getItem("productosEdiciones") || "{}");
    const eliminados = JSON.parse(localStorage.getItem("productosEliminados") || "[]");

    function aplicarEdicion(producto) {
        if (ediciones[producto.id]) {
            return Object.assign({}, producto, ediciones[producto.id]);
        }
        return producto;
    }

    const base = productosCatalogo
        .filter(function (producto) { return eliminados.indexOf(producto.id) === -1; })
        .map(aplicarEdicion);

    const extra = nuevos
        .filter(function (producto) { return eliminados.indexOf(producto.id) === -1; })
        .map(aplicarEdicion);

    return base.concat(extra);
}

function guardarProductoNuevo(producto) {

    const nuevos = JSON.parse(localStorage.getItem("productosNuevos") || "[]");
    const todos = productosCatalogo.concat(nuevos);

    const maxId = todos.reduce(function (max, item) {
        return item.id > max ? item.id : max;
    }, 0);

    producto.id = maxId + 1;
    producto.imagen = producto.imagen || "../img/logo.png";

    nuevos.push(producto);
    localStorage.setItem("productosNuevos", JSON.stringify(nuevos));

    return producto.id;
}

function guardarEdicionProducto(id, cambios) {

    const ediciones = JSON.parse(localStorage.getItem("productosEdiciones") || "{}");
    ediciones[id] = Object.assign({}, ediciones[id] || {}, cambios);
    localStorage.setItem("productosEdiciones", JSON.stringify(ediciones));
}

function eliminarProductoAdmin(id) {

    const eliminados = JSON.parse(localStorage.getItem("productosEliminados") || "[]");

    if (eliminados.indexOf(id) === -1) {
        eliminados.push(id);
    }

    localStorage.setItem("productosEliminados", JSON.stringify(eliminados));
}

function buscarProductoPorId(id) {

    return obtenerProductosAdmin().find(function (producto) {
        return producto.id === id;
    });
}


function mostrarProductos() {

    const contenedor = document.getElementById("catalogoProductos");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    obtenerProductosAdmin().forEach(function (producto) {

        const articulo = document.createElement("article");

        articulo.innerHTML =
            "<img src='" + producto.imagen + "' alt='" + producto.nombre + "'>" +

            "<h3>" +
            "<a href='detalle.html?id=" + producto.id + "'>" +
            producto.nombre +
            "</a>" +
            "</h3>" +

            "<p>" +
            producto.descripcion +
            "</p>" +

            "<p>Precio: $" +
            producto.precio.toLocaleString() +
            "</p>" +

            "<button type='button' onclick=\"agregarCarrito('" +
            producto.nombre + "', " +
            producto.precio + ", '" +
            producto.imagen +
            "')\">" +
            "Agregar al carrito" +
            "</button>";

        contenedor.appendChild(articulo);

    });

}


function mostrarDetalle() {

    const contenedorDetalle =
        document.getElementById("detalleProducto");

    if (!contenedorDetalle) {
        return;
    }

    const parametros =
        new URLSearchParams(window.location.search);

    const idProducto =
        Number(parametros.get("id"));

    const producto = buscarProductoPorId(idProducto);


    if (!producto) {

        contenedorDetalle.innerHTML =
            "<h2>Producto no encontrado</h2>" +
            "<p>Vuelve al catálogo de productos.</p>";

        return;

    }


    contenedorDetalle.innerHTML =

        "<h2>" +
        producto.nombre +
        "</h2>" +

        "<img src='" +
        producto.imagen +
        "' alt='" +
        producto.nombre +
        "'>" +

        "<h3>Descripción del producto</h3>" +

        "<p>" +
        producto.descripcion +
        "</p>" +

        "<h3>Precio: $" +
        producto.precio.toLocaleString() +
        "</h3>" +

        "<button type='button' onclick=\"agregarCarrito('" +
        producto.nombre + "', " +
        producto.precio + ", '" +
        producto.imagen +
        "')\">" +
        "Agregar al carrito" +
        "</button>";

}


mostrarProductos();
mostrarDetalle();