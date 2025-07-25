let projectFiles = [];
let isOnlineAI = true;  // Flag to toggle between online/offline AI

// Handle file input and load files into projectFiles
document.getElementById('fileInput').addEventListener('change', (e) => {
  const files = e.target.files;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      projectFiles.push({
        name: file.name,
        code: e.target.result
      });
      displayOutput();
    };
    reader.readAsText(file);
  }
});

// Function to trigger refactoring of code using either online or offline AI
async function runAIRefactor() {
  for (let i = 0; i < projectFiles.length; i++) {
    try {
      const refactored = isOnlineAI ? 
        await realAIRefactor(projectFiles[i].code) : 
        await localAIRefactor(projectFiles[i].code);
        
      projectFiles[i].code = refactored;
      projectFiles[i].status = 'refactored';

      // Optional: Add more processing like complexity analysis, documentation, etc.
      await additionalProcessing(projectFiles[i]);

    } catch (error) {
      console.error(`Error refactoring file ${projectFiles[i].name}:`, error);
    }
  }
  displayOutput();
}

// Function for refactoring using OpenAI's GPT model (online)
async function realAIRefactor(code) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY', // Use environment variables to store keys securely
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a senior developer.' },
          { role: 'user', content: 'Refactor and optimize this code:\\n\\n' + code }
        ]
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error during OpenAI request:', error);
    throw new Error('Failed to get refactored code from OpenAI');
  }
}

// Function for local AI refactoring (offline using WebLLM)
async function localAIRefactor(code) {
  try {
    const chat = await webllm.createChat();
    await chat.reload("Llama-3-8B-Instruct"); // Load Llama model
    const reply = await chat.generate("Refactor and optimize this code:\n" + code);
    return reply;
  } catch (error) {
    console.error('Error during local AI refactoring:', error);
    throw new Error('Failed to get refactored code from local AI');
  }
}

// Optional: Additional processing functions like complexity analysis, documentation generation, etc.
async function additionalProcessing(file) {
  // Example: Generate documentation for refactored code
  const doc = await generateDocumentation(file.code);
  console.log(`Generated documentation for ${file.name}:`, doc);
  
  // Example: Generate unit tests for refactored code
  const tests = await generateUnitTests(file.code);
  console.log(`Generated unit tests for ${file.name}:`, tests);

  // Update file status to reflect additional processing
  file.status = 'refactored and documented';
}

// Function to display the output of the current project files
function displayOutput() {
  const output = document.getElementById('output');
  output.textContent = projectFiles.map(f => `// ${f.name}\n${f.code}\n`).join('\n\n');
}

// Function to download the refactored project as a ZIP file
function downloadProject() {
  const zip = new JSZip();
  projectFiles.forEach(file => {
    zip.file(file.name, file.code);
  });
  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = "refactored_project.zip";
    a.click();
  });
}

// Function to save the project files locally using localForage
function saveToLocal() {
  localforage.setItem('my_project_files', projectFiles).then(() => {
    alert('Saved locally!');
  }).catch(err => {
    console.error("Error saving to local storage:", err);
  });
}

// Function to load the project files from local storage
function loadFromLocalStorage() {
  localforage.getItem('my_project_files').then(data => {
    if (data) {
      projectFiles = data;
      displayOutput();
    } else {
      alert('No saved project found.');
    }
  }).catch(err => {
    console.error("Error loading from local storage:", err);
  });
}

// Function to generate documentation for code using AI
async function generateDocumentation(code) {
  const docPrompt = `Generate documentation for the following code:\n\n${code}`;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY', // Use environment variables to store keys securely
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert software documentation generator.' },
        { role: 'user', content: docPrompt }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Function to generate unit tests for code
async function generateUnitTests(code) {
  const testPrompt = `Generate unit tests for the following code using the appropriate testing framework (e.g., Jest, Mocha):\n\n${code}`;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY', // Use environment variables to store keys securely
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a test generation AI.' },
        { role: 'user', content: testPrompt }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// assistant.js – Core AI logic for Web4AI

// Global app state
const AppState = {
  selectedModel: localStorage.getItem('selectedModel') || 'llama2-7b-chat.ggmlv3.q4_0.bin',
  loadedFiles: [],
  activeTool: null
};

// Load and display files
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

// AI simulation engine
function runAITool(tool, content) {
  switch (tool) {
    case 'refactor':
      return content.replace(/var/g, 'let').concat('\n// Refactored by Web4AI');
    case 'comment':
      return `// Auto-commented:\n` + content;
    case 'docs':
      return `/**\n * AI-generated documentation\n */\n` + content;
    case 'tests':
      return `describe("AI-generated test", () => {\n  it("should behave correctly", () => {\n    // test logic here\n  });\n});`;
    default:
      return '// No matching AI tool';
  }
}

// Simulate output preview
function previewAITool(toolType = 'refactor') {
  const sample = 'var result = amount * rate;';
  const output = runAITool(toolType, sample);
  const outElem = document.getElementById('outputText');
  if (outElem) outElem.textContent = output;
}

// Voice command binding (optional)
function setupVoiceTrigger() {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return;
  const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = event => {
    const command = event.results[0][0].transcript.toLowerCase();
    if (command.includes('generate docs')) previewAITool('docs');
    if (command.includes('unit test')) previewAITool('tests');
    if (command.includes('refactor code')) previewAITool('refactor');
  };
  recognition.start();
}

// On DOM load
document.addEventListener('DOMContentLoaded', () => {
  previewAITool(); // default preview
  document.getElementById('fileInput')?.addEventListener('change', e => loadFiles(e.target.files));
});

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

// assistant.js

// Store app state
const AppState = {
  selectedModel: localStorage.getItem('selectedModel') || 'llama2-7b-chat.ggmlv3.q4_0.bin',
  loadedFiles: [],
  activeTool: null
};

// Initialize file loader
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

// AI simulation engine
function runAITool(toolType, fileContent) {
  switch (toolType) {
    case 'comment':
      return `// 🔍 AI Suggestion: Add comments to ${fileContent.slice(0, 20)}...`;
    case 'refactor':
      return fileContent.replace(/var/g, 'let');
    case 'docs':
      return `/**\n * Function description generated by AI\n */\n` + fileContent;
    case 'tests':
      return `test('${fileContent}', () => {/* AI test scaffold */})`;
    default:
      return '// AI did not recognize this tool';
  }
}

// Example usage hook for AI preview
function simulateAIPreview() {
  const exampleCode = 'var total = amount * rate;';
  const preview = runAITool('refactor', exampleCode);
  document.getElementById('outputText').textContent = preview;
}

// Trigger AI processing (wire to buttons)
document.addEventListener('DOMContentLoaded', () => {
  simulateAIPreview(); // initial preview
});
