// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { callGPT4 } = require('./modelFunctions');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/web4ai/process', async (req, res) => {
  const { model, tool, input } = req.body;
  try {
    const output = await callGPT4(model, tool, input);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
});

app.listen(3000, () => console.log('✅ Web4AI backend running on http://localhost:3000'));
