const tracks = [
  {
    title: "Midnight City",
    artist: "M83",
    mood: "Dreamy",
    time: "4:03",
    symbol: "🌃",
    cover: "assets/spo1.png",
    colors: ["#344d7b", "#a46cae"],
    tag: "night drive",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Golden Hour",
    artist: "JVKE",
    mood: "Leve",
    time: "3:29",
    symbol: "🌅",
    cover: "assets/spo2.png",
    colors: ["#ed9c65", "#f3d5a5"],
    tag: "soft glow",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Ocean Eyes",
    artist: "Billie Eilish",
    mood: "Calmo",
    time: "3:20",
    symbol: "🌊",
    cover: "assets/spo3.png",
    colors: ["#477c9c", "#8bc7d5"],
    tag: "blue mood",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Afterglow",
    artist: "Taylor Swift",
    mood: "Pop",
    time: "3:43",
    symbol: "🌸",
    cover: "assets/spo4.png",
    colors: ["#ad6689", "#f0b7c6"],
    tag: "pink skies",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Space Song",
    artist: "Beach House",
    mood: "Dreamy",
    time: "5:20",
    symbol: "🪐",
    cover: "assets/capa1.png",
    colors: ["#39366f", "#8b78c7"],
    tag: "cosmic",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Sunflower",
    artist: "Rex Orange County",
    mood: "Feliz",
    time: "4:12",
    symbol: "🌻",
    cover: "assets/capa1.png",
    colors: ["#b7a344", "#e8d886"],
    tag: "good days",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    title: "Snooze",
    artist: "SZA",
    mood: "R&B",
    time: "3:22",
    symbol: "☁️",
    cover: "assets/capa1.png",
    colors: ["#010202", "#b5c3ad"],
    tag: "slow down",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    title: "The Night We Met",
    artist: "Lord Huron",
    mood: "Melancólico",
    time: "3:28",
    symbol: "🌙",
    cover: "assets/capa1.png",
    colors: ["#283746", "#738d9c"],
    tag: "late night",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

const audio = document.getElementById("audio");
const cards = document.getElementById("cards");
const rows = document.getElementById("trackRows");
const search = document.getElementById("searchInput");

const $ = id => document.getElementById(id);

let current = -1;
let playing = false;
let shuffle = false;
let repeat = false;
let view = "home";

const liked = new Set();
let recent = [];

const coverStyle = track =>
  `background: linear-gradient(145deg, ${track.colors[0]}, ${track.colors[1]})`;

function setIcon(element, name) {
  element.innerHTML = `<i data-lucide="${name}"></i>`;

  if (window.lucide) {
    lucide.createIcons({ nodes: [element] });
  }
}

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderCards(list = tracks.slice(0, 4)) {
  cards.innerHTML = "";
  list.forEach(track => {
    const index = tracks.indexOf(track);
    const card = document.createElement("article");
    card.className =
      "music-card" + (index === current ? " selected" : "");
    card.innerHTML = `
      <div class="cover" style="${coverStyle(track)}">
        <img
          class="cover-image"
          src="${track.cover}"
          alt="Capa de ${track.title}"
        >
        <span class="cover-tag">${track.tag}</span>
        <button
          class="mini-play"
          aria-label="Tocar ${track.title}"
        >
          <i data-lucide="${
            index === current && playing ? "pause" : "play"
          }"></i>
        </button>
      </div>
      <h3>${track.title}</h3>
      <p>${track.artist}</p>
    `;

    card.addEventListener("click", () => {
      playTrack(index);
    });

    card.querySelector("button").addEventListener("click", event => {
      event.stopPropagation();
      playTrack(index);
    });

    cards.appendChild(card);
  });

  refreshIcons();
}

function renderRows(list = tracks) {
  rows.innerHTML = "";
  $("empty").style.display =
    list.length ? "none" : "block";
  list.forEach(track => {
    const index = tracks.indexOf(track);
    const row = document.createElement("tr");

    if (index === current) {
      row.classList.add("active");
    }

    row.innerHTML = `
      <td class="track-name">
        <span
          class="tiny-cover"
          style="${coverStyle(track)}"
        >
          ${track.symbol}
        </span>

        <span>${track.title}</span>
      </td>
      <td>${track.artist}</td>
      <td>${track.mood}</td>
      <td>${track.time}</td>
    `;

    row.addEventListener("click", () => {
      playTrack(index);
    });

    rows.appendChild(row);
  });
}

function updateLists() {
  const query = search.value.trim().toLowerCase();

  let list = tracks.filter(track =>
    `${track.title} ${track.artist} ${track.mood}`
      .toLowerCase()
      .includes(query)
  );

  if (view === "liked") {
    list = list.filter(track =>
      liked.has(tracks.indexOf(track))
    );
  }

  if (view === "recent") {
    list = recent
      .map(index => tracks[index])
      .filter(Boolean)
      .filter(track =>
        `${track.title} ${track.artist} ${track.mood}`
          .toLowerCase()
          .includes(query)
      );
  }

  renderCards(
    view === "home" && !query
      ? tracks.slice(0, 4)
      : list
  );

  renderRows(list);

  $("featuredSection").style.display =
    view === "home" && !query ? "block" : "none";

  $("pageTitle").textContent = query
    ? "Resultados da busca"
    : view === "liked"
    ? "Músicas curtidas"
    : view === "recent"
    ? "Tocadas recentemente"
    : view === "library"
    ? "Sua biblioteca"
    : "Suas músicas, seu momento.";

  $("pageSub").textContent = query
    ? `Encontramos ${list.length} música(s) para você.`
    : view === "liked"
    ? "Seus sons favoritos em um só lugar."
    : view === "recent"
    ? "Continue de onde você parou."
    : "Explore suas músicas favoritas e descubra novos sons.";

  $("listTitle").textContent = query
    ? "Resultados"
    : view === "liked"
    ? "Suas curtidas"
    : view === "recent"
    ? "Ouvidas recentemente"
    : "Todas as músicas";
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = String(
    Math.floor(seconds % 60)
  ).padStart(2, "0");

  return `${minutes}:${remaining}`;
}

function playTrack(index) {
  if (index < 0 || index >= tracks.length) {
    return;
  }

  if (current === index) {
    togglePlay();
    return;
  }

  current = index;

  const track = tracks[index];

  audio.src = track.audio;
  audio.volume = Number($("volume").value);

  audio.play()
    .then(() => {
      playing = true;
      updatePlayer();
    })
    .catch(() => {
      playing = false;
      updatePlayer();

      $("nowArtist").textContent =
        `${track.artist} · clique em reproduzir para tentar novamente`;
    });

  recent = [
    index,
    ...recent.filter(item => item !== index)
  ].slice(0, 8);

  updatePlayer();
}

function togglePlay() {
  if (current < 0) {
    playTrack(0);
    return;
  }

  if (playing) {
    audio.pause();
    playing = false;
    updatePlayer();
  } else {
    audio.play()
      .then(() => {
        playing = true;
        updatePlayer();
      })
      .catch(() => {
        playing = false;
        updatePlayer();
      });
  }
}

function updatePlayer() {
  const track = tracks[current];
  setIcon(
    $("playBtn"),
    playing ? "pause" : "play"
  );

  $("playBtn").setAttribute(
    "aria-label",
    playing ? "Pausar" : "Reproduzir"
  );

  $("playBtn").setAttribute(
    "title",
    playing ? "Pausar" : "Reproduzir"
  );

  if (track) {
    $("nowCover").textContent = track.symbol;
    $("nowCover").style.cssText = coverStyle(track);

    $("nowTitle").textContent = track.title;
    $("nowArtist").textContent = track.artist;

    setIcon($("likeBtn"), "heart");

    const isLiked = liked.has(current);

    $("likeBtn").classList.toggle(
      "liked",
      isLiked
    );

    $("likeBtn").setAttribute(
      "aria-label",
      isLiked ? "Descurtir música" : "Curtir música"
    );

  } else {
    $("nowCover").textContent = "♫";
    $("nowTitle").textContent = "Escolha uma música";

    $("nowArtist").textContent =
      "Sua próxima favorita está aqui";

    setIcon($("likeBtn"), "heart");
  }

  updateLists();
}

function nextTrack() {
  if (current < 0) {
    playTrack(0);
    return;
  }

  const index = shuffle
    ? Math.floor(Math.random() * tracks.length)
    : (current + 1) % tracks.length;

  playTrack(index);
}

function previousTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  playTrack(
    (current - 1 + tracks.length) % tracks.length
  );
}

search.addEventListener("input", () => {
  view = "home";
  updateLists();
});

$("playBtn").addEventListener("click", togglePlay);

$("prevBtn").addEventListener("click", previousTrack);

$("nextBtn").addEventListener("click", nextTrack);

$("heroPlay").addEventListener("click", () => {
  current < 0 ? playTrack(0) : togglePlay();
});

$("volume").addEventListener("input", event => {
  audio.volume = Number(event.target.value);

  const icon = audio.volume === 0
    ? "volume-x"
    : audio.volume < 0.5
    ? "volume-1"
    : "volume-2";

  setIcon($("volumeIcon"), icon);
});

$("progress").addEventListener("input", event => {
  if (audio.duration) {
    audio.currentTime =
      Number(event.target.value) / 100 * audio.duration;
  }
});

audio.addEventListener("timeupdate", () => {
  $("currentTime").textContent =
    formatTime(audio.currentTime);

  $("duration").textContent =
    formatTime(audio.duration);

  $("progress").value = audio.duration
    ? audio.currentTime / audio.duration * 100
    : 0;
});

audio.addEventListener("ended", () => {
  if (repeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextTrack();
  }
});

$("shuffleBtn").addEventListener("click", () => {
  shuffle = !shuffle;

  $("shuffleBtn").style.color = shuffle
    ? "var(--accent)"
    : "#b7bdc9";
});

$("repeatBtn").addEventListener("click", () => {
  repeat = !repeat;

  $("repeatBtn").style.color = repeat
    ? "var(--accent)"
    : "#b7bdc9";
});

$("likeBtn").addEventListener("click", () => {
  if (current < 0) {
    return;
  }

  if (liked.has(current)) {
    liked.delete(current);
  } else {
    liked.add(current);
  }

  updatePlayer();
});

$("showAll").addEventListener("click", () => {
  view = "library";
  search.value = "";
  updateLists();
});

$("clearSearch").addEventListener("click", () => {
  search.value = "";
  view = "home";
  updateLists();
});

$("backBtn").addEventListener("click", () => {
  search.value = "";
  view = "home";
  updateLists();
});

$("forwardBtn").addEventListener("click", () => {
  view = "library";
  updateLists();
});

document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    view = button.dataset.view;

    if (view === "search") {
      search.focus();
    } else if (view !== "home") {
      search.value = "";
    }

    updateLists();

    document.querySelectorAll(".nav button").forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.view === view
      );
    });
  });
});

updateLists();
updatePlayer();
refreshIcons();