var listaSpreadsheet = "https://docs.google.com/spreadsheets/d/1Fr8baDsEVbOLSDFv5CV8VK2FRZrm9dPZdAnEcHyNf_k/edit?usp=sharing";

function init() {
  Papa.parse(listaSpreadsheet, {
    download: true,
    header: true,
    complete: showInfo,
  });
}

window.addEventListener("DOMContentLoaded", init);

function showInfo(results) {
  var data = results.data;

  // data comes through as a simple array since simpleSheet is turned on
  alert("Successfully processed " + data.length + " rows!");

  $("#lista").empty();

  for (var i = 0, len = data.length; i < len; i++) {
    if (data[i]["mostra"] == "TRUE") {
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
          '" <div class="preview-prodotto" data-id="' +
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
          (disponibili_prod != "x" ? "<div><p>Prezzo:</p><span>" + prezzo_prod + "</span></div>" : "") +
          (disponibili_prod != "x" ? '<div><p>Disponibili:</p><span class="disponibili">' + disponibili_prod + "</span></div>" : "") +
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
