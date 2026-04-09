const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const {
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_DEPLOYMENT,
  AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
  AZURE_OPENAI_API_VERSION
} = require("../config/env");

const client = new OpenAI({
  baseURL: `${AZURE_OPENAI_ENDPOINT}/openai/v1/`,
  apiKey: AZURE_OPENAI_API_KEY
});

function loadPrompt(fileName) {
  return fs.readFileSync(path.join(__dirname, "../prompts", fileName), "utf-8");
}

async function extractRequirements(rfpText) {
  const prompt = loadPrompt("extractRequirements.txt");
  const response = await client.chat.completions.create({
    model: AZURE_OPENAI_DEPLOYMENT,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: rfpText.substring(0, 15000) }
    ],
    temperature: 0.2
  });
  let content = response.choices[0].message.content.trim();
  
  // Strip markdown code blocks if present
  if (content.startsWith('```json')) {
    content = content.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
  } else if (content.startsWith('```')) {
    content = content.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  
  try {
    return JSON.parse(content.trim());
  } catch (error) {
    throw new Error("Azure OpenAI did not return valid JSON. Output was: " + content);
  }
}

async function createEmbedding(text) {
  const embedding = await client.embeddings.create({
    model: AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
    input: text.substring(0, 7000),
    encoding_format: "float"
  });
  return embedding.data[0].embedding;
}

async function extractCompanyName(rfpText) {
  const prompt = "Extract the name of the company or organization issuing this RFP from the following text. Return only the company name, nothing else.";
  const response = await client.chat.completions.create({
    model: AZURE_OPENAI_DEPLOYMENT,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: rfpText.substring(0, 2000) }
    ],
    temperature: 0.1
  });
  return response.choices[0].message.content.trim();
}

async function generateText(systemPrompt, userText) {
  const response = await client.chat.completions.create({
    model: AZURE_OPENAI_DEPLOYMENT,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText }
    ],
    temperature: 0.4
  });
  return response.choices[0].message.content;
}

module.exports = {
  extractRequirements,
  createEmbedding,
  generateText,
  extractCompanyName
};
