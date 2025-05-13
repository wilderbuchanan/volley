const players = ["Wilder", "Jin", "Alex", "Daniel", "Peter", "Cam", "Other"];
let stats = {};

players.forEach(p => stats[p] = { wins: 0, losses: 0 });

function populateSelect(id) {
  const sel = document.getElementById(id);
  players.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.text = p;
    sel.appendChild(opt);
  });
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
  populateSelect("teamA");
  populateSelect("teamB");
  updateStandings();

  document.getElementById("matchForm").addEventListener("submit", e => {
    e.preventDefault();
    const teamA = Array.from(document.getElementById("teamA").selectedOptions).map(o => o.value);
    const teamB = Array.from(document.getElementById("teamB").selectedOptions).map(o => o.value);
    const winner = document.getElementById("winner").value;

    if (teamA.length !== 2 || teamB.length !== 2) {
      alert("Each team must have exactly 2 players.");
      return;
    }

    const losers = winner === "A" ? teamB : teamA;
    const winners = winner === "A" ? teamA : teamB;

    winners.forEach(p => stats[p].wins++);
    losers.forEach(p => stats[p].losses++);

    updateStandings();
  });
});
