// Fonction pour récupérer les liens à risque de l'API localhost et les logger
const fetchReportedLinks = async () => {
  try {
    const response = await fetch('http://localhost:3000/links');
    const links = await response.json();

    // Filtrer les liens avec "risque_averee": true
    const urls = links
      .filter(item => item.risque_averee === true)
      .map(item => item.url);

    // Logger les liens filtrés
    console.log('Domaines risqués récupérés:', urls);

    return urls;
  } catch (error) {
    console.error('Erreur lors de la récupération des liens signalés :', error);
    return [];
  }
};


// Fonction principale pour récupérer les liens à risque et logger les domaines de la page
const updateDomainsAndLog = async () => {
  await fetchReportedLinks();  // Récupérer et logger les liens risqués
};

// Exécuter l'appel initial et mettre à jour toutes les 5 secondes
setInterval(updateDomainsAndLog, 5000);

updateDomainsAndLog();  // Appeler immédiatement pour la première exécution

// Fonction utilitaire pour extraire le domaine d'une URL
function getDomainFromUrl(url) {
  const link = document.createElement('a');
  link.href = url;
  return link.hostname;
}

// Écouter tous les clics sur la page
document.addEventListener('click', function(event) {
  // Vérifier si l'élément cliqué est un lien
  const target = event.target.closest('a');
  if (!target) return; // Si ce n'est pas un lien, on ignore.

  // Obtenir le domaine du lien cliqué
  const clickedDomain = getDomainFromUrl(target.href);

  // Récupérer la liste des domaines depuis le stockage local
  chrome.storage.local.get('domainList', function(data) {
    const domainList = data.domainList || [];

    // Vérifier si le domaine cliqué fait partie de la liste
    if (domainList.includes(clickedDomain)) {
      // Empêcher le comportement par défaut du clic (la navigation)
      event.preventDefault();

      // Rediriger vers 'g-technologies.org'
      window.location.href = 'https://g-technologies.org';
    }
  });
});

