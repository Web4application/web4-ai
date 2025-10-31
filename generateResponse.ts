import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function uploadPDF(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const file = await client.files.create({
    file: fileStream,
    purpose: "user_data",
  });
  return file.id;
}

async function generateResponse(topic: string, fileId: string) {
  const response = await client.responses.create({
    model: "gpt-5",
    prompt: {
      id: "pmpt_abc123",
      variables: {
        topic,
        reference_pdf: {
          type: "input_file",
          file_id: fileId,
        },
      },
    },
  });
  return response.output_text;
}

(async () => {
  try {
    const pdfPath = path.join(__dirname, "../uploads/draconomicon.pdf");
    const fileId = await uploadPDF(pdfPath);
    const output = await generateResponse("Dragons", fileId);
    console.log("📝 Response:\n", output);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
