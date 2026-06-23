const crypto = require('crypto');
global.crypto = crypto.webcrypto;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const equipesJson = require('./equipe.json');
const calculerTotal = require('./sum');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// --- DATABASE: MongoDB Setup ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/football';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur de connexion à MongoDB', err));

const equipeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true }
});

const Equipe = mongoose.model('Equipe', equipeSchema);

// Seed DB on startup if empty
mongoose.connection.once('open', async () => {
    const count = await Equipe.countDocuments();
    if (count === 0) {
        console.log('🌱 Base de données vide. Initialisation avec equipe.json...');
        await Equipe.insertMany(equipesJson);
        console.log('✅ Initialisation terminée.');
    }
});

// --- CACHE: Redis Setup ---
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('❌ Erreur Redis', err));
redisClient.on('connect', () => console.log('✅ Connecté à Redis'));

// Start Redis client (async)
(async () => {
    await redisClient.connect();
})();

// Helper to clear cache
const clearCache = async () => {
    try {
        await redisClient.del('equipes_cache');
        console.log('🧹 Cache Redis vidé');
    } catch (err) {
        console.error('Erreur lors du vidage du cache', err);
    }
};

// --- ROUTES ---

// GET /
app.get('/', async (req, res) => {
    const total = await Equipe.countDocuments();
    res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1>Hello Docker</h1>
            <p>Architecture Complète : Node.js + MongoDB + Redis + Nginx</p>
            <hr style="width: 50%; border: 1px solid #eee;">
            <p> Il y a actuellement <strong>${total}</strong> équipes dans la base de données.</p>
            <p><a href="/equipes">Voir la liste des équipes (JSON)</a></p>
        </div>
    `);
});

// GET /equipes : Liste avec Cache Redis
app.get('/equipes', async (req, res) => {
    try {
        // 1. Vérifier le cache Redis
        const cachedEquipes = await redisClient.get('equipes_cache');
        if (cachedEquipes) {
            console.log('⚡ Données servies depuis Redis');
            return res.status(200).json(JSON.parse(cachedEquipes));
        }

        // 2. Si pas en cache, chercher dans MongoDB
        console.log('🐢 Données servies depuis MongoDB');
        const equipes = await Equipe.find({}, '-_id id name country').sort({ id: 1 });

        // 3. Sauvegarder dans le cache pour les prochaines requêtes (expire dans 1h)
        await redisClient.setEx('equipes_cache', 3600, JSON.stringify(equipes));

        res.status(200).json(equipes);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST /equipes : Ajouter
app.post('/equipes', async (req, res) => {
    try {
        const { id, name, country } = req.body;
        const newEquipe = new Equipe({ id, name, country });
        await newEquipe.save();

        await clearCache(); // Vider le cache car les données ont changé

        const allEquipes = await Equipe.find({}, '-_id id name country').sort({ id: 1 });
        res.status(201).json({
            message: "Équipe ajoutée avec succès",
            data: allEquipes
        });
    } catch (err) {
        res.status(400).json({ error: "Erreur lors de l'ajout" });
    }
});

// PUT /equipes/:id : Modifier
app.put('/equipes/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, country } = req.body;

        const equipe = await Equipe.findOneAndUpdate(
            { id },
            { name, country },
            { new: true }
        );

        if (equipe) {
            await clearCache();
            const allEquipes = await Equipe.find({}, '-_id id name country').sort({ id: 1 });
            res.status(200).json({
                message: "Équipe mise à jour",
                data: allEquipes
            });
        } else {
            res.status(404).send("Erreur : Équipe non trouvée");
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DELETE /equipes/:id : Supprimer
app.delete('/equipes/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        const result = await Equipe.findOneAndDelete({ id });

        if (result) {
            await clearCache();
            const allEquipes = await Equipe.find({}, '-_id id name country').sort({ id: 1 });
            res.status(200).json({
                message: "Équipe supprimée",
                data: allEquipes
            });
        } else {
            res.status(404).send("Erreur : Impossible de supprimer, équipe introuvable");
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DÉMARRAGE DU SERVEUR
app.listen(PORT, () => {
    console.log(`🚀 SERVEUR BACKEND DÉMARRÉ SUR : http://localhost:${PORT}`);
});