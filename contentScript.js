// Fonction pour récupérer et filtrer les URLs à risque
async function getSuspiciousUrls() {
    try {
        const response = await fetch('http://localhost:3000/links');
        const links = await response.json();

        // Filtrer les liens avec "risque_averee": true
        const urls = links
            .filter(item => item.risque_averee === true)
            .map(item => item.url);

        // Logger les liens filtrés
        console.log('Domaines risqués récupérés:', urls);

        // Stocker les domaines à risque dans le chrome.storage
        chrome.storage.local.set({ riskyDomains: urls }, () => {
            if (chrome.runtime.lastError) {
                console.error('Erreur lors du stockage des domaines à risque :', chrome.runtime.lastError);
            } else {
                console.log('Domaines à risque stockés avec succès.');
            }
        });

        return urls;

    } catch (error) {
        console.error('Erreur lors de la récupération des liens signalés :', error);
        return [];
    }
}

// Fonction pour obtenir le nom de domaine de l'URL
function getNomDeDomaine(url) {
    const domaine = new URL(url).hostname;
    return domaine;
}

// Fonction principale exécutée toutes les secondes pour vérifier et rediriger si nécessaire
async function checkAndRedirect() {
    const urls = await getSuspiciousUrls(); // Récupérer les URLs à risque
    const domaineActuel = getNomDeDomaine(window.location.href); // Obtenir le domaine actuel

    if (urls.includes(domaineActuel)) {
        // Redirection vers g-technologies.org
        window.location.href = 'http://localhost:3000/sortie.html';
    }
}

// Exécuter la vérification toutes les secondes
setInterval(checkAndRedirect, 1000);

