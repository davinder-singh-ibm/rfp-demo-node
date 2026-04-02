const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { generateText } = require("./openai.service");
const fs = require("fs");
const path = require("path");

function loadPrompt(fileName) {
  return fs.readFileSync(path.join(__dirname, "../prompts", fileName), "utf-8");
}

async function extractTextFromFileBuffer(file) {
  const ext = file.originalname.toLowerCase();

  if (ext.endsWith(".pdf")) {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (ext.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Only PDF and DOCX supported.");
}

async function parseRFP(rfpText) {
  const prompt = loadPrompt("rfpParser.txt");
  const response = await generateText(prompt, rfpText.substring(0, 15000));
  console.log("Raw OpenAI response for parseRFP:", response); // Debug log
  try {
    if (!response || response.trim() === '') {
      throw new Error("OpenAI returned empty response");
    }
    // Remove markdown code block formatting if present
    let cleanedResponse = response.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    console.log("Cleaned response for parseRFP:", cleanedResponse); // Debug log
    if (!cleanedResponse || cleanedResponse.trim() === '') {
      throw new Error("Response became empty after cleaning");
    }
    // Try to find JSON if there are extra characters
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("JSON parse error in parseRFP:", error.message);
    console.error("Attempted to parse:", cleanedResponse);
    throw new Error("Failed to parse RFP. Output was: " + response + ". Error: " + error.message);
  }
}

async function checkCompliance(rfpText) {
  const prompt = loadPrompt("complianceChecker.txt");
  const response = await generateText(prompt, rfpText.substring(0, 15000));
  console.log("Raw OpenAI response for checkCompliance:", response); // Debug log
  try {
    if (!response || response.trim() === '') {
      throw new Error("OpenAI returned empty response");
    }
    // Remove markdown code block formatting if present
    let cleanedResponse = response.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    console.log("Cleaned response for checkCompliance:", cleanedResponse); // Debug log
    if (!cleanedResponse || cleanedResponse.trim() === '') {
      throw new Error("Response became empty after cleaning");
    }
    // Try to find JSON if there are extra characters
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("JSON parse error in checkCompliance:", error.message);
    console.error("Attempted to parse:", cleanedResponse);
    throw new Error("Failed to check compliance. Output was: " + response + ". Error: " + error.message);
  }
}

module.exports = {
  extractTextFromFileBuffer,
  parseRFP,
  checkCompliance
};