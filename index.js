const allPlayers = ["Wilder", "Jin", "Alex", "Daniel", "Peter", "Other"];
const displayPlayers = allPlayers.filter(p => p !== "Other");

function calculateWinRates() {
  let matchLog = [];
  try {
    matchLog = JSON.parse(localStorage.getItem("matchLog") || "[]");
  } catch {
    console.error("Could not parse matchLog from localStorage");
  }

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

function renderPlayers() {
  const container = document.getElementById("playerGrid");
  if (!container) return;

  const stats = calculateWinRates();

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

document.addEventListener("DOMContentLoaded", renderPlayers);
