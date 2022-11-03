"use strict";

const audio = new Audio();

const btnPause = document.querySelector(".player__controller-pause"),
  btnStop = document.querySelector(".player__controller-stop"),
  trackCards = document.getElementsByClassName("track"),
  player = document.querySelector(".player");

const playMusic = ({ currentTarget }) => {
  audio.src = currentTarget.dataset.track;
  audio.play();
  btnPause.classList.remove("player__icon_play");
  player.classList.add("player_active");
  for (let i = 0; i < trackCards.length; i++) {
    trackCards[i].classList.remove("track_active");
  }
  currentTarget.classList.add("track_active");
};

for (let i = 0; i < trackCards.length; i++) {
  trackCards[i].addEventListener("click", playMusic);
}

btnPause.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    btnPause.classList.remove("player__icon_play");
  } else {
    audio.pause();
    btnPause.classList.add("player__icon_play");
  }
});

btnStop.addEventListener("click", () => {
  player.classList.remove("player_active");
  audio.src = "";
});
