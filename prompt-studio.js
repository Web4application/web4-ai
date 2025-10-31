async function sendPrompt() {
  const topic = document.getElementById("topic").value;
  const file = document.getElementById("pdf").files[0];
  const template = document.getElementById("template").value;

  if (!topic || !file || !template) {
    document.getElementById("output").textContent = "⚠️ Please fill in all fields.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("topic", topic);
  formData.append("template", template);

  try {
    const res = await fetch("https://chat-gpt-web4-l7k6oqluq-web4era.vercel.app/api/prompt", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    document.getElementById("output").textContent = data.response || "[No response]";
  } catch (err) {
    document.getElementById("output").textContent = "⚠️ Error connecting to backend.";
  }
}
