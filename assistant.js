
let projectFiles = [];
let isOnlineAI = true;  // Flag to toggle between online/offline AI

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

async function runAIRefactor() {
  for (let i = 0; i < projectFiles.length; i++) {
    const refactored = isOnlineAI ? 
      await realAIRefactor(projectFiles[i].code) : 
      await localAIRefactor(projectFiles[i].code);
    projectFiles[i].code = refactored;
    projectFiles[i].status = 'refactored';
  }
  displayOutput();
}

async function realAIRefactor(code) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENAI_KEY_HERE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a senior developer.' },
        { role: 'user', content: 'Refactor and optimize this code:\n\n' + code }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function localAIRefactor(code) {
  const chat = await webllm.createChat();
  await chat.reload("Llama-3-8B-Instruct"); // Load Llama model
  const reply = await chat.generate("Refactor and optimize this code:
" + code);
  return reply;
}

function toggleAI() {
  isOnlineAI = !isOnlineAI;
  alert(isOnlineAI ? 'Switched to Online AI (GPT)' : 'Switched to Offline AI (WebLLM)');
}

function displayOutput() {
  const output = document.getElementById('output');
  output.textContent = projectFiles.map(f => `// ${f.name}\n${f.code}\n`).join('\n\n');
}

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

function saveToLocal() {
  localforage.setItem('my_project_files', projectFiles).then(() => {
    alert('Saved locally!');
  });
}

function loadFromLocalStorage() {
  localforage.getItem('my_project_files').then(data => {
    if (data) {
      projectFiles = data;
      displayOutput();
    } else {
      alert('No saved project found.');
    }
  });
}
