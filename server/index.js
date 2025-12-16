const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);
let ACCESS_TOKEN = null;
let ITEM_ID = null;

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://127.0.0.1:8081', 'http://localhost:8081'] }));
app.use(bodyParser.json());

app.post('/api/create_link_token', async (req, res) => {
  try {
    const request = {
      user: { client_user_id: 'user-id-' + Date.now() },
      client_name: 'Mon Cashflow Optimisé',
      products: ['transactions'],
      country_codes: ['CA'],
      language: 'fr',
    };
    const response = await plaidClient.linkTokenCreate(request);
    console.log("✅ Link token créé:", response.data.link_token);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("❌ Erreur create_link_token:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/set_access_token', async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token: public_token });
    ACCESS_TOKEN = response.data.access_token;
    ITEM_ID = response.data.item_id;
    console.log("✅ Access token obtenu:", ACCESS_TOKEN);
    res.json({ success: true, message: "Connexion réussie !", item_id: ITEM_ID });
  } catch (error) {
    console.error("❌ Erreur set_access_token:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  if (!ACCESS_TOKEN) {
    return res.status(400).json({ error: "Aucun compte connecté." });
  }
  try {
    const response = await plaidClient.transactionsGet({
      access_token: ACCESS_TOKEN,
      start_date: '2024-01-01',
      end_date: new Date().toISOString().split('T')[0],
    });
    console.log("✅ Transactions récupérées:", response.data.transactions.length);
    res.json({ accounts: response.data.accounts, transactions: response.data.transactions });
  } catch (error) {
    console.error("❌ Erreur transactions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/accounts', async (req, res) => {
  if (!ACCESS_TOKEN) {
    return res.status(400).json({ error: "Aucun compte connecté." });
  }
  try {
    const response = await plaidClient.accountsGet({ access_token: ACCESS_TOKEN });
    console.log("✅ Comptes récupérés:", response.data.accounts.length);
    res.json({ accounts: response.data.accounts });
  } catch (error) {
    console.error("❌ Erreur accounts:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
