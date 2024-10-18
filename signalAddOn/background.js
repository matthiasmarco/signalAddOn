// Créer un menu contextuel qui apparaît lorsqu'un utilisateur fait un clic droit sur un lien
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reportLink",
    title: "Signaler ce lien",
    contexts: ["link"] // Ce menu s'affiche uniquement lorsqu'un lien est cliqué
  });
});

// Gérer le clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "reportLink") {
    const url = info.linkUrl; // Récupère l'URL du lien cliqué

    // Debugging : afficher l'URL du lien avant d'ouvrir la fenêtre
    console.log("Lien à signaler :", url);

    openReportForm(url); // Ouvre le formulaire de signalement
  }
});

function openReportForm(linkUrl) {
  // Obtenir la taille de l'écran
  chrome.windows.getLastFocused({}, function(currentWindow) {
    const screenWidth = currentWindow.width;
    const screenHeight = currentWindow.height;

    // Définir la taille de la fenêtre modale
    const modalWidth = 600;
    const modalHeight = 500;

    // Calculer les coordonnées pour centrer la fenêtre
    const left = Math.round((screenWidth - modalWidth) / 2);
    const top = Math.round((screenHeight - modalHeight) / 2);

    // Créer la fenêtre modale centrée
    chrome.windows.create({
      url: `form.html?linkUrl=${encodeURIComponent(linkUrl)}`, // Encoder correctement l'URL
      type: "popup",
      width: modalWidth,
      height: modalHeight,
      left: left,
      top: top
    });
  });
}
