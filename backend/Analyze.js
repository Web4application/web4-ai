const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

async function runTool(tool, input, model) {
  const prompt = {
    refactor: `Refactor this:\n${input}`,
    comment: `Comment this code:\n${input}`,
    docs: `Generate docs:\n${input}`,
    tests: `Create tests:\n${input}`
  };
  const response = await openai.createChatCompletion({
    model,
    messages: [{ role: 'user', content: prompt[tool] }],
    temperature: 0.7
  });
  return response.data.choices[0].message.content.trim();
}

module.exports = { runTool };
