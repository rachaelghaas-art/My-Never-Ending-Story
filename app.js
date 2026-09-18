let content;
let currentEncounter;
let trail = [];

async function start() {
  const response = await fetch("content.json");
  content = await response.json();

  currentEncounter = content.prototype.startingEncounter;
  trail.push(currentEncounter);

  renderEncounter();
  renderTrail();
}

function renderEncounter() {
  const encounter = content.encounters[currentEncounter];
  const container = document.getElementById("encounter");
  const connections = document.getElementById("connections");

  container.innerHTML = "";
  connections.innerHTML = "";

  if (encounter.type === "image") {
    renderImage(encounter, container);
  }

  if (encounter.type === "passage") {
    renderPassage(encounter, container);
  }

  renderConnections(encounter);
}

function renderImage(encounter, container) {
  const image = document.createElement("img");
  image.src = `images/${currentEncounter}.jpg`;
  image.alt = "";
  container.appendChild(image);
}

function renderPassage(encounter, container) {
  const passage = document.createElement("div");
  passage.className = "passage";
  passage.textContent = `${encounter.story} — ${encounter.anchor}`;
  container.appendChild(passage);
}

function renderConnections(encounter) {
  const container = document.getElementById("connections");

  encounter.connections.forEach(connectionID => {
    const connection = content.connections[connectionID];
    const marker = document.createElement("div");

    marker.className = "connection";
    marker.style.left = "50%";
    marker.style.top = "75%";

    marker.innerHTML = `
      <div class="connection-marker"></div>
      <div class="connection-label">explore</div>
    `;

    marker.onclick = () => moveTo(connection.to);

    container.appendChild(marker);

    requestAnimationFrame(() => {
      marker.classList.add("visible");
    });
  });
}

function moveTo(destination) {
  const encounter = document.getElementById("encounter");

  encounter.style.opacity = "0";
  encounter.style.transform = "translateX(-40px)";

  setTimeout(() => {
    currentEncounter = destination;
    trail.push(destination);

    encounter.style.transform = "translateX(40px)";
    renderEncounter();
    renderTrail();

    requestAnimationFrame(() => {
      encounter.style.opacity = "1";
      encounter.style.transform = "translateX(0)";
    });
  }, 700);
}

function renderTrail() {
  const trailContainer = document.getElementById("trail");

  trailContainer.innerHTML = trail
    .map(item => `<span class="trail-item">${item}</span>`)
    .join(" → ");
}

start();
