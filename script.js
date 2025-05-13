const players = ["Wilder", "Jin", "Alex", "Daniel", "Peter", "Other"];
let stats = {};
players.forEach(p => stats[p] = { wins: 0, losses: 0 });

function createPlayerSelector(containerId) {
  const container = document.getElementById(containerId);
  players.forEach(player => {
    const img = document.createElement("img");
    const filename = player.toLowerCase() + ".png";
    img.src = `icons/${filename}`;
    img.alt = player;
    img.dataset.name = player;

    // Fallback image in case of broken link
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

function updateStandings() {
  const list = document.getElementById("standings");
  list.innerHTML = "";
  Object.entries(stats).forEach(([name, record]) => {
    const li = document.createElement("li");
    li.textContent = `${name}: ${record.wins}W - ${record.losses}L`;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createPlayerSelector("teamA");
  createPlayerSelector("teamB");
  updateStandings();

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
      alert("Match recorded!");
    });
  }
});
