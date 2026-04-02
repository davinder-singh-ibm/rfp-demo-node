const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const path = require("path");
const { extractTextFromFileBuffer } = require("../services/parser.service");
const { createEmbedding } = require("../services/openai.service");

const {
  AZURE_SEARCH_ENDPOINT,
  AZURE_SEARCH_API_KEY,
  AZURE_SEARCH_INDEX_NAME
} = require("../config/env");

const searchClient = new SearchClient(
  AZURE_SEARCH_ENDPOINT,
  AZURE_SEARCH_INDEX_NAME,
  new AzureKeyCredential(AZURE_SEARCH_API_KEY)
);

async function run() {
  console.log("Indexing PDF files from uploads folder...");

  const uploadsDir = path.join(__dirname, "../../uploads");
  const files = fs.readdirSync(uploadsDir).filter(f => f.toLowerCase().endsWith(".pdf"));

  for (const fileName of files) {
    console.log("Processing:", fileName);

    const filePath = path.join(uploadsDir, fileName);
    const buffer = fs.readFileSync(filePath);

    const uploadFile = {
      originalname: fileName,
      buffer
    };

    const content = await extractTextFromFileBuffer(uploadFile);
    const embedding = await createEmbedding(content.substring(0, 4000));

    const doc = {
      id: uuidv4(),
      title: fileName,
      content: content.substring(0, 8000),
      sector: "demo",
      service_type: "demo",
      embedding
    };

    await searchClient.uploadDocuments([doc]);
    console.log("Indexed:", fileName);
  }

  console.log("Indexing complete.");
}

run().catch(console.error);