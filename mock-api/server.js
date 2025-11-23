const express = require('express');
const cors = require('cors');
const products = require('./products.json');

const app = express();
app.use(cors());

app.get('/api/products', (req, res) => {
  res.json(products);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
