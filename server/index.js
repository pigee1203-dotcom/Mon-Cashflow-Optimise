// =======================================================
// FICHIER : server/index.js
// Rôle : Back-end (Gère les secrets, les APIs, et la BDD)
// =======================================================

// 1. Initialisation du Serveur et des Dépendances
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080; 

// --- ATTENTION SÉCURITÉ : Les secrets doivent venir d'ici ---
// Les vraies clés d'API Plaid_Client_ID et Plaid_Secret 
// NE SONT PAS DANS CE FICHIER. Elles sont injectées via 
// les variables d'environnement de l'hébergeur (process.env.XXX).
// -----------------------------------------------------------


// 2. Middleware
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
app.listen(PORT, () => {
    console.log(`Serveur Back-end démarré sur le port ${PORT}`);
});
