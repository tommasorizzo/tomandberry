var listaSpreadsheet =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSSl-43z0Ldx29JYwelRtThEfdbVs0GnMp6-s6imLUvIq7cQfbIlSXqyL0PU5CokSMtUFwWE1XJ87to/pub?gid=0&single=true&output=csv";

function init() {
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
  var lista = document.getElementById("lista");

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
              <div class="prod-grid" id="${id_prod}">
                <img src="${foto_prod}" alt="" />
                <h4>${nome_prod}</h4>
                <span class="prod-price">Prezzo: ${prezzo_prod}</span>
                <p>Disponibili: ${disponibili_prod}</p>
              </div>
              <div class="prod-quant">
                Quantità:
                <input class="quant-input" id="${id_prod}" type="number" value="1" min="0" max="${disponibili_prod}">
              </div>
              <div class="prod-tot">
                <div>Totale: <span class="tot"></span></div>
                <button class="btn btn-primary add-cart" id="${id_prod}">
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
    input.addEventListener("change", quantityChanged);
  }

  // add to cart
}

window.addEventListener("DOMContentLoaded", init);

// init product total
function initTotal() {
  var quantityInputs = document.getElementsByClassName("quant-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    var product = document.getElementById(input.id);
    var quantity = input.value;
    var price_text = product.getElementsByClassName("prod-price")[0].innerHTML;
    var price = price_text.split(" ")[1];
    var total = price * quantity;
    product.getElementsByClassName("tot")[0].innerHTML = `${total} €`;
  }
}

// change product quantity and update total
function quantityChanged(event) {
  var input = event.target;
  quantity = input.value;
  var product = document.getElementById(input.id);
  var price_text = product.getElementsByClassName("prod-price")[0].innerHTML;
  var price = price_text.split(" ")[1];
  var total = price * quantity;
  product.getElementsByClassName("tot")[0].innerHTML = `${total} €`;
}
