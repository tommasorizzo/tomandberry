/********************** COUTNDOWN **********************/

// Set the date we're counting down to
var countDownDate = new Date("Jul 4, 2021 16:30:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (days == 1) var dd = "<p>giorno</p>";
  else var dd = "<p>giorni</p>";
  if (hours == 1) var hh = "<p>ora</p>";
  else var hh = "<p>ore</p>";
  if (minutes == 1) var mm = "<p>minuto</p>";
  else var mm = "<p>minuti</p>";
  if (seconds == 1) var ss = "<p>secondo</p>";
  else var ss = "<p>secondi</p>";
  // Output the result
  document.getElementById("countdown-days").innerHTML = days + dd;
  document.getElementById("countdown-hours").innerHTML = hours + hh;
  document.getElementById("countdown-minutes").innerHTML = minutes + mm;
  // document.getElementById("countdown-seconds").innerHTML = seconds + ss;

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown-days").innerHTML = 0;
    document.getElementById("countdown-hours").innerHTML = 0;
    document.getElementById("countdown-minutes").innerHTML = 0;
    // document.getElementById("countdown-seconds").innerHTML = 0;
    // document.getElementsByClassName("cd-item").style.visibility = 'hidden';
  }
}, 1000);

/********************** RSVP **********************/
(function () {
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

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    return { data: formData };
  }

  function handleFormSubmit(event) {
    // handles form submit without any jquery
    event.preventDefault(); // we are submitting via xhr below
    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;

    disableAllButtons(form);
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
        var thankYouMessage = form.querySelector(".thankyou_message");
        if (thankYouMessage) {
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

  function loaded() {
    // bind to the submit event of our form
    var forms = document.querySelectorAll("#rsvp-form");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }

  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
})();
