var listaSpreadsheet =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSSl-43z0Ldx29JYwelRtThEfdbVs0GnMp6-s6imLUvIq7cQfbIlSXqyL0PU5CokSMtUFwWE1XJ87to/pub?gid=0&single=true&output=csv";

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
  // alert("Successfully processed " + data.length + " rows!");

  var lista = document.getElementById("lista");

  lista.innerHTML = "";

  for (var i = 0, len = data.length; i < len; i++) {
    if (data[i]["mostra"] == "TRUE") {
      prodotto = data[i];
      //console.log(prodotto);

      id_prod = prodotto["id"].toString();
      foto_prod = "/" + prodotto["foto"];
      nome_prod = prodotto["nome"];
      prezzo_prod = prodotto["prezzo"];
      desc_prod = prodotto["descrizione"];
      disponibili_prod = prodotto["rimanenti"];

      to_append =
        '<div class="prod" data-id="' +
        id_prod +
        '"> <div class="prod-grid" data-id="' +
        id_prod +
        '"> <img src="' +
        foto_prod +
        '" alt=""/> <h4>' +
        nome_prod +
        "</h4> <span> Prezzo: " +
        prezzo_prod +
        "</span> <p> Disponibili: " +
        disponibili_prod +
        "</p>";
      // alert(to_append);

      lista.innerHTML += to_append;
    }
  }
}
