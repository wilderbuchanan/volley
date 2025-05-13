const allPlayers = ["Wilder", "Jin", "Alex", "Daniel", "Peter", "Other"];
const displayPlayers = allPlayers.filter(p => p !== "Other");

// Google Apps Script endpoint
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyFTFblxktkwbjxgLVVzWpZaHfk_agyhh8O9tq-hiiyUmLeXB9FHeW4hTmdAE9wvA-ECQ/exec";

// Use AllOrigins proxy to bypass CORS
async function fetchMatchData() {
  const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(GOOGLE_SHEET_URL)}`;
  const res = await fetch(proxyURL);
  const wrapped = await res.json();
  const data = JSON.parse(wrapped.contents);
  return data;
}

function calculateWinRates(matchLog) {
  let playerStats = {};
  allPlayers.forEach(name => {
    playerStats[name] = { wins: 0, games: 0 };
  });

  matchLog.forEach(match => {
    if (!match.teamA || !match.teamB || !match.winner) return;
    const winners = match.winner === "A" ? match.teamA : match.teamB;
    const allParticipants = [...match.teamA, ...match.teamB];

    allParticipants.forEach(p => {
      if (playerStats[p]) {
        playerStats[p].games += 1;
        if (winners.includes(p)) {
          playerStats[p].wins += 1;
        }
      }
    });
  });

  return playerStats;
}

function renderPlayers(stats) {
  const container = document.getElementById("playerGrid");
  if (!container) return;

  displayPlayers.forEach(name => {
    const div = document.createElement("div");
    div.className = "player-card";

    const img = document.createElement("img");
    img.src = `icons/${name.toLowerCase()}.png`;
    img.alt = name;

    const label = document.createElement("div");
    const record = stats[name];
    const winPct = record.games > 0 ? Math.round((record.wins / record.games) * 100) : 0;
    label.textContent = `${name} — ${winPct}%`;

    div.appendChild(img);
    div.appendChild(label);
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const matchLog = await fetchMatchData();
    const stats = calculateWinRates(matchLog);
    renderPlayers(stats);
  } catch (err) {
    console.error("❌ Failed to load match data from Google Sheets", err);
  }
});
