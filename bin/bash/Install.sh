pip install -r requirements.txt
while read -r module; do
    npm install "$module"
done < components.txt
python3 -m venv env
source env/bin/activate
python -m venv env
.\env\Scripts\activate
pip show Flask-Cors

