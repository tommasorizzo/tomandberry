var flkty = new Flickity(".main-carousel", {
  cellAlign: "left",
  contain: true,
  imagesLoaded: true,
  pageDots: false,
  fullscreen: true,
});

// get all photos in carousel: first time to go fullscreen
carouselPhotos = document.getElementsByClassName("carousel-image");
for (let i = 0; i < carouselPhotos.length; i++) {
  const carouselPhoto = carouselPhotos[i];
  carouselPhoto.addEventListener("click", goFullscreen);
}

flkty.on("fullscreenChange", handleFullscreen);

function handleFullscreen(isFullscreen) {
  if (!isFullscreen) {
    for (let i = 0; i < carouselPhotos.length; i++) {
      const carouselPhoto = carouselPhotos[i];
      carouselPhoto.addEventListener("click", goFullscreen);
    }
    window.removeEventListener("click", backFullscreen);
  } else window.addEventListener("click", backFullscreen);
}

// exit Fullscreen if background is clicked
// if (isFullscreen)
//   window.addEventListener("click", function (e) {
//     selCell = flkty.selectedElement;
//     selPhoto = selCell.getElementsByClassName("carousel-image")[0];
//     console.log("contains?", selPhoto.contains(e.target));
//     if (!selPhoto.contains(e.target)) backFullscreen();
//   });

function goFullscreen() {
  flkty.viewFullscreen();
}

function backFullscreen(e) {
  selCell = flkty.selectedElement;
  selPhoto = selCell.getElementsByClassName("carousel-image")[0];
  Buttons = document.getElementsByClassName("flickity-button");
  clickOutsideCond = !selPhoto.contains(e.target);
  for (let i = 0; i < Buttons.length; i++) {
    const btn = Buttons[i];
    clickOutsideCond = clickOutsideCond && !btn.contains(e.target);
  }
  if (clickOutsideCond) flkty.exitFullscreen();
}
