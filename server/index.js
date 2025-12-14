// =======================================================
// FICHIER : server/index.js
// Rôle : Back-end (Gère les secrets, les APIs, et la BDD)
// =======================================================

// 1. Initialisation du Serveur et des Dépendances
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: 'https://pigee1203-dotcom.github.io' }));
app.use(bodyParser.json());


// 3. Endpoint pour créer un "Link Token" (nécessaire pour Plaid)
// C'est la première étape du processus de connexion bancaire
app.post('/api/create_link_token', async (req, res) => {
    try {
        // Logique Plaid : 
        // 1. Appeler l'API Plaid pour générer un jeton temporaire.
        // 2. Retourner ce jeton au Front-end pour lancer l'interface de connexion.
        // ... (Le code réel ici utilise la librairie Plaid) ...
        
        console.log("Link token créé et envoyé au Front-end.");
        res.json({ link_token: "link-token-pour-le-front-end-plaid" }); 

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création du jeton de connexion.");
    }
});


// 4. Endpoint pour échanger le jeton public contre le jeton d'accès permanent
// C'est l'étape où la connexion est établie et où l'on obtient la clé permanente pour lire les données.
app.post('/api/exchange_public_token', async (req, res) => {
    // Le jeton public est reçu du Front-end
    const publicToken = req.body.public_token;

    try {
        // Logique Plaid : 
        // 1. Appeler l'API Plaid pour échanger le jeton public contre un Access_Token.
        // 2. Sauvegarder l'Access_Token dans votre Base de Données sécurisée (DB).
        // ... (Le code réel ici utilise la librairie Plaid) ...

        console.log("Jeton d'accès permanent obtenu et sauvegardé.");
        res.json({ success: true, message: "Connexion réussie et jeton enregistré." });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'échange des jetons.");
    }
});


// 5. Lancement du Serveur
// ... (Le code existant pour create_link_token et exchange_public_token est ici) ...

// -----------------------------------------------------------
// 🌟 NOUVEL ENDPOINT : RÉCUPÉRATION DES DONNÉES DU DASHBOARD
// -----------------------------------------------------------
app.get('/api/dashboard_data', async (req, res) => {
    // ⚠️ Attention : Ces données sont simulées pour le test !
    const mockData = {
        netWorth: 71299.60,
        netIndicator: 1.25, 
        assetSummary: {
            chequesEpargne: 11299.60,
            investissements: 60000.00
        },
        debt: {
            creditUtilization: 12,
            creditLine: 8500.00
        },
        assetAllocation: [
            { label: 'Actions', value: 30, color: '#66b3ff' },
            { label: 'Obligations', value: 45, color: '#f59e0b' },
            { label: 'Liquidités', value: 20, color: '#10b981' },
            { label: 'Autres', value: 5, color: '#ef4444' }
        ],
        budget: {
            revenus: 4500.00,
            depenses: 3120.50,
            epargneNette: 1379.50
        },
        recentActivity: [
            { date: '2025-12-09', description: 'Salaire', amount: 250.00, type: 'success' },
            { date: '2025-12-08', description: 'Épicerie', amount: -45.50, type: 'debit' },
            { date: '2025-12-05', description: 'Transfert CELI', amount: -500.00, type: 'debit' }
        ],
        objectiveProgress: {
            cible: 30000.00,
            actuel: 14500.00,
            description: 'Mise de Fonds (Maison)'
        }
    };
    
    console.log("Données du dashboard simulées envoyées.");
    res.json(mockData);
});

// 5. Lancement du Serveur
app.listen(PORT, () => {
    console.log(`Serveur Back-end démarré sur le port ${PORT}`);
});
