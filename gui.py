import streamlit as st
import requests
import os
import json
import time
from io import BytesIO
import pandas as pd

# ------------------------------
# Page setup
# ------------------------------
st.set_page_config(
    page_title="Congen AI",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🤖 Congen AI Chat")
st.write("Interactive GPT-5 chat with Markdown & code rendering!")

# ------------------------------
# API Settings
# ------------------------------
GPT5_API_URL = os.getenv("GPT5_API_URL", "https://api.yourgpt5.com/v1/generate")
GPT5_API_KEY = os.getenv("GPT5_API_KEY", "")

GPT4_API_URL = os.getenv("GPT4_API_URL", "https://api.yourgpt4.com/v1/generate")
GPT4_API_KEY = os.getenv("GPT4_API_KEY", "")

HISTORY_FILE = "chat_history.json"

# ------------------------------
# Load or initialize history
# ------------------------------
if "history" not in st.session_state:
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            st.session_state.history = json.load(f)
    else:
        st.session_state.history = []

# ------------------------------
# Functions
# ------------------------------
def query_ai(prompt: str, model: str = "GPT-5") -> str:
    """Send prompt to selected AI model and return the response."""
    if model == "GPT-5":
        url = GPT5_API_URL
        key = GPT5_API_KEY
    elif model == "GPT-4":
        url = GPT4_API_URL
        key = GPT4_API_KEY
    else:
        return "Model not supported."

    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"prompt": prompt, "max_tokens": 500}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "No response from AI.")
    except Exception as e:
        return f"Error: {e}"

def save_history():
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(st.session_state.history, f, ensure_ascii=False, indent=2)

def download_history(format: str = "json"):
    if format == "json":
        return BytesIO(json.dumps(st.session_state.history, ensure_ascii=False, indent=2).encode())
    elif format == "csv":
        df = pd.DataFrame(st.session_state.history)
        return BytesIO(df.to_csv(index=False).encode())
    return None

def display_message(sender: str, message: str):
    """Display a message with color coding and Markdown support."""
    if sender == "User":
        st.markdown(
            f"<div style='text-align:right; background-color:#DCF8C6; padding:10px; border-radius:10px;'>{message}</div>", 
            unsafe_allow_html=True
        )
    else:
        st.markdown(
            f"<div style='text-align:left; background-color:#E6E6FA; padding:10px; border-radius:10px;'>{message}</div>", 
            unsafe_allow_html=True
        )

# ------------------------------
# Sidebar
# ------------------------------
model = st.sidebar.selectbox("Choose AI Model:", ["GPT-5", "GPT-4"])
if st.sidebar.button("Clear History"):
    st.session_state.history = []
    save_history()
    st.experimental_rerun()

st.sidebar.markdown("### Download History")
col1, col2 = st.sidebar.columns(2)
with col1:
    st.download_button(
        label="Download JSON",
        data=download_history("json"),
        file_name="chat_history.json",
        mime="application/json"
    )
with col2:
    st.download_button(
        label="Download CSV",
        data=download_history("csv"),
        file_name="chat_history.csv",
        mime="text/csv"
    )

# ------------------------------
# Main UI
# ------------------------------
user_input = st.text_area("Type your message here:")

if st.button("Send"):
    if user_input.strip() == "":
        st.warning("Please enter a message!")
    else:
        # Save user message
        st.session_state.history.append({"sender": "User", "prompt": user_input, "response": None})
        save_history()

        # Display user message
        display_message("User", user_input)

        # Simulate AI typing
        with st.spinner(f"{model} is typing…"):
            time.sleep(1)
            ai_response = query_ai(user_input, model=model)
            # Render markdown/code
            ai_response_md = ai_response.replace("\n", "  \n")
            st.session_state.history[-1]["response"] = ai_response_md
            save_history()
        
        # Display AI response
        display_message("AI", ai_response_md)

# ------------------------------
# Display conversation history
# ------------------------------
if st.session_state.history:
    st.subheader("Conversation History")
    for item in st.session_state.history[::-1]:
        if item.get("prompt"):
            display_message("User", item["prompt"])
        if item.get("response"):
            display_message("AI", item["response"])
