var listaSpreadsheet =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSSl-43z0Ldx29JYwelRtThEfdbVs0GnMp6-s6imLUvIq7cQfbIlSXqyL0PU5CokSMtUFwWE1XJ87to/pub?gid=0&single=true&output=csv";

var lista, cart, cartModal;

function init() {
  lista = document.getElementById("lista");
  cart = document.getElementById("cart");
  cartModal = document.getElementById("my-cart-modal");

  Papa.parse(listaSpreadsheet, {
    download: true,
    header: true,
    complete: showInfo,
  });
}

function showInfo(results) {
  var data = results.data;

  // data comes through as a simple array since simpleSheet is turned on
  // alert("Successfully processed " + data.length + " rows!");

  lista.innerHTML = "";

  for (var i = 0, len = data.length; i < len; i++) {
    if (data[i]["mostra"] == "TRUE") {
      prodotto = data[i];

      id_prod = prodotto["id"].toString();
      foto_prod = "/" + prodotto["foto"];
      nome_prod = prodotto["nome"];
      prezzo_prod = prodotto["prezzo"];
      desc_prod = prodotto["descrizione"];
      disponibili_prod = prodotto["rimanenti"];

      to_append = `
            <div class="prod" id="${id_prod}">
              <div class="prod-grid"">
                <img class="prod-foto" src="${foto_prod}" alt="" />
                <h4 class="prod-name">${nome_prod}</h4>
                <span class="prod-price">Prezzo: ${prezzo_prod}</span>
                <p class="prod-disp">Disponibili: ${disponibili_prod}</p>
              </div>
              <div class="prod-quant">
                <p>Quantità:</p>
                <button type="button" class="quant-butt" onclick="lowerInput(this.nextElementSibling)">-</button>
                <input class="quant-input" type="number" value="1" min="0" max="${disponibili_prod}">
                <button type="button" class="quant-butt" onclick="increaseInput(this.previousElementSibling)">+</button>
              </div>
              <div class="prod-tot">
                <div>Totale: <span class="tot"></span></div>
                <button class="btn btn-primary add-cart">
                  Aggiungi
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </button>
              </div>
            </div>`;

      lista.innerHTML += to_append;
    }
  }

  initTotal();

  // Change quantity of product and update total
  var quantityInputs = document.getElementsByClassName("quant-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("input", quantityChangedOnEvent);
  }

  // add to cart
  var itemToCart = document.getElementsByClassName("add-cart");
  for (let i = 0; i < itemToCart.length; i++) {
    var input = itemToCart[i];
    input.addEventListener("click", addToCart);
  }

  // empty chart
  document.getElementById("empty-cart").addEventListener("click", emptyCart);

  // checkout
  document.getElementById("go-payment").addEventListener("click", checkout);
}

window.addEventListener("DOMContentLoaded", init);

// init product total
function initTotal() {
  var quantityInputs = document.getElementsByClassName("quant-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    var product = input.parentElement.parentElement;
    var quantity = input.value;
    var price = retrieveTotal(product, "prod-price", 1);
    var total = price * quantity;
    product.getElementsByClassName("tot")[0].innerHTML = `${total} €`;
  }
}

// change product quantity and update prod total
function quantityChangedOnEvent(event) {
  var input = event.target;
  quantityChanged(input);
}

// lower and increase product quantity
function lowerInput(input0) {
  input0.stepDown();
  quantityChanged(input0);
}

function increaseInput(input0) {
  input0.stepUp();
  quantityChanged(input0);
}

function quantityChanged(input) {
  quantity = input.value;
  var product = input.parentElement.parentElement;
  var price = retrieveTotal(product, "prod-price", 1);
  var total = price * quantity;
  product.getElementsByClassName("tot")[0].innerHTML = `${total} €`;
}

// update cart total, disponibili and quant-input

function addToCart(event) {
  var product = event.target.parentElement.parentElement;
  var to_add = retrieveTotal(product, "tot", 0);
  if (to_add == 0) {
    alert("Niente da aggiungere!");
    return;
  } else {
    updateCart(to_add, 1);
    qty = product.getElementsByClassName("quant-input")[0].value;
    updateDisp(product, qty, 0);
    addItemToCart(product, qty);
    if (new_disp <= 0) {
      disableClassBtn(product, "add-cart"); // disable add to cart button
    }
  }
}

// add row in cart displaying item
function addItemToCart(product, quantity) {
  var name = product.getElementsByClassName("prod-name")[0].innerHTML;
  var prod_id = product.id;
  var price = retrieveTotal(product, "prod-price", 1);
  var foto = product.getElementsByClassName("prod-foto")[0].src;
  var cartRow = document.createElement("div");
  cartRow.classList.add("my-cart-row");
  var cartItems = document.getElementsByClassName("my-cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("my-cart-item");
  for (var i = 0; i < cartItemNames.length; i++) {
    cartItem = cartItemNames[i];
    cartItemName = cartItem.getElementsByClassName("my-cart-item-name")[0].innerHTML;
    if (cartItemName == name) {
      old_qty = retrieveTotal(cartItem, "my-cart-item-quantity", 0);
      cartItem.getElementsByClassName("my-cart-item-quantity")[0].innerHTML = old_qty + 1;
      return;
    }
  }
  var cartRowContents = `
                <div id="cart-${prod_id}" class="row my-cart-item">
                  <img class="col-sm-3 my-cart-item-image" src="${foto}" />
                  <span class="col-sm-5 my-cart-item-name pt-1">${name}</span>
                  <div class="col justify-content-center pt-1">
                    <span class="my-cart-item-quantity">${quantity}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <span class="my-cart-price">${price} €</span>
                  </div>
                </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
}

// update disp
function updateDisp(product, quantity, direction) {
  old_disp = retrieveTotal(product, "prod-disp", 1);
  new_disp = direction ? old_disp + quantity : old_disp - quantity;
  product.getElementsByClassName("prod-disp")[0].innerHTML = `Disponibili: ${new_disp}`; // update disponibili
  product.getElementsByClassName("quant-input")[0].max = new_disp; // update quant-input max
}

// update cart
function updateCart(value, direction) {
  var old_cart = retrieveTotal(cart, "cart-tot", 0);
  if (old_cart == 0) {
    enableIdBtn("empty-cart"); // enable empty-cart button
  }
  new_cart = direction ? old_cart + value : old_cart - value;
  cart.getElementsByClassName("cart-tot")[0].innerHTML = `${new_cart} €`;
  cartModal.getElementsByClassName("cart-tot")[0].innerHTML = `${new_cart} €`;
}

// empty cart
function emptyCart() {
  updateCart(retrieveTotal(cart, "cart-tot", 0), 0); // put cart total to 0
  disableIdBtn("empty-cart"); // disable empty cart button
  document.getElementById("my-cart-modal").style.display = "none";
  var cartItems = document.getElementsByClassName("my-cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("my-cart-item");
  for (var i = cartItemNames.length - 1; i >= 0; i--) {
    // parse all cart items and restore disponibili
    cartItem = cartItemNames[i];
    item_quantity = retrieveTotal(cartItem, "my-cart-item-quantity", 0);
    prod_id = cartItem.id.split("-")[1];
    product = document.getElementById(prod_id);
    updateDisp(product, item_quantity, 1);
    enableClassBtn(product, "add-cart");
    cartItem.parentNode.remove();
  }
}
// checkout
function checkout(event) {
  alert("Checkout!");
  return;
}

// enable and disable buttons

function disableClassBtn(product, classname) {
  product.getElementsByClassName(classname)[0].disabled = true;
}
function enableClassBtn(product, classname) {
  product.getElementsByClassName(classname)[0].disabled = false;
}
function disableIdBtn(id) {
  document.getElementById(id).disabled = true;
}
function enableIdBtn(id) {
  document.getElementById(id).disabled = false;
}

// return price value as a number
function retrieveTotal(target, classname, pos) {
  total = target.getElementsByClassName(classname)[0].innerHTML;
  var total = parseFloat(total.split(" ")[pos]);
  if (isNaN(total)) {
    return 0;
  } else {
    return total;
  }
}
