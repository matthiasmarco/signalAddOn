const mongoose = require('mongoose');

// Connexion à MongoDB (assurez-vous que l'URI est correcte)
mongoose.connect('mongodb://localhost:27017/lienDB');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', async () => {
  console.log('Connexion à MongoDB réussie');

  try {
    // Drop the database
    await db.dropDatabase();
    console.log('La base de données a été supprimée.');
  } catch (error) {
    console.error('Erreur lors de la suppression de la base de données :', error);
  } finally {
    mongoose.connection.close();
  }
});
