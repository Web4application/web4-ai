# Web4AI Project Assistant

A lightweight, browser-based AI assistant designed to help you refactor, document, analyze, and organize your code using both online (GPT-4) and offline (WebLLM) AI models.

## Features

- **AI Refactor & Format**: Improve code structure and readability.
- **Auto Documentation**: Generate readable documentation.
- **Unit Test Generator**: Quickly scaffold unit tests.
- **Code Commenting**: Add smart inline comments.
- **Offline AI Mode**: Use WebLLM (Llama-3) when GPT is unavailable.
- **File Syncing**: Save to/load from local storage.
- **ZIP Download**: Export your full AI-enhanced project.

## How It Works

1. Upload files via the browser.
2. Choose your AI options (online GPT or WebLLM).
3. Run transformations (refactor, document, etc.).
4. View results, save to local storage, or download everything.

## Live Technologies

- JavaScript (Vanilla)
- Web APIs (FileReader, LocalStorage)
- WebLLM (Offline AI)
- GPT-4 (Online AI via OpenAI)
- JSZip (for ZIP downloads)
- localForage (storage abstraction)

## Getting Started

Clone the repo:
```bash
git clone https://github.com/Web4application/Web4AI_Project_Assistant.git
cd Web4AI_Project_Assistant
```

Then open `index.html` in your browser.

## File Structure

```
Web4AI_Project_Assistant/
├── index.html        # Main UI
├── assistant.js      # Core logic and AI features
├── style.css         # UI styling
```

## Dependencies

Loaded via CDN in `index.html`:
- [JSZip](https://stuk.github.io/jszip/)
- [localForage](https://localforage.github.io/localForage/)
- [WebLLM](https://mlc.ai/web-llm/)

## License

MIT LICENCE
