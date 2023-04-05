const appContainer = document.getElementById("app-container");

fetch("/apps")
  .then((response) => response.json())
  .then((data) => {
    const appNames = Object.keys(data);
    appNames.forEach((appName) => {
      const appInfo = data[appName];
      const appElement = document.createElement("div");
      appElement.classList.add("app-info");

      appElement.innerHTML = `
        <h2>${appName}</h2>
        <p>Current Version: ${appInfo.version.current}</p>
        <p>Installed Version: ${appInfo.version.installed}</p>
        <p>Install Date: ${appInfo.version.installdate}</p>
        <p>Note: ${appInfo.version.note}</p>
        <p>Release Notes: <a href="${appInfo.version.releaseNotes}" target="_blank">${appInfo.version.releaseNotes}</a></p>
        <p>Available Since: ${appInfo.version.availableSince}</p>
      `;

      appContainer.appendChild(appElement);
    });
  })
  .catch((error) => {
    console.error("Error fetching app data:", error);
  });
