//////// FETCH

fetch("../JSON/productos.json")
  .then((data) => data.json())
  .then((data) => {
    stockProductos = data;
    console.log(data);
  });

//////////   PRODUCTOS

let stockProductos = [];

//////////

const carritoAbrir = document.getElementById("boton-carrito");
const carritoCerrar = document.getElementById("carritoCerrar");

const contenedorModal = document.getElementsByClassName("modal-contenedor")[0];
const modalCarrito = document.getElementsByClassName("modal-carrito")[0];

carritoAbrir.addEventListener("click", () => {
  contenedorModal.classList.toggle("modal-active");
});
carritoCerrar.addEventListener("click", () => {
  contenedorModal.classList.toggle("modal-active");
});
modalCarrito.addEventListener("click", (e) => {
  e.stopPropagation();
});
contenedorModal.addEventListener("click", () => {
  carritoCerrar.click();
});
