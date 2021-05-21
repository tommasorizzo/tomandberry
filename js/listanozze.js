var listaSpreadsheet =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSSl-43z0Ldx29JYwelRtThEfdbVs0GnMp6-s6imLUvIq7cQfbIlSXqyL0PU5CokSMtUFwWE1XJ87to/pub?gid=0&single=true&output=csv";

var lista, cart, cartModal, footer;

window.addEventListener("DOMContentLoaded", init);

// init function
function init() {
  lista = document.getElementById("lista");
  cart = document.getElementById("cart");
  cartModal = document.getElementById("my-cart-modal");
  footer = document.getElementById("foot");

  enableIdBtn("show-lista");

  document.getElementById("show-lista").addEventListener("click", function (event) {
    console.log("showing lista...");
    event.target.style.display = "none";
    Papa.parse(listaSpreadsheet, {
      download: true,
      header: true,
      complete: showInfo,
    });
    document.getElementById("cart-row-and-modal").style.display = "block";
  });
}

// called by init
function showInfo(results) {
  var data = results.data;

  lista.innerHTML = "";

  // create lista based on elements in spreadsheet
  for (var i = 0, len = data.length; i < len; i++) {
    if (data[i]["mostra"] == "TRUE") {
      prodotto = data[i];

      id_prod = prodotto["id"].toString();
      foto_prod = "/foto-lista-nozze/" + prodotto["foto"] + ".jpg";
      nome_prod = prodotto["nome"];
      prezzo_prod = prodotto["prezzo"];
      desc_prod = prodotto["descrizione"];
      disponibili_prod = prodotto["rimanenti"];

      to_append = `
            <div class="prod" id="${id_prod}" data-aos="zoom-in">
              <div class="prod-grid"">
                <div class="foto-and-desc">
                  <div class="prod-sold">
                    <img class="sold-regalo" src="/img/regalo.png" alt="" />
                    <div>Regalo già fatto!</div>
                  </div>
                  <div class="prod-desc">${desc_prod}</div>
                  <img class="prod-foto" src="${foto_prod}" alt="" />
                </div>
                <h4 class="prod-name">${nome_prod}</h4>
                <span class="prod-price">Valore: ${prezzo_prod}</span>
                <p class="prod-disp">Disponibili: ${disponibili_prod}</p>
              </div>
              <div class="prod-buy">
                <div style="display:none">Totale: <span class="tot" ></span></div>
                <button class="btn btn-orange add-cart">
                  <span class="svg-butt">Regala </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gift" viewBox="0 0 16 16">
                    <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"/>
                  </svg>
                </button>
              </div>
            </div>`;

      lista.innerHTML += to_append;
    }
  }

  // check unavailable products
  var products = document.getElementsByClassName("prod");
  for (let i = 0; i < products.length; i++) {
    product = products[i];
    var disp = retrieveTotal(product, "prod-disp", 1);
    // disable 'add-cart' button if unavailable
    if (disp == 0) {
      disableClassBtn(product, "add-cart");
      product.getElementsByClassName("prod-price")[0].style.visibility = "hidden";
    }
    // else remove 'sold' element
    else product.getElementsByClassName("prod-sold")[0].style.display = "none";
  }

  // EVENT LISTENERS

  // add to cart
  var itemToCart = document.getElementsByClassName("add-cart");
  for (let i = 0; i < itemToCart.length; i++) {
    var input = itemToCart[i];
    input.addEventListener("click", addToCart);
  }

  // empty chart
  document.getElementById("empty-cart").addEventListener("click", emptyCart);

  // checkout
  var forms = document.querySelectorAll("#checkout-form");
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener("submit", handleFormSubmit, false);
  }

  // payment method
  var radios = document.forms["checkout-form"].elements["metodo"];
  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener("click", setPaymentMethod, false);
  }
}

/***************** SHOW LISTA ******************/

function showLista() {
  lista.style.display = "block";
}

/***************** PRODUCT AND CHART HANDLER ******************/

// add to cart and update cart total and disponibili
function addToCart(event) {
  var product = event.target.parentNode.parentNode;
  var to_add = retrieveTotal(product, "prod-price", 1);
  addItemToCart(product, 1);
  updateDisp(product, 1, 0);
  updateCart();
}

// add row in cart displaying item
function addItemToCart(product, quantity) {
  // reitrieve product data
  var name = product.getElementsByClassName("prod-name")[0].innerHTML;
  var prod_id = product.id;
  var price = retrieveTotal(product, "prod-price", 1);
  var disp = retrieveTotal(product, "prod-disp", 1);
  var foto = product.getElementsByClassName("prod-foto")[0].src;
  // create div element
  var cartRow = document.createElement("div");
  var cartItems = document.getElementsByClassName("my-cart-items")[0];
  var old_cart = retrieveTotal(cart, "cart-tot", 0);
  if (old_cart != 0) {
    // cart not empty
    // check if element already present in cart
    var cartItemNames = cartItems.getElementsByClassName("my-cart-item");
    for (var i = 0; i < cartItemNames.length; i++) {
      cartItem = cartItemNames[i];
      cartItemName = cartItem.getElementsByClassName("my-cart-item-name")[0].innerHTML;
      if (cartItemName == name) {
        // if element already present in cart => update quantity
        old_qty = cartItem.getElementsByClassName("quant-input")[0].value;
        old_qty = parseFloat(old_qty);
        cartItem.getElementsByClassName("quant-input")[0].value = old_qty + 1;
        updateTotal(cartItem, old_qty + 1);
        return;
      }
    }
  }
  // create row element and assign 'my-cart-item' class
  cartRow.classList.add("my-cart-item");
  cartRow.classList.add("row");
  cartRow.setAttribute("id", "cart-" + prod_id);
  var cartRowContents = `
                  <div class="col-sm-7 my-cart-item-descr">
                      <img class="col-sm-3 my-cart-item-image" src="${foto}" />
                      <span class="col-sm-4 my-cart-item-name pt-1 ms-2">${name}</span>
                  </div>
                  <div class="col-sm-5 pt-1 my-cart-item-quant">
                      <svg xmlns="http://www.w3.org/2000/svg" onclick="lowerInput(this.nextElementSibling)" class="quant-butt bi bi-dash-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                      </svg>
                      <input readonly class="quant-input" type="number" value="1" min="0" max="${disp}">
                      <svg xmlns="http://www.w3.org/2000/svg" onclick="increaseInput(this.previousElementSibling)" class="quant-butt bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                      <span class="my-cart-item-price">${price} €</span>
                  </div>
                  <div class="my-cart-item-total" hidden>${price}</div>
                `;

  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
}

// update disp
function updateDisp(product, quantity, direction) {
  old_disp = retrieveTotal(product, "prod-disp", 1);
  if (old_disp == 0 && !direction) return; // attemp to go negative: return
  new_disp = direction ? old_disp + quantity : old_disp - quantity;
  product.getElementsByClassName("prod-disp")[0].innerHTML = `Disponibili: ${new_disp}`; // update disponibili
  if (new_disp > 0) enableClassBtn(product, "add-cart");
  else disableClassBtn(product, "add-cart"); // disable add to cart button if no more disp
  return;
}

// update product total and update cart
function updateTotal(cartItem, quantity) {
  price = retrieveTotal(cartItem, "my-cart-item-price", 0);
  total = quantity * price;
  cartItem.getElementsByClassName("my-cart-item-total")[0].innerHTML = `${total}`;
  updateCart();
}

// update cart
function updateCart() {
  var old_cart = retrieveTotal(cart, "cart-tot", 0);
  if (old_cart == 0) {
    enableIdBtn("empty-cart"); // enable empty-cart button
  }
  var new_cart = 0;
  cartItems = document.getElementsByClassName("my-cart-item");
  for (let i = 0; i < cartItems.length; i++) {
    // sum all totals of items in cart
    const cartItem = cartItems[i];
    itemTotal = retrieveTotal(cartItem, "my-cart-item-total", 0);
    new_cart += itemTotal;
  }
  cart.getElementsByClassName("cart-tot")[0].innerHTML = `${new_cart} €`;
  cartModal.getElementsByClassName("cart-tot")[0].innerHTML = `${new_cart} €`;
  if (new_cart == 0) {
    disableIdBtn("empty-cart"); // disable empty-cart button
  }
}

// lower and increase product quantity
function lowerInput(input0) {
  input0.stepDown();
  quantityChanged(input0, 0);
}

function increaseInput(input0) {
  input0.stepUp();
  quantityChanged(input0, 1);
}

function quantityChanged(input, direction) {
  quantity = input.value;
  var cartItem = input.parentNode.parentNode;
  updateTotal(cartItem, quantity);
  prod_id = cartItem.id.split("-")[1];
  product = document.getElementById(prod_id);
  updateDisp(product, 1, !direction);
  if (input.value == 0) cartItem.remove();
}

// empty cart
function emptyCart() {
  disableIdBtn("empty-cart"); // disable empty cart button
  document.getElementById("my-cart-modal").style.display = "none";
  var cartItems = document.getElementsByClassName("my-cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("my-cart-item");
  for (var i = cartItemNames.length - 1; i >= 0; i--) {
    // parse all cart items and restore disponibili
    cartItem = cartItemNames[i];
    item_quantity = cartItem.getElementsByClassName("quant-input")[0].value;
    prod_id = cartItem.id.split("-")[1];
    product = document.getElementById(prod_id);
    updateDisp(product, parseFloat(item_quantity), 1);
    enableClassBtn(product, "add-cart");
    cartItem.remove();
  }
  updateCart(); // all items removed -> updateCart() returns 0
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

/********************** CHECKOUT **********************/

// retrieve cart items to pass to form
function retrieveCartItems() {
  var cartItems = document.getElementsByClassName("my-cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("my-cart-item");
  var cartItemList = {};
  for (var i = cartItemNames.length - 1; i >= 0; i--) {
    cartItem = cartItemNames[i];
    quantity = cartItem.getElementsByClassName("quant-input")[0].value;
    id = cartItem.id.split("-")[1];
    cartItemList[id] = quantity;
  }
  return cartItemList;
}

// get all data in form and return object
function getFormData(form) {
  var elements = form.elements;
  var fields = Object.keys(elements)
    .map(function (k) {
      if (elements[k].name !== undefined) {
        return elements[k].name;
        // special case for Edge's html collection
      } else if (elements[k].length > 0) {
        return elements[k].item(0).name;
      }
    })
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos && item;
    });
  var formData = {};
  fields.forEach(function (name) {
    var element = elements[name];
    // singular form elements just have one value
    formData[name] = element.value;
    // when our element has multiple items, get their values
    if (element.length) {
      var data = [];
      for (var i = 0; i < element.length; i++) {
        var item = element.item(i);
        if (item.checked || item.selected) {
          data.push(item.value);
        }
      }
      formData[name] = data.join(", ");
    }
  });
  // retrieve cart items
  formData = Object.assign(formData, retrieveCartItems());
  console.log(formData);
  return { data: formData };
}

function handleFormSubmit(event) {
  // handles form submit without any jquery
  event.preventDefault(); // we are submitting via xhr below
  var form = event.target;
  var formData = getFormData(form);
  var data = formData.data;

  disableAllButtons("confirm-btn");
  emptyCartAfterPurch();
  var url = form.action;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      form.reset();
      var formElements = form.querySelector(".form-elements");
      if (formElements) {
        formElements.style.display = "none"; // hide form
      }
      var thankYouMessage = document.querySelector(".thankyou_message_cart");
      if (thankYouMessage) {
        confetti.start(6000, 20, 100);
        thankYouMessage.style.display = "block";
      }
    }
  };
  // url encode form data for sending as post data
  var encoded = Object.keys(data)
    .map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    })
    .join("&");
  xhr.send(encoded);
}

// check radio buttons to set payment method
function setPaymentMethod(event) {
  if (event.target.id == "radio-paypal") {
    methods = document.getElementsByClassName("method-confirm");
    for (let i = 0; i < methods.length; i++) methods[i].innerHTML = "Paypal";
    document.getElementsByClassName("scelta-paypal")[0].style.display = "block";
    document.getElementsByClassName("scelta-bonifico")[0].style.display = "none";
  } else if (event.target.id == "radio-bonifico") {
    methods = document.getElementsByClassName("method-confirm");
    for (let i = 0; i < methods.length; i++) methods[i].innerHTML = "Bonifico";
    document.getElementsByClassName("scelta-paypal")[0].style.display = "none";
    document.getElementsByClassName("scelta-bonifico")[0].style.display = "block";
  }
}

// double confirmation form functions
function confirmfinish() {
  document.getElementsByClassName("confirm-body")[0].style.display = "block";
  document.getElementsByClassName("confirm-btn")[0].style.display = "block";
  document.getElementsByClassName("checkout-btn")[0].style.display = "none";
}

function confirm_no() {
  document.getElementsByClassName("confirm-body")[0].style.display = "none";
  document.getElementsByClassName("confirm-btn")[0].style.display = "none";
  document.getElementsByClassName("checkout-btn")[0].style.display = "block";
}

// empty cart after purchase (do not restore disponibilii)
function emptyCartAfterPurch() {
  disableIdBtn("empty-cart"); // disable empty cart button
  var cartItems = document.getElementsByClassName("my-cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("my-cart-item");
  for (var i = cartItemNames.length - 1; i >= 0; i--) {
    cartItem = cartItemNames[i];
    cartItem.remove();
  }
  updateCart(); // all items removed -> updateCart() returns 0
}

/****************** AUXILIARY FUNCTIONS ********************/

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

function disableAllButtons(classname) {
  var content = document.getElementsByClassName(classname)[0];
  var buttons = content.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

// place cart in fixed position until footer
function checkOffset() {
  function getRectTop(el) {
    var rect = el.getBoundingClientRect();
    return rect.top;
  }
  if (getRectTop(cart) + document.body.scrollTop + cart.offsetHeight >= getRectTop(footer) + document.body.scrollTop - 10)
    cart.style.position = "absolute";
  if (document.body.scrollTop + window.innerHeight < getRectTop(footer) + document.body.scrollTop) cart.style.position = "fixed"; // restore when you scroll up
}

document.addEventListener("scroll", function () {
  checkOffset();
});
