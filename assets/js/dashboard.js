document.addEventListener('DOMContentLoaded', function() {

    // L'ID 'link-button' est le bouton HTML que nous avons ajouté
    const linkButton = document.getElementById('link-button');

    if (linkButton) {
        // Ajout de l'écouteur d'événement sur le bouton
        linkButton.addEventListener('click', async function() {
            console.log('Bouton de connexion cliqué. Demande de link_token...');

            try {
                // Étape 1: Demander un link_token au serveur Node.js
                const response = await fetch('http://localhost:8080/api/create_link_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP lors de la récupération du link_token: ${response.status}`);
                }

                const data = await response.json();
                const linkToken = data.link_token;
                console.log('link_token reçu:', linkToken);

                // Étape 2: Initialiser et ouvrir Plaid Link
                const handler = Plaid.create({
                    token: linkToken,
                    onSuccess: async function(public_token, metadata) {
                        console.log('Connexion réussie. public_token:', public_token);
                        
                        // Étape 3: Échanger le public_token contre un access_token
                        await fetch('http://localhost:8080/api/set_access_token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ public_token: public_token }),
                        });
                        
                        alert('Compte connecté avec succès !');
                        window.location.reload(); 
                    },
                    onExit: function(err, metadata) {
                        console.error('Plaid Link fermé ou erreur:', err, metadata);
                    },
                });

                // Ouvrir la fenêtre Plaid Link
                handler.open();

            } catch (error) {
                console.error('Erreur fatale lors de la connexion Plaid:', error);
                alert('Erreur lors de la connexion à la banque. Voir la console pour les détails.');
            }
        });
    } else {
        console.error("Élément 'link-button' non trouvé. Le code ne s'exécutera pas.");
    }
});
