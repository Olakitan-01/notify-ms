const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Gateway Running');
});

// forward request to user-service
app.get('/users', async (req, res) => {
  const response = await axios.get('');
  res.json(response.data);
});

module.exports = app;