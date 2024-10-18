// Fonction pour charger les liens et les afficher dans le tableau
async function loadLinks() {
  try {
    const response = await fetch('/links');
    const links = await response.json();
    
    const tbody = document.querySelector('#links-table tbody');
    tbody.innerHTML = '';  // Clear previous rows

    links.forEach(link => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${link.url}</td>
        <td>${link.comment}</td>
        <td>${link.risque_averee ? 'Oui' : 'Non'}</td>
        <td>
          <button class="valider" onclick="validateLink('${link._id}')">Valider</button>
          <button class="invalider" onclick="invalidateLink('${link._id}')">Invalider</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des liens :', error);
  }
}

// Fonction pour valider un lien (mettre risque_averee à true)
async function validateLink(id) {
  try {
    const response = await fetch(`/validate/${id}`, { method: 'POST' });
    if (response.ok) {
      alert('Lien validé avec succès');
      loadLinks();  // Refresh the links after validation
    } else {
      alert('Erreur lors de la validation du lien');
    }
  } catch (error) {
    console.error('Erreur lors de la validation :', error);
  }
}

// Fonction pour invalider un lien (mettre risque_averee à false)
async function invalidateLink(id) {
  try {
    const response = await fetch(`/invalidate/${id}`, { method: 'POST' });
    if (response.ok) {
      alert('Lien invalidé avec succès');
      loadLinks();  // Refresh the links after invalidation
    } else {
      alert('Erreur lors de l\'invalidation du lien');
    }
  } catch (error) {
    console.error('Erreur lors de l\'invalidation :', error);
  }
}

// Charger les liens au démarrage
loadLinks();

