// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { runTool } = require('./Analyze'); // or create a Tools module

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/web4ai/process', async (req, res) => {
  const { model, tool, input } = req.body;
  try {
    const result = await runTool(tool, input, model);
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
});

app.listen(3000, () => console.log('🚀 Web4AI backend running on port 3000'));
