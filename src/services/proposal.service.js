const fs = require("fs");
const path = require("path");
const { generateText } = require("./openai.service");

function loadPrompt(fileName) {
  return fs.readFileSync(path.join(__dirname, "../prompts", fileName), "utf-8");
}

function buildEvidenceText(retrievedEvidence) {
  return retrievedEvidence
    .map((e, idx) => {
      return `--- Evidence ${idx + 1} ---
Title: ${e.title}
Sector: ${e.sector}
Service Type: ${e.service_type}
Content:
${(e.content || "").substring(0, 2500)}
`;
    })
    .join("\n\n");
}

function buildCompanyResearchText(companyResearch) {
  if (!companyResearch || companyResearch.length === 0) return "";
  return companyResearch
    .map((info, idx) => {
      return `--- Company Research ${idx + 1} ---
Title: ${info.title}
URL: ${info.url}
Snippet: ${info.snippet}
`;
    })
    .join("\n\n");
}

async function generateFullProposal({ extractedText, requirementsJson, retrievedEvidence, rfpData, companyResearch }) {
  const evidenceText = buildEvidenceText(retrievedEvidence);
  const companyResearchText = buildCompanyResearchText(companyResearch);

  const baseContext = `
RFP TEXT:
${extractedText.substring(0, 12000)}

REQUIREMENTS JSON:
${JSON.stringify(requirementsJson, null, 2)}

RFP PARSED DATA:
${JSON.stringify(rfpData, null, 2)}

COMPANY RESEARCH:
${companyResearchText}

RETRIEVED PAST PROPOSALS EVIDENCE:
${evidenceText}
`;

  const executiveSummary = await generateText(
    loadPrompt("executiveSummary.txt"),
    baseContext
  );

  const clientUnderstanding = await generateText(
    loadPrompt("clientUnderstanding.txt"),
    baseContext
  );

  const approach = await generateText(loadPrompt("approach.txt"), baseContext);

  const governance = await generateText(loadPrompt("governance.txt"), baseContext);

  const whyUs = await generateText(loadPrompt("whyUs.txt"), baseContext);

  return `
==============================
AI GENERATED PROPOSAL DRAFT
==============================

1. EXECUTIVE SUMMARY
------------------------------
${executiveSummary}

2. CLIENT UNDERSTANDING
------------------------------
${clientUnderstanding}

3. PROPOSED APPROACH
------------------------------
${approach}

4. TEAM & GOVERNANCE
------------------------------
${governance}

5. WHY US / VALUE PROPOSITION
------------------------------
${whyUs}

==============================
END OF DOCUMENT
==============================
`;
}

module.exports = {
  generateFullProposal
};
