// assistant.js — API-connected AI logic

const AppState = {
  selectedModel: localStorage.getItem('selectedModel') || 'gpt-4',
  loadedFiles: [],
  activeTool: 'refactor'
};

// Load and show uploaded files
function loadFiles(files) {
  AppState.loadedFiles = Array.from(files);
  const list = document.getElementById('fileList');
  list.innerHTML = '';
  AppState.loadedFiles.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file.name;
    list.appendChild(li);
  });
}

// Call backend API for AI processing
async function runAIOnFile(toolType, fileContent) {
  const response = await fetch('https://your-backend-api.com/web4ai/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AppState.selectedModel,
      tool: toolType,
      input: fileContent
    })
  });

  const result = await response.json();
  return result.output;
}

// Simulate a sample call (replace with real content)
async function previewAITool(tool = 'refactor') {
  const sampleCode = 'var total = amount * rate;';
  const output = await runAIOnFile(tool, sampleCode);
  const outElem = document.getElementById('outputText');
  if (outElem) outElem.textContent = output;
}

// Voice command (optional)
function startVoiceTrigger() {
  const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = async event => {
    const command = event.results[0][0].transcript.toLowerCase();
    if (command.includes('refactor')) await previewAITool('refactor');
    if (command.includes('comment')) await previewAITool('comment');
    if (command.includes('docs')) await previewAITool('docs');
    if (command.includes('test')) await previewAITool('tests');
  };
  recognition.start();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fileInput')?.addEventListener('change', e => loadFiles(e.target.files));
  previewAITool();
});
