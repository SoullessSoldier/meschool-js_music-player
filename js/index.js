"use strict";
/* get data from API */
const API_URL = "http://localhost:3024/";
let trackList = [];
/* .get data from API */
/* get data from local */
//import trackList from "./trackList.js";
/* .get data from local */

let playlist = [];

const favoriteList = localStorage.getItem("favorite")
  ? JSON.parse(localStorage.getItem("favorite"))
  : [];

const audio = new Audio();

const btnPause = document.querySelector(".player__controller-pause"),
  btnStop = document.querySelector(".player__controller-stop"),
  trackCards = document.getElementsByClassName("track"),
  player = document.querySelector(".player"),
  catalogContainer = document.querySelector(".catalog__container"),
  btnPrev = document.querySelector(".player__controller-prev"),
  btnNext = document.querySelector(".player__controller-next"),
  btnLike = document.querySelector(".player__controller-like"),
  btnMute = document.querySelector(".player__controller-mute"),
  playerProgressInput = document.querySelector(".player__progress-input"),
  playerVolumeInput = document.querySelector(".player__volume-input"),
  playerTimePassed = document.querySelector(".player__time-passed"),
  playerTimeTotal = document.querySelector(".player__time-total"),
  btnFavorite = document.querySelector(".header__favorite-btn"),
  headerLogo = document.querySelector(".header__logo"),
  search = document.querySelector(".search");

const playMusic = (event) => {
  event.preventDefault();
  const currentTarget = event.currentTarget;
  let i = 0;
  const id = currentTarget.dataset.idTrack;

  const index = favoriteList.indexOf(id);
  if (index !== -1) {
    btnLike.classList.add("player__icon_like_active");
  } else {
    btnLike.classList.remove("player__icon_like_active");
  }

  const track = playlist.find((item, index) => {
    i = index;
    return id === item.id;
  });
  if (currentTarget.classList.contains("track_active")) {
    pausePlayer();
    return;
  } else {
    const playerTrackTitle = document.querySelector(
      ".player .track-info__title"
    );
    const playerTrackArtist = document.querySelector(
      ".player .track-info__artist"
    );
    audio.src = `${API_URL}${track.mp3}`;
    playerTrackTitle.textContent = track.track;
    playerTrackArtist.textContent = track.artist;
    playerProgressInput.value = 0;
    audio.play();
    btnPause.classList.remove("player__icon_play");
    player.classList.add("player_active");
    player.dataset.idTrack = id;

    const trackPrev = i === 0 ? playlist.length - 1 : i - 1;
    const trackNext = i + 1 === playlist.length ? 0 : i + 1;
    btnPrev.dataset.idTrack = playlist[trackPrev].id;
    btnNext.dataset.idTrack = playlist[trackNext].id;
    btnLike.dataset.idTrack = id;

    for (let i = 0; i < trackCards.length; i++) {
      if (id === trackCards[i].dataset.idTrack) {
        trackCards[i].classList.add("track_active");
      } else {
        trackCards[i].classList.remove("track_active");
      }
    }
  }
};

const catalogAddBtn = document.createElement("button");
catalogAddBtn.classList.add("catalog__btn-add");
catalogAddBtn.innerHTML = `
  <span>Увидеть все</span>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
    />
  </svg>        
`;

const pausePlayer = () => {
  const trackActive = document.querySelector(".track_active");
  if (!audio.paused) {
    audio.pause();
    /*let elemIcon = trackActive.querySelector(".track__img-wrapper");
    elemIcon.style.setProperty("--icon-status", "url(../img/play_arrow.svg)");*/
    trackActive.classList.add("track_pause");
    btnPause.classList.add("player__icon_play");
  } else if (audio.paused) {
    audio.play();
    /*let elemIcon = trackActive.querySelector(".track__img-wrapper");
    elemIcon.style.setProperty("--icon-status", "url(../img/pause.svg)");*/
    trackActive.classList.remove("track_pause");
    btnPause.classList.remove("player__icon_play");
  }
};

const addHandlerTrack = () => {
  for (let i = 0; i < trackCards.length; i++) {
    trackCards[i].addEventListener("click", playMusic);
  }
};

btnPause.addEventListener("click", pausePlayer);

btnStop.addEventListener("click", () => {
  player.classList.remove("player_active");
  audio.src = "";
  /*[...trackCards].forEach((elem) => {
    elem.classList.remove("track_active");
  });*/
  document.querySelector(".track_active").classList.remove("track_active");
});

const createCard = (data) => {
  const card = document.createElement("a");
  card.href = "#";
  card.classList.add("catalog__item", "track");
  if (player.dataset.idTrack === data.id) {
    card.classList.add("track_active");
    if (audio.paused) {
      card.classList.add("track_pause");
    }
  }
  card.dataset.idTrack = data.id;

  card.innerHTML = `
  <div class="track__img-wrapper">
    <img
      class="track__poster"
      src="${API_URL}${data.poster}"
      alt="${data.artist} - ${data.track}"
    />
  </div>
  <div class="track__info track-info">
    <p class="track-info__title">${data.track}</p>
    <p class="track-info__artist">${data.artist}</p>
  </div>
  `;

  return card;
};

const checkCount = (i = 1) => {
  //trackCards[0];
  if (catalogContainer.clientHeight > trackCards[0].clientHeight * 3) {
    trackCards[trackCards.length - i].style.display = "none";
    checkCount(i + 1);
  } else if (i !== 1) {
    catalogContainer.append(catalogAddBtn);
  }
};

const renderCatalog = (dataList) => {
  playlist = [...dataList];
  catalogContainer.textContent = "";
  const listCards = playlist.map(createCard);
  catalogContainer.append(...listCards);
  addHandlerTrack();
};

const updateTimer = () => {
  const duration = audio.duration || 0;
  const currentTime = audio.currentTime || 0;
  const progress = (currentTime / duration) * playerProgressInput.max;
  playerProgressInput.value = progress ? progress : 0;
  const minutesPassed = String(Math.floor(currentTime / 60)) || "0";
  const secondsPassed = String(Math.floor(currentTime % 60)) || "0";
  const minutesDuration = String(Math.floor(duration / 60)) || "0";
  const secondsDuration = String(Math.floor(duration % 60)) || "0";

  playerTimePassed.textContent = `
    ${minutesPassed.padStart(2, "0")}:${secondsPassed.padStart(2, "0")}
  `;
  playerTimeTotal.textContent = `
    ${minutesDuration.padStart(2, "0")}:${secondsDuration.padStart(2, "0")}
  `;
};

const init = async () => {
  audio.volume = localStorage.getItem("volume") || 1;
  playerVolumeInput.value = audio.volume * 100;

  trackList = await fetch(`${API_URL}api/music`).then((data) => data.json());

  renderCatalog(trackList);
  if (playlist.length) checkCount();
  catalogAddBtn.addEventListener("click", () => {
    [...trackCards].forEach((trackCard) => {
      trackCard.style.display = "";
      catalogAddBtn.remove();
    });
  });
  btnPrev.addEventListener("click", playMusic);
  btnNext.addEventListener("click", playMusic);

  audio.addEventListener("ended", () => {
    btnNext.dispatchEvent(new Event("click", { bubbles: true }));
  });

  audio.addEventListener("timeupdate", updateTimer);

  playerProgressInput.addEventListener("change", () => {
    const progress = playerProgressInput.value;
    audio.currentTime = audio.duration * (progress / playerProgressInput.max);
  });

  btnFavorite.addEventListener("click", () => {
    const data = trackList.filter((item) => favoriteList.includes(item.id));
    renderCatalog(data);
    if (playlist.length) checkCount();
  });

  headerLogo.addEventListener("click", () => {
    renderCatalog(trackList);
    checkCount();
  });

  btnLike.addEventListener("click", () => {
    const index = favoriteList.indexOf(btnLike.dataset.idTrack);
    if (index === -1) {
      favoriteList.push(btnLike.dataset.idTrack);
      btnLike.classList.add("player__icon_like_active");
    } else {
      favoriteList.splice(index, 1);
      btnLike.classList.remove("player__icon_like_active");
    }
    localStorage.setItem("favorite", JSON.stringify(favoriteList));
  });

  playerVolumeInput.addEventListener("input", () => {
    const value = playerVolumeInput.value;
    audio.volume = value / 100;
  });

  btnMute.addEventListener("click", () => {
    if (audio.volume) {
      localStorage.setItem("volume", audio.volume);
      audio.volume = 0;
      btnMute.classList.add("player__icon_mute-off");
      playerVolumeInput.value = 0;
    } else {
      audio.volume = localStorage.getItem("volume");
      btnMute.classList.remove("player__icon_mute-off");
      playerVolumeInput.value = audio.volume * 100;
    }
  });

  search.addEventListener("submit", async (event) => {
    event.preventDefault();

    playlist = await fetch(
      `${API_URL}api/music?search=${search.search.value}`
    ).then((data) => data.json());
    renderCatalog(playlist);
    if (playlist.length) checkCount();
  });
};

init();
