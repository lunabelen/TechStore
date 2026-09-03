let productos = JSON.parse(localStorage.getItem("productos")) || [];


function agregarCarrito(nombre, precio, imagen){

    let productoExistente = productos.find(function(producto){

    return producto.nombre == nombre;

});


if(productoExistente){

    productoExistente.cantidad++;

}else{

    productos.push({

        nombre: nombre,
        precio: precio,
        imagen: imagen,
        cantidad: 1

    });

}


    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );


    actualizarContador();

    mostrarAvisoCarrito(nombre + " agregado al carrito");
}


function mostrarAvisoCarrito(texto) {

    let aviso = document.getElementById("avisoCarrito");

    if (!aviso) {

        aviso = document.createElement("div");
        aviso.id = "avisoCarrito";
        document.body.appendChild(aviso);
    }

    aviso.textContent = texto;
    aviso.classList.add("visible");

    clearTimeout(mostrarAvisoCarrito.temporizador);

    mostrarAvisoCarrito.temporizador = setTimeout(function () {
        aviso.classList.remove("visible");
    }, 2200);
}


function actualizarContador(){

    let contador = document.getElementById("contadorCarrito");

    if(contador){

        let cantidadTotal = 0;

        productos.forEach(function(producto){
        cantidadTotal += producto.cantidad;
    });

      contador.innerHTML = cantidadTotal;
    }

}



function mostrarCarrito(){

    let lista = document.getElementById("listaProductos");
    let total = document.getElementById("totalCarrito");


    if(lista && total){

        lista.innerHTML = "";

        let suma = 0;


        productos.forEach(function(producto, index){


            let item = document.createElement("li");
            let rutaImagen = producto.imagen;

    if (rutaImagen.startsWith("img/")) {
    rutaImagen = "../" + rutaImagen;
}

            item.innerHTML = 
            "<img src='" + rutaImagen + "'>" +

            "<div class='infoProducto'>" +
            "<strong>" + producto.nombre + "</strong>" +
            "<p>Precio: $" + producto.precio.toLocaleString() + "</p>" +
           "<div class='controlesCantidad'>" +
           "<button type='button' onclick='disminuirCantidad(" + index + ")'>-</button>" +
           "<span> " + producto.cantidad + " </span>" +
           "<button type='button' onclick='aumentarCantidad(" + index + ")'>+</button>" +
           "</div>" +
            "<p>Subtotal: $" + (producto.precio * producto.cantidad).toLocaleString() + "</p>" +
            "</div>" +

            "<button onclick='eliminarProducto(" + index + ")'>Eliminar</button>";
            lista.appendChild(item);


            suma += producto.precio * producto.cantidad;


        });

        total.innerHTML =
        "Total: $" + suma.toLocaleString();
    }

}

function vaciarCarrito(){

    localStorage.removeItem("productos");

    productos = [];

    mostrarCarrito();

    actualizarContador();

}


function finalizarCompra() {

    if (productos.length === 0) {
        mostrarAvisoCarrito("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    const total = productos.reduce(function (suma, producto) {
        return suma + (producto.precio * producto.cantidad);
    }, 0);

    const pedido = {
        folio: "TS-" + Date.now().toString().slice(-8),
        fecha: new Date().toLocaleString("es-CL"),
        correoCliente: localStorage.getItem("correoSesion") || null,
        productos: productos,
        total: total
    };

    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("ultimoPedido", JSON.stringify(pedido));

    localStorage.removeItem("productos");
    productos = [];

    window.location.href = "compra-exitosa.html";
}



function eliminarProducto(index){

    productos.splice(index,1);

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    mostrarCarrito();

    actualizarContador();

}



function aumentarCantidad(index) {

    productos[index].cantidad++;

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    mostrarCarrito();
    actualizarContador();
}


function disminuirCantidad(index) {

    if (productos[index].cantidad > 1) {

        productos[index].cantidad--;

    }

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    mostrarCarrito();
    actualizarContador();
}



mostrarCarrito();
actualizarContador();