const appContainer = document.getElementById("app-container");

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 3) {
    return "vor " + diffDays + " Tagen";
  } else if (diffDays < 22) {
    return "vor " + Math.ceil(diffDays / 7) + " Wochen";
  } else {
    return "vor über 3 Wochen";
  }
}

fetch("versions.json")
  .then((response) => response.json())
  .then((data) => {
    for (const appName in data) {
      const app = data[appName].version;
      const isNewVersionAvailable = app.current !== app.installed;

      const appCard = document.createElement("div");
      appCard.className = "app-card";

      let note = "";
      if (app.note) {
        note = `<p><strong>Hinweis:</strong> ${app.note}</p>`;
      }

      let updateIcon = "";
      if (isNewVersionAvailable) {
        updateIcon = `<div class="update-icon"></div>`;
      }

      appCard.innerHTML = `
        ${updateIcon}
        <h2>${appName}</h2>
        <p><strong>Aktuelle Version:</strong> ${app.current}</p>
        <p><strong>Installierte Version:</strong> ${app.installed}</p>
        <p><strong>Datum der Installation:</strong> ${formatDate(app.date)}</p>
        ${note}
      `;

      appContainer.appendChild(appCard);
    }
  })
  .catch((error) => {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  });
