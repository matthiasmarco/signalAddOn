document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const linkUrl = urlParams.get('linkUrl');
  
  let domain = '';
  try {
    const urlObject = new URL(linkUrl);
    domain = urlObject.hostname.replace(/^www\./, ''); // Supprime "www." et récupère le domaine principal
  } catch (error) {
    console.error('URL invalide :', error);
    alert('Erreur : L\'URL du lien est invalide.');
    return;
  }

  // Gérer la soumission du formulaire
  document.getElementById('report-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const comment = document.getElementById('comment').value;

    if (comment.trim() === "") {
      alert("Veuillez décrire pourquoi le lien est frauduleux.");
      return;
    }

    // Fermer immédiatement la fenêtre avant d'envoyer la requête à l'API
    window.close();

    try {
      const response = await fetch('http://localhost:3000/add-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: domain, comment }),  // Envoyer uniquement le domaine
      });

      console.log('Réponse de l\'API :', response);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Erreur lors de l'enregistrement du lien : " + errorMessage);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du lien signalé :', error);
    }
  });
});

