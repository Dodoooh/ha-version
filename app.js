const appContainer = document.getElementById("app-container");

function formatDateDiff(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 14) {
    return `${days} Tag${days === 1 ? "" : "e"}`;
  } else if (days < 60) {
    const weeks = Math.floor(days / 7);
    return `${weeks} Woche${weeks === 1 ? "" : "n"}`;
  } else {
    const months = Math.floor(days / 30);
    return `${months} Monat${months === 1 ? "" : "e"}`;
  }
}

fetch("versions.json")
  .then((response) => response.json())
  .then((data) => {
    for (const appName in data) {
      const app = data[appName];
      const appDiv = document.createElement("div");
      appDiv.className = "app";
      appDiv.innerHTML = `
        <h2>${appName}</h2>
        <p>Aktuelle Version: ${app.version.current}</p>
        <p>Installierte Version: ${app.version.installed}</p>
        <p>Installationsdatum: vor ${formatDateDiff(app.version.installdate)}</p>
        <p>Hinweis: ${app.version.note}</p>
        <p><a href="${app.version.releaseNotes}">Release Notes</a></p>
        <p>Verfügbar seit: ${formatDateDiff(app.version.availableSince)} verfügbar</p>
        <p>Überspringen der aktuellen Version: ${app.version.skipCurrent ? "Ja" : "Nein"}</p>
        <button data-app-name="${appName}" data-app-data='${JSON.stringify(app)}'>Download ${appName}.json</button>
      `;
      appContainer.appendChild(appDiv);
    }

    // Event-Listener für die Download-Buttons hinzufügen
    document.querySelectorAll("button[data-app-name]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const appName = event.target.getAttribute("data-app-name");
        const appData = JSON.parse(event.target.getAttribute("data-app-data"));
        createAPIEndpoint(appName, appData);
      });
    });
  });

function createAPIEndpoint(appName, appData) {
  const appDataJson = JSON.stringify(appData);
  const endpoint = `/api/${appName}`;
  const link = document.createElement("a");
  link.href = "data:application/json;charset=utf-8," + encodeURIComponent(appDataJson);
  link.download = `${appName}.json`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
