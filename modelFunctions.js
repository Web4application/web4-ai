// modelFunctions.js
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

async function callGPT4(model = 'gpt-4', tool, inputText) {
  const promptMap = {
    refactor: `Refactor this code for readability:\n${inputText}`,
    comment: `Add inline comments to this code:\n${inputText}`,
    docs: `Generate documentation for this code:\n${inputText}`,
    tests: `Create unit tests for this function:\n${inputText}`
  };

  const response = await openai.createChatCompletion({
    model,
    messages: [{ role: 'user', content: promptMap[tool] }],
    temperature: 0.7
  });

  return response.data.choices[0].message.content.trim();
}

module.exports = { callGPT4 };
