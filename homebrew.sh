/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
pip install -r requirements.txt
[global]
find-links = https://github.com/mypyc/mypy_mypyc-wheels/releases/expanded_assets/v1.12.0+dev.b2deaaecf1a11e13bc962558992b5f2d5701f295
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

pip install -r requirements.txt

sudo apt update && sudo apt install python3-pip nginx certbot python3-certbot-nginx
pip3 install fastapi uvicorn

uvicorn main:app --host 0.0.0.0 --port 8000

sudo certbot --nginx -d api.web4ai.app

ln -s /etc/nginx/sites-available/web4ai /etc/nginx/sites-enabled/
nginx -t
sudo systemctl restart nginx 

🌐 Web4AI Refactor CLI 🚀
Refactor, comment, and document code using AI

Usage:
  web4ai-refactor <path> [options]

Options:
  --refactor       Run AI-based refactoring
  --comment        Add smart inline comments
  --docgen         Generate documentation
  --unit-test      Scaffold unit tests
  --offline        Use WebLLM instead of GPT-4

  npx web4ai-refactor src/
# or with options
web4ai-refactor src/ --refactor --comment --docgen