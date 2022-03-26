/////////////  VARIABLES

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito-contenedor");

const contadorCarrito = document.getElementById("contadorCarrito");

const precioTotal = document.getElementById("precioTotal");
const precioTotalIva = document.getElementById("precioTotalIva");

const menuLateral1 = document.getElementById("menu-lateral1");
const btnLateral = document.getElementById("boton_lateral");

////////////// LOCAL STORAGE

const guardarCarritoLS = () => {
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
};

const obtenerCarritoLS = () => {
  const carrito = localStorage.getItem("carrito");
  if (carrito === null) return [];
  return JSON.parse(carrito);
};

let carritoDeCompras = obtenerCarritoLS();

// renderizar el carrito de compras al inicio

carritoDeCompras.forEach((i) => {
  let div = document.createElement("div");

  contenedorProductos.innerHTML = "";
  div.classList.add("productoEnCarrito");
  div.innerHTML = `
                    <p><span class="cp">Zapatilla:</span> ${i.descripcion}</p>
                    <p><span class="cp">Precio: </span> ${i.precio}</p>
                    <p id=cantidad${i.id}><span class="cp">Cantidad: </span> ${i.cantidad}</p>
                    <button id=eliminar${i.id} " class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`;

  contenedorProductos.appendChild(div);
  let botonEliminar = document.getElementById(`eliminar${i.id}`);
  botonEliminar.addEventListener("click", () => {
    botonEliminar.parentElement.remove();
    carritoDeCompras = carritoDeCompras.filter((el) => el.id != i.id);
    actualizarCarrito();
  });
  contenedorCarrito.appendChild(div);
});

// actualizar contador
actualizarCarrito();

//////////BUSCADOR

export function searchPosts(input, selector) {
  document.addEventListener("keyup", (e) => {
    if (e.target.matches(input)) {
      document
        .querySelectorAll(selector)
        .forEach((element) =>
          element.textContent.toLowerCase().includes(e.target.value)
            ? element.classList.remove("filter")
            : element.classList.add("filter")
        );
    }
  });
}

//////////// CARRITO DE COMPRAS

// listaDeProductos(stockProductos);

function listaDeProductos(a) {
  contenedorProductos.innerHTML = "";

  a.forEach((producto) => {
    let div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
                            <div class="card-image">
                                <img src=${producto.img}>
                            </div>
                            <div class="card-description">
                                <p class="card-precio">${producto.tipo}   $${producto.precio}</p>
                                <p class="card-dp">${producto.descripcion}</p>
                                <button id="botonAgregar${producto.id}" class="boton-carrito">Agregar al carrito</button>
                            </div>
         `;
    contenedorProductos.appendChild(div);

    let btnAgregar = document.getElementById(`botonAgregar${producto.id}`);

    btnAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
    });
  });
}

//////// FETCH

fetch("../JSON/productos.json")
  .then((data) => data.json())
  .then((data) => {
    stockProductos = data;
    console.log(data);
    listaDeProductos(stockProductos);
  });

//////////   PRODUCTOS

let stockProductos = [];
console.log(stockProductos);

////////////////  DOM CARRITO

function agregarAlCarrito(id) {
  let repetido = carritoDeCompras.find((productoR) => productoR.id == id);
  if (repetido) {
    repetido.cantidad = repetido.cantidad + 1;
    document.getElementById(
      `cantidad${repetido.id}`
    ).innerHTML = `<p id=cantidad${repetido.id}><span class="cp">Cantidad: </span>${repetido.cantidad}</p>`;
    actualizarCarrito();
  } else {
    let productoAgregar = stockProductos.find((prod) => prod.id == id);
    console.log(productoAgregar);
    carritoDeCompras.push(productoAgregar);

    productoAgregar.cantidad = 1;
    let div = document.createElement("div");
    div.classList.add("productoEnCarrito");
    div.innerHTML = `
                    <p><span class="cp">Producto:</span> ${productoAgregar.descripcion}</p>
                    <p><span class="cp">Precio: </span> ${productoAgregar.precio}</p>
                    <p id=cantidad${productoAgregar.id}><span class="cp">Cantidad: </span> ${productoAgregar.cantidad}</p>
                    <button id=eliminar${productoAgregar.id} " class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`;

    contenedorCarrito.appendChild(div);
    actualizarCarrito();
    let botonEliminar = document.getElementById(
      `eliminar${productoAgregar.id}`
    );
    botonEliminar.addEventListener("click", () => {
      botonEliminar.parentElement.remove();
      carritoDeCompras = carritoDeCompras.filter(
        (el) => el.id != productoAgregar.id
      );
      actualizarCarrito();
    });
  }
}

function actualizarCarrito() {
  contadorCarrito.innerText = carritoDeCompras.reduce(
    (acc, el) => acc + el.cantidad,
    0
  );
  precioTotal.innerText = carritoDeCompras.reduce(
    (acc, el) => acc + el.precio * el.cantidad,
    0
  );
  precioTotalIva.innerText = carritoDeCompras.reduce(
    (acc, el) =>
      Math.round(
        acc + el.precio * el.cantidad + (acc + el.precio * el.cantidad) * 0.21
      ),
    0
  );
  guardarCarritoLS();
}

///////// MENU LATERAL

function botonLateral() {
  btnLateral.addEventListener("click", function () {
    menuLateral1.classList.toggle("active-lateral");
  });
}
botonLateral();

//////// LOGICA MENU

const ul = document.querySelector("#filtros");

let filtros = {
  genero: [],
  tipo: [],
};

let productosFiltrados = [];

ul.addEventListener("click", (e) => {
  const t = e.target;
  if (t.type === "checkbox") {
    if (t.checked) {
      if (t.value === "tipo") filtros.tipo.push(t.id);
      if (t.value === "genero") filtros.genero.push(t.id);
    } else {
      if (t.value === "tipo")
        filtros.tipo = filtros.tipo.filter((filtro) => filtro != t.id);
      if (t.value === "genero")
        filtros.genero = filtros.genero.filter((filtro) => filtro != t.id);
    }
  }

  if (filtros.genero.length === 0 && filtros.tipo.length === 0) {
    productosFiltrados = stockProductos;
  } else {
    productosFiltrados = productosFiltrados.filter(
      (producto) =>
        (filtros.tipo.length === 0 || filtros.tipo.includes(producto.tipo)) &&
        (filtros.genero.length === 0 ||
          filtros.genero.includes(producto.genero))
    );
  }

  console.log({ filtros, productosFiltrados });

  listaDeProductos(productosFiltrados);
});

/////////// SWEET ALERT

function hasClass(elem, className) {
  return elem.classList.contains(className);
}
document.addEventListener(
  "click",
  function (e) {
    if (hasClass(e.target, "boton-carrito")) {
      swal({
        title: "Hecho",
        text: "Tu producto se a añadido al carrito",
        icon: "success",
        confirm: "Ok",
        timer: 1000,
      });
    } else if (hasClass(e.target, "test")) {
    }
  },
  false
);
