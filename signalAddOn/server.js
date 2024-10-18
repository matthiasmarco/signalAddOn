const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/lienDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', () => {
  console.log('Connexion à MongoDB réussie');
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Schéma pour le lien signalé avec risque_averee
const linkSchema = new mongoose.Schema({
  url: String,
  comment: String,
  date: { type: Date, default: Date.now },
  risque_averee: { type: Boolean, default: false }
});

const Link = mongoose.model('Link', linkSchema);

// Route pour ajouter un lien signalé
app.post('/add-link', async (req, res) => {
  const { url, comment } = req.body;

  if (!url || !comment) {
    return res.status(400).json({ message: 'URL et commentaire sont requis' });
  }

  try {
    const newLink = new Link({ url, comment });
    await newLink.save();
    res.status(200).json({ message: 'Lien signalé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du lien' });
  }
});

// Route pour récupérer tous les liens signalés
app.get('/links', async (req, res) => {
  try {
    const links = await Link.find();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des liens' });
  }
});

// Route pour valider un lien (mettre risque_averee à true)
app.post('/validate/:id', async (req, res) => {
  try {
    await Link.findByIdAndUpdate(req.params.id, { risque_averee: true });
    res.status(200).json({ message: 'Lien validé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation du lien' });
  }
});

// Route pour invalider un lien (mettre risque_averee à false)
app.post('/invalidate/:id', async (req, res) => {
  try {
    await Link.findByIdAndUpdate(req.params.id, { risque_averee: false });
    res.status(200).json({ message: 'Lien invalidé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'invalidation du lien' });
  }
});



const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Serve the admin.html file when the /admin route is accessed
app.get('/public', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});


// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${PORT}`);
});



