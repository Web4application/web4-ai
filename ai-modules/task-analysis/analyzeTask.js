const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

async function analyzeTask(taskDescription) {
  try {
    const response = await openai.createCompletion({
      model: "gpt-4",
      prompt: `Analyze the complexity and suggest possible improvements for the following task: ${taskDescription}`,
      max_tokens: 150,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error analyzing task:", error.message);
    throw new Error("AI Analysis Failed");
  }
}

module.exports = analyzeTask;
