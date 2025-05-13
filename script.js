const players = ["Wilder", "Jin", "Alex", "Daniel", "Peter", "Other"];
let stats = {};
players.forEach(p => stats[p] = { wins: 0, losses: 0 });

// Load match history from localStorage
let matchLog = JSON.parse(localStorage.getItem("matchLog") || "[]");

// Google Apps Script Web App URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyFTFblxktkwbjxgLVVzWpZaHfk_agyhh8O9tq-hiiyUmLeXB9FHeW4hTmdAE9wvA-ECQ/exec";

function sendMatchToGoogleSheet(entry) {
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  });
}

function saveMatchLog(entry) {
  matchLog.push(entry);
  localStorage.setItem("matchLog", JSON.stringify(matchLog));
}

function createPlayerSelector(containerId) {
  const container = document.getElementById(containerId);
  players.forEach(player => {
    const img = document.createElement("img");
    const filename = player.toLowerCase() + ".png";
    img.src = `icons/${filename}`;
    img.alt = player;
    img.dataset.name = player;

    img.onerror = () => {
      img.src = `icons/other.png`;
    };

    img.addEventListener("click", () => {
      img.classList.toggle("selected");
      const selected = container.querySelectorAll(".selected");
      if (selected.length > 2) {
        img.classList.remove("selected");
        alert("You can only select 2 players per team.");
      }
    });

    container.appendChild(img);
  });
}

function getSelectedPlayers(containerId) {
  return Array.from(document.getElementById(containerId).querySelectorAll(".selected"))
              .map(img => img.dataset.name);
}

function resetTeamSelections() {
  document.querySelectorAll(".player-select img").forEach(img => {
    img.classList.remove("selected");
  });
  const winnerSelect = document.getElementById("winner");
  if (winnerSelect) winnerSelect.value = "A";
}

function updateStandings() {
  const list = document.getElementById("standings");
  if (!list) return;
  list.innerHTML = "";
  Object.entries(stats).forEach(([name, record]) => {
    const li = document.createElement("li");
    li.textContent = `${name}: ${record.wins}W - ${record.losses}L`;
    list.appendChild(li);
  });
}

function updateMatchHistory() {
  const historyEl = document.getElementById("matchHistory");
  if (!historyEl) return;
  historyEl.innerHTML = "";

  matchLog.slice().reverse().forEach(match => {
    const li = document.createElement("li");
    li.textContent = `[${new Date(match.timestamp).toLocaleString()}] ` +
      `Team ${match.winner} won ${match.score} — ` +
      `Team A: ${match.teamA.join(", ")} vs Team B: ${match.teamB.join(", ")}`;
    historyEl.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createPlayerSelector("teamA");
  createPlayerSelector("teamB");
  updateStandings();
  updateMatchHistory();

  const form = document.getElementById("matchForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const teamA = getSelectedPlayers("teamA");
      const teamB = getSelectedPlayers("teamB");
      const winner = document.getElementById("winner").value;

      if (teamA.length !== 2 || teamB.length !== 2) {
        alert("Each team must have exactly 2 players.");
        return;
      }

      const winners = winner === "A" ? teamA : teamB;
      const losers = winner === "A" ? teamB : teamA;

      winners.forEach(p => stats[p].wins++);
      losers.forEach(p => stats[p].losses++);

      updateStandings();

      const now = new Date().toISOString();
      const score = prompt("Enter final score (e.g., 21-18):") || "N/A";

      const matchData = {
        timestamp: now,
        teamA,
        teamB,
        winner,
        score
      };

      saveMatchLog(matchData);
      sendMatchToGoogleSheet(matchData);
      updateMatchHistory();
      alert("Match recorded!");
      resetTeamSelections();
    });
  }
});
