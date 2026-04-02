const { BING_SEARCH_SUBSCRIPTION_KEY, BING_SEARCH_ENDPOINT } = require("../config/env");

async function searchWeb(query, count = 10) {
  const url = `${BING_SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&count=${count}&responseFilter=Webpages`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': BING_SEARCH_SUBSCRIPTION_KEY
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bing Search API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    const responseText = await response.text();
    throw new Error(`Failed to parse Bing Search API response as JSON. Response: ${responseText}`);
  }

  return data.webPages ? data.webPages.value : [];
}

async function researchCompany(companyName) {
  // Check if Bing Search is configured
  if (!BING_SEARCH_SUBSCRIPTION_KEY) {
    console.warn('Bing Search subscription key not configured. Skipping company research.');
    return [];
  }

  const query = `${companyName} company information news recent developments`;
  const results = await searchWeb(query, 5);

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