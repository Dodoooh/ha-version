const appContainer = document.getElementById("app-container");
const versionNumbers = document.querySelector(".version-numbers");

fetch("appData.json")
    .then(response => response.json())
    .then(appData => {
        const appPromises = appData.map(app => {
            return fetch(app.url).then(response => response.json());
        });

        Promise.all(appPromises)
            .then(appInfos => {
                const currentDate = new Date();
                let installedCount = 0;
                let updatedCount = 0;

                function getFriendlyDate(date) {
                    const now = new Date();
                    const daysDifference = Math.floor((now - date) / (1000 * 60 * 60 * 24));

                    if (daysDifference === 0) {
                        return "Today";
                    } else if (daysDifference === 1) {
                        return "Yesterday";
                    } else if (daysDifference < 7) {
                        return `befor ${daysDifference} Days`;
                    } else if (daysDifference < 14) {
                        return "a week ago";
                    } else if (daysDifference < 21) {
                        return "two weeks ago";
                    } else if (daysDifference > 21) {
                        return "long time ago";
                    } else {
                        return date.toLocaleDateString();
                    }
                }

                appInfos.forEach((appInfo, index) => {
  const app = appData[index];
  const appElement = document.createElement("div");
  appElement.classList.add("app-info");

  const installDate = new Date(appInfo.version.installdate);
  const daysSinceInstall = Math.floor((currentDate - installDate) / (1000 * 60 * 60 * 24));
  const daysSinceAvailable = Math.floor((currentDate - new Date(appInfo.version.availableSince)) / (1000 * 60 * 60 * 24));

  let statusClass = "";
  let statusText = "";

  if (appInfo.version.installed === appInfo.version.current && daysSinceInstall >= 1) {
    statusClass = "installed-updated";
    statusText = "Updated";
    updatedCount++;
  } else if (appInfo.version.installed === appInfo.version.current) {
    statusClass = "installed-same";
    statusText = "Installed";
    installedCount++;
    if (daysSinceInstall >= 1) {
      statusClass += " installed-same-updated";
    }
  } else if (appInfo.version.installed !== appInfo.version.current && daysSinceAvailable >= 2) {
    statusClass = "available-old";
    statusText = "Available";
  }

  const appVersionClass = daysSinceAvailable >= 3 ? "available" : "current";

  const releaseNotes = appInfo.version.releaseNotes
  ? `<a href="${appInfo.version.releaseNotes}" target="_blank">Release Notes</a>`
  : "";

  appElement.innerHTML = `
  <div class="app-header ${statusClass}">
    <h2 class="app-name">${app.name}</h2>
    <div class="version-container">
      <p class="app-version ${statusClass} ${appVersionClass}">${appInfo.version.current}</p>
      <p class="installed-version">${appInfo.version.installed}</p>
    </div>
  </div>
  <div class="app-content">
    <p class="install-date">Install Date: ${getFriendlyDate(installDate)}</p>
    <p class="note">${appInfo.version.note}</p>
  </div>
  <div class="app-footer">
    <p class="release-notes">${releaseNotes}</p>
    <p class="available-since">Available Since: ${getFriendlyDate(new Date(appInfo.version.availableSince))}</p>
  </div>
`;


  appContainer.appendChild(appElement);
});

versionNumbers.innerHTML = `${installedCount} / ${appData.length}`;

if (updatedCount > 0) {
  versionNumbers.classList.add("updated");
}
})
.catch(error => {
  console.error("Error fetching app data:", error);
});
})
.catch(error => {
  console.error("Error fetching app data:", error);
});
