from flask import Flask, request, jsonify
from your_model_runner import run_tool

app = Flask(__name__)

@app.route('/web4ai/python', methods=['POST'])
def process():
    data = request.json
    result = run_tool(data['tool'], data['input'])
    return jsonify({ "output": result })

app.run(port=5000)
