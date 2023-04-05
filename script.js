const appContainer = document.getElementById("app-container");

fetch("versions.json")
  .then((response) => response.json())
  .then((data) => {
    for (const appName in data) {
      const app = data[appName].version;

      const appCard = document.createElement("div");
      appCard.className = "app-card";

      appCard.innerHTML = `
        <h2>${appName}</h2>
        <p><strong>Aktuelle Version:</strong> ${app.current}</p>
        <p><strong>Installierte Version:</strong> ${app.installed}</p>
        <p><strong>Datum der Installation:</strong> ${app.date}</p>
        <p><strong>Hinweis:</strong> ${app.note}</p>
      `;

      appContainer.appendChild(appCard);
    }
  })
  .catch((error) => {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  });
