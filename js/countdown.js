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

  if (days == 1)
    var dd = '<p>giorno</p>';
  else
    var dd = '<p>giorni</p>';
  if (hours == 1)
    var hh = '<p>ora</p>';
  else
    var hh = "<p>ore</p>";
  if (minutes == 1)
    var mm = '<p>minuto</p>';
  else
    var mm = '<p>minuti</p>';
  if (seconds == 1)
    var ss = '<p>secondo</p>';
  else
    var ss = '<p>secondi</p>';
  // Output the result
  document.getElementById("countdown-days").innerHTML = days + dd;
  document.getElementById("countdown-hours").innerHTML = hours + hh;
  document.getElementById("countdown-minutes").innerHTML = minutes + mm;
  document.getElementById("countdown-seconds").innerHTML = seconds + ss;

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown-days").innerHTML = 0;
    document.getElementById("countdown-hours").innerHTML = 0;
    document.getElementById("countdown-minutes").innerHTML = 0;
    document.getElementById("countdown-seconds").innerHTML = 0;
    document.getElementsByClassName("cd-item").style.visibility = 'hidden';
  }
}, 1000);
