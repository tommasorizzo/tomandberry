// check tabletop addin

var publicSpreadsheetUrl =
  "https://docs.google.com/spreadsheets/d/1SK6suT4QqC8VGKfD6pP0mdFFXLRCKyJp9E-ReMBd74c/";

function init() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: showInfo,
    simpleSheet: true,
    proxy: "https://matrimonio.ferrato.io/cache",
    prettyColumnNames: false,
    //orderby: 'prezzo',
    debug: false,
  });
}

function showInfo(data, tabletop) {
  //alert('Successfully processed!')
  //console.log(data);

  //console.log(tabletop);

  $("#lista").empty();

  //data.forEach(function(prodotto, i) {
  for (var i = 0, len = data.length; i < len; i++) {
    if (data[i]["visibile"] == "TRUE") {
      prodotto = data[i];
      //console.log(prodotto);

      id_prod = prodotto["id"].toString();
      foto_prod = prodotto["foto"];
      nome_prod = prodotto["nome"];
      prezzo_prod = prodotto["prezzo"];
      desc_prod = prodotto["descrizione"];
      disponibili_prod = prodotto["rimanenti"];

      $("#lista").append(
        '\
        <div class="prodotto" data-id="' +
          id_prod +
          '" data-aos="zoom-in-up"> \
            <div class="preview-prodotto" data-id="' +
          id_prod +
          '" data-disp="' +
          disponibili_prod +
          '"> \
            <img src="' +
          foto_prod +
          '" alt="" /> \
                <h3>' +
          nome_prod +
          "</h3> \
                <span>" +
          (disponibili_prod != "x" ? prezzo_prod : "Importo libero") +
          '</span> \
            </div> \
            <div class="info-prodotto popup" data-id="' +
          id_prod +
          '" data-disp="' +
          disponibili_prod +
          '" data-prezzo="' +
          prezzo_prod +
          '" data-foto="' +
          foto_prod +
          '" data-nome="' +
          nome_prod +
          '"> \
            <div class="overlay"></div> \
            <div class="interno-popup"> \
                <div class="chiudi_popup">×</div> \
                <div class="info-prodotto-cont"> \
                <img src="' +
          foto_prod +
          '" alt="" /> \
                <div class="info"> \
                    <h2>' +
          nome_prod +
          "</h2> \
                    <p>" +
          desc_prod +
          '</p> \
                    <div class="prezzo">' +
          (disponibili_prod != "x"
            ? "<div><p>Prezzo:</p><span>" + prezzo_prod + "</span></div>"
            : "") +
          (disponibili_prod != "x"
            ? '<div><p>Disponibili:</p><span class="disponibili">' +
              disponibili_prod +
              "</span></div>"
            : "") +
          (disponibili_prod != "x"
            ? '<div class="linea-quant"><p>Quantità:</p><button type="button" class="diminuisci" data-id="' +
              id_prod +
              '" onclick="diminuisciInput(this.nextElementSibling)">-</button><input id="quant-' +
              id_prod +
              '" class="quant" onkeydown="return false" type="number" value="1" min="1" max="' +
              disponibili_prod +
              '" step="1" data-id="' +
              id_prod +
              '"><button type="button" class="aumenta" data-id="' +
              id_prod +
              '" onclick="aumentaInput(this.previousElementSibling)">+</button></div>'
            : '<div><p>Importo:</p><button type="button" class="diminuisci" data-id="' +
              id_prod +
              '" onclick="diminuisciInput(this.nextElementSibling)">-</button><input id="quant-' +
              id_prod +
              '" class="quant" data-id="' +
              id_prod +
              '" type="number" value="100" min="50" step="50"><button type="button" class="aumenta" data-id="' +
              id_prod +
              '" onclick="aumentaInput(this.previousElementSibling)">+</button></div>') +
          '</div> \
                    <button style="display:none" type="button" class="cart-add" data-id="' +
          id_prod +
          '" data-label="' +
          nome_prod +
          '" data-price="' +
          prezzo_prod +
          '" data-image="' +
          foto_prod +
          '">Aggiungi al carrello</button> \
                    <div class="pulsanti"> \
                    <div class="totale"><p>Totale:</p><span class="tot"></span></div> \
                        <button class="aggiungi_cart color" data-id="' +
          id_prod +
          '" type="button">Aggiungi al carrello \
                            <svg viewBox="0 0 24 24"><path d="M10 0v4H8l4 4 4-4h-2V0M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96a2 2 0 0 0 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2M7 18a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m10 0a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2z"/></svg> \
                        </button> \
                        </div> \
                </div> \
                </div> \
            </div> \
            </div> \
        </div>'
      );
    }

    //           $('#lista').append('<div class="info-prodotto" data-info-prodotto="'+i+'"><img src="'+prodotto['Foto']+'" alt="" /><div class="info"><h2>'+prodotto['Nome']+'</h2><p>'+prodotto['Descrizione']+'</p><div class="prezzo"><p>Prezzo:</p><span>'+prodotto['Prezzo prezzo']+'</span><p>Disponibili:</p><span>'+prodotto['Rimanenti']+'</span><p>Quantità:</p><input class="quant" type="number" data-prezzo="'+prodotto['Prezzo prezzo']+'" value="1" min="1" max="'+prodotto['Rimanenti']+'"><p>Totale:</p><input type="number" class="tot" readonly></div></div></div>');
  }

  $("#lista .preview-prodotto").on("click", function () {
    id_prod = $(this).data("id");

    console.log(id_prod);

    /*
    $('.info-prodotto').removeClass('visibile');

    $('.info-prodotto[data-id="'+id_prod+'"]').toggleClass('visibile');

    //$('[data-info-prodotto="'+id_prod+'"]').toggleClass('aperto');

    $('.overlay').toggleClass('aperto');
    */

    apriModal('.info-prodotto[data-id="' + id_prod + '"]');

    disponibiliCart(id_prod);

    calcolaTotale(id_prod);

    attrAddtoCart(id_prod); // imposta i parametri giusti al pulsante aggiungi carrello

    $('.info-prodotto[data-disp="0"] .aggiungi_cart').attr("disabled", true);
    $('.info-prodotto[data-disp="0"] .totale .tot').text("Esaurito");
    $('.info-prodotto[data-disp="0"] .totale p').hide();
    $('.info-prodotto[data-disp="0"] .prezzo .linea-quant').hide();
  });

  $(".overlay").on("click", function () {
    chiudiModal();
  });

  // se ci sono elementi nel carrello mostra il punsante per aprirlo
  if (Cart.itemsCount() > 0) {
    $("#mostra_carrello").addClass("visibile");
    $("#svuotaCart").show();
  }
}

window.addEventListener("DOMContentLoaded", init);

$(document).on(
  "change input paste keyup mouseup click",
  'input[type="number"].quant, .diminuisci, .aumenta',
  function () {
    id_prod = $(this).data("id");

    calcolaTotale(id_prod);

    attrAddtoCart(id_prod);
  }
);

function aumentaInput(input0) {
  if (!detectIE()) {
    input0.stepUp();
  } else {
    var step = Number(input0.step);
    console.log(step);
    input0.value = Number(input0.value) + step;
  }
}

function diminuisciInput(input0) {
  if (!detectIE()) {
    input0.stepDown();
  } else {
    var step = Number(input0.step);
    console.log(step);
    input0.value = Number(input0.value) - step;
  }
}

function calcolaTotale(id_prod) {
  prezzo = $('.info-prodotto[data-id="' + id_prod + '"]')
    .data("prezzo")
    .split(" ")[0];

  disponibili = parseInt(
    $('.info-prodotto[data-id="' + id_prod + '"]').data("disp")
  );

  quant = parseFloat(
    $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').val()
  );

  total =
    $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').val() *
    parseFloat(prezzo.replace(",", "."));
  total = total.toFixed(2);

  console.log("ID: " + id_prod);
  console.log("Quantità: " + quant);
  console.log("Disponibili: " + disponibili);
  console.log("Totale: " + total);

  if (quant <= 0) {
    $('.info-prodotto[data-id="' + id_prod + '"] .totale .tot').text("Errore");
  } else if (quant > disponibili) {
    $('.info-prodotto[data-id="' + id_prod + '"] .totale .tot').text("Errore");
  } else {
    $('.info-prodotto[data-id="' + id_prod + '"] .totale .tot').text(
      total.toLocaleString("it") + " €"
    );
  }
}

function attrAddtoCart(id_prod) {
  // aggiunge gli attributi al pulsante aggiungi al carrello
  quant = $('.info-prodotto[data-id="' + id_prod + '"] .quant').val();
  $('.info-prodotto[data-id="' + id_prod + '"] .cart-add').attr(
    "data-quantity",
    quant
  );
  prezzo = $('.info-prodotto[data-id="' + id_prod + '"]')
    .data("prezzo")
    .split(" ")[0];
  prezzo = prezzo.replace(",", ""); // rimuove la virgola, il carello lo vuole così
  $('.info-prodotto[data-id="' + id_prod + '"] .cart-add').attr(
    "data-price",
    prezzo
  );
}

$(document).on("click", ".aggiungi_cart", function () {
  id_prod = $(this).data("id");
  quant = $('.info-prodotto[data-id="' + id_prod + '"] .quant').val();
  prezzo = $('.info-prodotto[data-id="' + id_prod + '"]')
    .data("prezzo")
    .split(" ")[0];
  prezzo = prezzo.replace(",", ""); // rimuove la virgola, il carello lo vuole così
  foto_prod = $('.info-prodotto[data-id="' + id_prod + '"]').data("foto");
  nome_prod = $('.info-prodotto[data-id="' + id_prod + '"]').data("nome");

  disp = $('.info-prodotto[data-id="' + id_prod + '"]').data("disp");

  console.log("addtoCartJS - quant: " + quant);
  console.log("addtoCartJS - prezzo: " + prezzo);
  console.log("addtoCartJS - foto_prod: " + foto_prod);
  console.log("addtoCartJS - nome_prod: " + nome_prod);

  Cart.addItem({
    id: id_prod,
    price: prezzo,
    quantity: parseFloat(quant),
    max: disp,
    label: nome_prod,
    image: foto_prod,
  });

  pulsantiCarrello();
  chiudiModal();
});

function disponibiliCart(id_prod) {
  // aggirona i disponibili in base a quanti pezzi dello stesso articolo già nel carrello

  i_prod_cart = Cart.indexOfItem(id_prod); // indice del prodotto nel carrello

  disponibili = $('.info-prodotto[data-id="' + id_prod + '"]').data("disp");

  if (i_prod_cart >= 0 && i_prod_cart != null) {
    // se il prodotto è nel carrello imposta i disponibili correttamente

    nelCarrello = Cart.items[i_prod_cart].quantity;

    disponibili_agg = disponibili - nelCarrello;

    $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').attr(
      "max",
      disponibili_agg
    );

    if (nelCarrello >= disponibili) {
      $('.info-prodotto[data-id="' + id_prod + '"] .aggiungi_cart').attr(
        "disabled",
        true
      );
    } else {
      $('.info-prodotto[data-id="' + id_prod + '"] .aggiungi_cart').attr(
        "disabled",
        false
      );
    }

    $('.info-prodotto[data-id="' + id_prod + '"] .disponibili').text(
      disponibili_agg + " (" + nelCarrello + " già nel carrello)"
    );

    min = $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').attr(
      "min"
    );
    $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').val(min);
  } else {
    $('.info-prodotto[data-id="' + id_prod + '"] .aggiungi_cart').attr(
      "disabled",
      false
    );
    $('.info-prodotto[data-id="' + id_prod + '"] .disponibili').text(
      disponibili
    );
    $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').attr(
      "max",
      disponibili
    );

    min = $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').attr(
      "min"
    );
    $('.info-prodotto[data-id="' + id_prod + '"] .prezzo .quant').val(min);
  }
}

function pulsantiCarrello() {
  $(".cart-add.aumenta").each(function () {
    var id = $(this).data("id");
    var max = $(this).data("max");
    var inCart = $(this).data("incart");

    if (inCart >= max) {
      $(this).attr("disabled", true);
    } else {
      $(this).attr("disabled", false);
    }
  });
}

/*
$(document).on('click', '.cart-add', function(e) {
    e.preventDefault();
    pulsantiCarrello();
});
*/

function svuotaCarrello() {
  Cart.empty();
  $(".carrello.popup .pulsanti").hide();
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key == "Escape" || evt.key == "Esc";
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    chiudiModal();
  }
};

//$(document).on('click', '#mostra_carrello', function(){
$("#mostra_carrello").on("click", function () {
  apriModal(".carrello");
});

var offsetY, offsetX;

function apriModal(div) {
  offsetY = window.pageYOffset;
  $("body").css({ top: "-" + offsetY + "px" });

  $(".overlay").addClass("aperto");
  $(div).addClass("visibile");

  $("body").addClass("popup-aperto");

  /*
    bodyScrollLock.disableBodyScroll(targetElement, {
        allowTouchMove: el => (el.querySelectorAll(".interno-popup"))
    });
*/
}

$(document).on("click", ".chiudi_popup", function () {
  chiudiModal();
});

function chiudiModal() {
  $("body").removeClass("popup-aperto");
  $("body").css({ top: "auto" });

  //offsetY = $('body').offset().top;
  window.scroll(0, offsetY);

  $(".overlay").removeClass("aperto");
  $(".overlay").removeClass("bianco");

  $(".bg_heart").remove();

  $(".popup").removeClass("visibile");
  //         $('.info-prodotto').removeClass('aperto');
}

$(function () {
  Cart.initJQuery((Cart.currency = "€"));

  pulsantiCarrello();

  Cart.on("added", function (argumentsObject) {
    //chiudiModal();

    if (Cart.itemsCount() > 0) {
      $("#mostra_carrello").addClass("visibile");
      $(".carrello.popup .pulsanti").show();
    } else {
      $("#mostra_carrello").removeClass("visibile");
      $(".carrello.popup .pulsanti").hide();
    }

    pulsantiCarrello();
  });

  Cart.on("removed", function (argumentsObject) {
    //chiudiModal();

    if (Cart.itemsCount() > 0) {
      $("#mostra_carrello").addClass("visibile");
      $(".carrello.popup .pulsanti").show();
    } else {
      $("#mostra_carrello").removeClass("visibile");
      $(".carrello.popup .pulsanti").hide();
    }

    pulsantiCarrello();
  });

  Cart.on("emptied", function (argumentsObject) {
    $("#mostra_carrello").removeClass("visibile");
  });
});

function avantiModal(div) {
  chiudiModal();
  apriModal(div);
}

// evita che alla pressione del pulsante venga inviato il form e ricaricata la pagina
$("#infoPersonali-form").submit(function (e) {
  e.preventDefault();
});

$("#infoPersonali-form-avanti").on("click", function () {
  // controlla che il form sia valido e nel caso procede al popup successivo
  if ($("#infoPersonali-form")[0].checkValidity()) {
    $("#infoPersonali-form input:not([name=met-pag])").each(function () {
      var id = $(this).attr("id");
      var value = $(this).val();
      localStorage.setItem(id, value);
    });
    $("#infoPersonali-form textarea").each(function () {
      var id = $(this).attr("id");
      var value = $(this).val();
      localStorage.setItem(id, value);
    });

    var value_pag = $("input[name=met-pag]:checked").attr("id");
    localStorage.setItem("info-pag", value_pag);

    avantiModal(".pagamento." + value_pag);

    var totCart = Cart.subTotal() / 100;
    var totFee = (totCart + 0.25) / (1 - 0.014);

    $("#bonifico-importo").text(roundToTwo(totCart));

    $("#paypalme").attr(
      "href",
      "https://www.paypal.me/andref/" + roundToTwo(totCart)
    );

    $("#stripe-total").text(roundToTwo(totCart));
    $("#stripe-fee").text(roundToTwo(totFee - totCart));
    $("#stripe-total-fee").text(roundToTwo(totFee));
  }
});

$(window).on("load", function () {
  $("#infoPersonali-form input:not([name=met-pag])").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);
    $(this).val(value);
  });
  $("#infoPersonali-form textarea").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);
    $(this).val(value);
  });
  var id = localStorage.getItem("info-pag");
  $("input[name=met-pag][id=" + id + "]").attr("checked", true);
});

function pagato() {
  console.log("Click su PAGATO");

  var nome = localStorage.getItem("info-nome");
  var email = localStorage.getItem("info-email");
  var messaggio = localStorage.getItem("info-messaggio");
  var pagamento = localStorage.getItem("info-pag");

  var carrello = localStorage.getItem("cart-items");
  var totale = Cart.subTotal();

  $.ajax({
    type: "POST",
    url: "backend.php",
    data: {
      nome: nome,
      email: email,
      messaggio: messaggio,
      pagamento: pagamento,
      carrello: carrello,
      totale: totale,
    },
    success: function (data) {
      console.log("Success: " + data);
      if (data == "OK") {
        Cart.empty();
        //setTimeout(function() { chiudiModal(); }, 2000);
        chiudiModal();
        localStorage.clear();
        apriModal(".grazie");

        cuori();

        setTimeout(function () {
          chiudiModal();
        }, 10000);

        // al termine del pagamento nasconde le notices sullo sul pagamento carta e mostra i pulsanti per nuovo pagamento
        $('#payment-form div[id^="single"]').hide();
        $("#payment-form .pulsanti").show();
      } else if (data == "ERRORE") {
        errorFunction();
      }
      /*
        else {
        Cart.empty();
        //setTimeout(function() { chiudiModal(); }, 2000);
        chiudiModal();
        localStorage.clear();
        }
*/
    },
    error: function (jqXHR, textStatus, errorThrown) {
      errorFunction();
    },
  });
}

function errorFunction() {
  alert(
    "Si è verificato un errore, se hai pagato con carta il tuo pagamento è stato comunque registrato, se hai pagato con bonifico ricarica la pagina e riprova. Grazie!"
  );
}

new ClipboardJS(".copia");

const targetElement = document.querySelector(".popup");

//PAYPAL
/*
// Render the PayPal button
paypal.Button.render({
// Set your environment
env: 'production', // sandbox | production

// Specify the style of the button
style: {
// layout: 'vertical',  // horizontal | vertical
    size:   'responsive',    // medium | large | responsive
    shape:  'rect',      // pill | rect
    color:  'white',       // gold | blue | silver | white | black
    label: 'paypal',
    tagline: false
},

// Specify allowed and disallowed funding sources
//
// Options:
// - paypal.FUNDING.CARD
// - paypal.FUNDING.CREDIT
// - paypal.FUNDING.ELV
funding: {
    allowed: [
    paypal.FUNDING.CARD,
    paypal.FUNDING.CREDIT
    ],
    disallowed: []
},

locale: 'it_IT',

// Enable Pay Now checkout flow (optional)
commit: true,

// PayPal Client s - replace with your own
// Create a PayPal app: https://developer.paypal.com/developer/applications/create
client: {
    sandbox: 'AdwvvpjLaxku8Aio8NNcVf-KB77VXCG4Bxj_fIKVtXjIghMD0V-gz53VxUaL4a_qPPUqgNOxIV0YaHa1',
    production: 'Afm6mfyjMNoAFPRby8EP1xHos9aPeXLldfJg62p0mKqr6FFKNBXBJnwHH5RbHTCjrZbu29Z68z_Ta2nR'
},

payment: function (data, actions) {
    return actions.payment.create({
    payment: {
        transactions: [
        {
            amount: {
            total: Cart.subTotal()/100,
            currency: 'EUR'
            }
        }
        ]
    },
    experience: {
        input_fields: {
        no_shipping: 1
        }
    }
    });
},

onAuthorize: function (data, actions) {
    return actions.payment.execute()
    .then(function () {
        window.alert('Payment Complete!');

        if (res.error === 'INSTRUMENT_DECLINED') {
        window.alert('Non è stato possibile procedere al pagamento, cambia metodo');
        //return actions.restart();
        }
    });
},
onCancel: function (data, actions) {
    window.alert('Pagamento annullato!');
},
onError: function (err) {
    window.alert('Si è verificato un errore! '+err);
}
}, '#paypal-button-container');
*/

$("#infoPersonali-form-avanti").on("click", function () {
  // Create a Stripe client.
  //var stripe = Stripe('pk_test_FJy9hAjOKElWr2KBvlppNpib');
  var stripe = Stripe("pk_live_i1NFZMN3bQJeBcVIYxlzMhZt");

  // Create an instance of Elements.
  var elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  var style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: "16px",
      color: "#32325d",
    },
  };

  // Create an instance of the card Element.
  var card = elements.create("card", { style: style });
  var error_div = "card-errors";
  var form_id = "payment-form";
  // Add an instance of the card Element into the `card-element` <div>.
  card.mount("#card-element");

  card.addEventListener("change", function (event) {
    var displayError = document.getElementById("card-errors");
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = "";
    }
  });

  var form = document.getElementById(form_id);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    stripe.createToken(card).then(function (result) {
      if (result.error) {
        // Inform the user if there was an error.
        var errorElement = document.getElementById(error_div);
        errorElement.textContent = result.error.message;
      } else {
        var name = localStorage.getItem("info-nome");
        var email = localStorage.getItem("info-email");
        var messaggio = localStorage.getItem("info-messaggio");
        var carrello = localStorage.getItem("cart-items");
        var totale = Cart.subTotal();

        var totCart = Cart.subTotal() / 100;
        var totFee = ((totCart + 0.25) / (1 - 0.014)) * 100;

        // Send the token to your server.
        charge_single(result.token, name, email, messaggio, Math.round(totFee));
      }
    });
  });

  function charge_single(token, name, email, messaggio, amount) {
    console.log(token, name, email, messaggio, amount);
    $('#payment-form div[id^="single"]').hide();
    $("#single_working").show();

    return new Promise((resolve) => {
      try {
        $.ajax({
          type: "post",
          url: "charge.php",
          data: {
            stripeToken: token.id,
            stripeEmail: email,
            customerName: name,
            messaggio: messaggio,
            amount: amount,
            carrello: localStorage.getItem("cart-items"),
          },
          success: function (data) {
            console.log(data);
            json = JSON.parse(data);

            if (json.success === true) {
              $("#single_working").hide();
              $("#single_success").show();

              $("#payment-form .pulsanti").hide();

              setTimeout(function () {
                pagato();
              }, 1000);

              resolve(true);
            } else {
              $("#single_working").hide();
              $("#single_fail").show();
              $("#single_fail span").text(json.message);
              resolve(false);
            }
          },
          error: function (data) {
            console.log(data);
            $("#single_working").hide();
            $("#single_fail").show();
            alert(
              "Si è verificato un errore, riprova. " +
                data.statusText +
                " " +
                data.status
            );
          },
        });
      } catch (err) {
        $("#single_working").fadeToggle(function (e) {
          $("#single_fail").show();
        });
        resolve(false);
      }
    });
  }

  var totCart = Cart.subTotal() / 100;
  var totFee = ((totCart + 0.25) / (1 - 0.014)) * 100;

  var paymentRequest = stripe.paymentRequest({
    country: "IT",
    currency: "eur",
    total: {
      label: "Lista Nozze - Andrea e Elisabetta",
      amount: Math.round(totFee),
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  var elements = stripe.elements();
  var prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: {
      paymentRequestButton: {
        type: "default",
        theme: "light-outline",
        height: "38px",
      },
    },
  });

  $("#payment-request-button").show();

  // Check the availability of the Payment Request API first.
  paymentRequest.canMakePayment().then(function (result) {
    console.log(result);
    if (result) {
      $("#oppure").show();
      prButton.mount("#payment-request-button");
    } else {
      $("#oppure, #payment-request-button").hide();
    }
  });
  paymentRequest.on("click", function (ev) {
    $("#single_working").fadeToggle(function (e) {
      $("#single_success").fadeToggle();
    });
    console.log("hai cliccato");
  });
  paymentRequest.on("token", async function (ev) {
    //response = await charge_single(ev.token, ev.payerName, ev.payerEmail, Math.round(totFee))
    response = await charge_single(
      ev.token,
      localStorage.getItem("info-nome"),
      localStorage.getItem("info-email"),
      localStorage.getItem("info-messaggio"),
      Math.round(totFee)
    );

    if (response === true) {
      ev.complete("success");
    } else {
      ev.complete("fail");
    }
  });
});
function roundToTwo(num) {
  return String(+(Math.round(num + "e+2") + "e-2")).replace(".", ",");
}

function cuori() {
  $(".overlay").addClass("bianco");
  $("body").append('<div class="bg_heart" onclick="chiudiModal();"></div>');

  var love = setInterval(function () {
    var r_num = Math.floor(Math.random() * 40) + 1;
    var r_size = Math.floor(Math.random() * 65) + 10;
    var r_left = Math.floor(Math.random() * 100) + 1;
    var r_bg = Math.floor(Math.random() * 25) + 10;
    var r_time = Math.floor(Math.random() * 5) + 0;

    $(".bg_heart").append(
      "<div class='heart' style='width:" +
        r_size +
        "px;height:" +
        r_size +
        "px;left:" +
        r_left +
        "%;background:rgba(255," +
        (r_bg - 50) +
        "," +
        r_bg +
        ",1);-webkit-animation:love " +
        r_time +
        "s ease;-moz-animation:love " +
        r_time +
        "s ease;-ms-animation:love " +
        r_time +
        "s ease;animation:love " +
        r_time +
        "s ease'></div>"
    );

    $(".bg_heart").append(
      "<div class='heart' style='width:" +
        (r_size - 10) +
        "px;height:" +
        (r_size - 10) +
        "px;left:" +
        (r_left + r_num) +
        "%;background:rgba(190," +
        (r_bg - 25) +
        "," +
        (r_bg + 15) +
        ",1);-webkit-animation:love " +
        (r_time + 5) +
        "s ease;-moz-animation:love " +
        (r_time + 5) +
        "s ease;-ms-animation:love " +
        (r_time + 5) +
        "s ease;animation:love " +
        (r_time + 5) +
        "s ease'></div>"
    );

    $(".heart").each(function () {
      var top = $(this)
        .css("top")
        .replace(/[^-\d\.]/g, "");
      var width = $(this)
        .css("width")
        .replace(/[^-\d\.]/g, "");
      if (top <= -100 || width >= 150) {
        $(this).detach();
      }
    });
  }, 100);
}
