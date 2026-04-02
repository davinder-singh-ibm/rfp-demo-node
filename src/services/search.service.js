const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
const {
  AZURE_SEARCH_ENDPOINT,
  AZURE_SEARCH_API_KEY,
  AZURE_SEARCH_INDEX_NAME
} = require("../config/env");

const { createEmbedding } = require("./openai.service");

const searchClient = new SearchClient(
  AZURE_SEARCH_ENDPOINT,
  AZURE_SEARCH_INDEX_NAME,
  new AzureKeyCredential(AZURE_SEARCH_API_KEY)
);

async function searchSimilarProposals(industry, rfpText) {
  const embedding = await createEmbedding(rfpText.substring(0, 4000));

  const results = [];
  const searchResults = await searchClient.search("", {
    top: 5,
    vectorSearchOptions: {
      queries: [
        {
          kind: "vector",
          vector: embedding,
          kNearestNeighborsCount: 5,
          fields: ["embedding"]
        }
      ]
    },
    select: ["id", "title", "content", "sector", "service_type"]
  });

  for await (const item of searchResults.results) {
    results.push(item.document);
  }

  return results;
}

module.exports = {
  searchSimilarProposals
};
