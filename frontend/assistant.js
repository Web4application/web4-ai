async function runAITask(tool, input) {
  const model = localStorage.getItem('selectedModel') || 'gpt-4';
  const isOnline = navigator.onLine;

  if (isOnline && model === 'gpt-4') {
    // 🌐 Node.js GPT-4 route
    const res = await fetch('http://localhost:3000/web4ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, tool, input })
    });
    const data = await res.json();
    return data.output;
  } else if (model.endsWith('.bin')) {
    // 🌙 WebLLM browser inference
    const webllm = await WebLLM.create();
    const prompt = `${tool} this:\n${input}`;
    const result = await webllm.chat(prompt, { model });
    return result.output;
  } else {
    // 🐍 Python backend fallback
    const res = await fetch('http://localhost:5000/web4ai/python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, input })
    });
    const data = await res.json();
    return data.output;
  }
}

async function runAITask(tool, inputCode) {
  const model = AppState.selectedModel;

  if (navigator.onLine && model.includes('gpt')) {
    // Online: Node.js backend with GPT-4
    const res = await fetch('http://localhost:3000/web4ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, tool, input: inputCode })
    });
    const data = await res.json();
    return data.output;
  } else if (model.includes('.bin')) {
    // Offline: WebLLM local model
    const webllm = await WebLLM.create();
    const prompt = `${tool.toUpperCase()} this code:\n${inputCode}`;
    const result = await webllm.chat(prompt, { model });
    return result.output;
  } else {
    // Fallback: Python backend (Flask)
    const res = await fetch('http://localhost:5000/web4ai/python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, input: inputCode })
    });
    const data = await res.json();
    return data.output;
  }
}
