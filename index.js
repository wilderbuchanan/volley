const players = ["Wilder", "Jin", "Alex", "Daniel", "Peter", "Other"];
let matchLog = JSON.parse(localStorage.getItem("matchLog") || "[]");

function calculateWinRates() {
  let playerStats = {};
  players.forEach(name => {
    playerStats[name] = { wins: 0, games: 0 };
  });

  matchLog.forEach(match => {
    const winners = match.winner === "A" ? match.teamA : match.teamB;
    const allPlayers = [...match.teamA, ...match.teamB];

    allPlayers.forEach(p => {
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
  const stats = calculateWinRates();

  players.forEach(name => {
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
