const generateBtn = document.getElementById("generate-card");
const clearBtn = document.getElementById("clear-card");
const cardContainer = document.getElementById("card");

const CARD_KEY = "bingo_card";
let allSongs = [];

// --- Cargar canciones desde songs.json ---
async function loadSongs() {
  try {
    const response = await fetch("songs.json");
    allSongs = await response.json();
    console.log("Canciones cargadas:", allSongs); // 👈 Ver qué trae
  } catch (error) {
    console.error("Error cargando canciones:", error);
    alert("Error al cargar la lista de canciones.");
  }
}


// --- Función para mezclar array ---
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// --- Guardar estado en localStorage ---
function saveCardState(card, ticks) {
  localStorage.setItem(CARD_KEY, JSON.stringify({ card, ticks }));
}

// --- Cargar estado desde localStorage ---
function loadCardState() {
  const data = localStorage.getItem(CARD_KEY);
  return data ? JSON.parse(data) : null;
}

// --- Generar un nuevo cartón ---
function generateCard() {
  if (allSongs.length < 10) {
    alert("No hay suficientes canciones para generar un cartón.");
    return;
  }
  const shuffled = shuffle([...allSongs]);
  const newCard = shuffled.slice(0, 10);
  renderCard(newCard, []);
  saveCardState(newCard, []);
  cardContainer.classList.remove("hidden");
  clearBtn.classList.remove("hidden");
}

// --- Renderizar cartón en pantalla ---
function renderCard(card, ticks) {
  cardContainer.innerHTML = "";
  card.forEach(song => {
    const songEl = document.createElement("div");
    songEl.textContent = song.titulo;
    songEl.className = "song";

    if (ticks.includes(song)) {
      songEl.classList.add("ticked");
    }

    songEl.addEventListener("click", () => {
      if (songEl.classList.contains("ticked")) {
        songEl.classList.remove("ticked");
        ticks = ticks.filter(t => t !== song.id);
      } else {
        songEl.classList.add("ticked");
        ticks.push(song);
      }
      saveCardState(card, ticks);
    });

    cardContainer.appendChild(songEl);
  });
}

// --- Resetear cartón ---
function clearCard() {
  localStorage.removeItem(CARD_KEY);
  cardContainer.classList.add("hidden");
  clearBtn.classList.add("hidden");
}

// --- Eventos ---
generateBtn.addEventListener("click", generateCard);
clearBtn.addEventListener("click", clearCard);

// --- Inicialización ---
window.addEventListener("DOMContentLoaded", async () => {
  await loadSongs();

  const savedState = loadCardState();
  if (savedState) {
    renderCard(savedState.card, savedState.ticks);
    cardContainer.classList.remove("hidden");
    clearBtn.classList.remove("hidden");
  }
});

