const { TAVILY_API_KEY } = require("../config/env");

async function searchWeb(query, count = 10) {
  const url = 'https://api.tavily.com/search';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query: query,
      search_depth: 'advanced',
      include_images: false,
      include_answer: false,
      include_raw_content: false,
      max_results: count,
      include_domains: [],
      exclude_domains: []
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tavily Search API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    const responseText = await response.text();
    throw new Error(`Failed to parse Tavily Search API response as JSON. Response: ${responseText}`);
  }

  return data.results ? data.results.map(result => ({
    name: result.title,
    url: result.url,
    snippet: result.content,
    displayUrl: result.url
  })) : [];
}

async function researchCompany(companyName) {
  // Check if Tavily Search is configured
  if (!TAVILY_API_KEY) {
    console.warn('Tavily API key not configured. Skipping company research.');
    return [];
  }

  const query = `${companyName} company information news recent developments`;
  
  const results = await searchWeb(query, 1);

  // Extract relevant information
  const companyInfo = results.map(result => ({
    title: result.name,
    url: result.url,
    snippet: result.snippet,
    displayUrl: result.displayUrl
  }));

  return companyInfo;
}

module.exports = {
  searchWeb,
  researchCompany
};