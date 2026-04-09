const express = require("express");

const { extractRequirements, extractCompanyName } = require("../services/openai.service");
const { searchSimilarProposals } = require("../services/search.service");
const { generateFullProposal } = require("../services/proposal.service");
const { uploadToBlob } = require("../services/blob.service");
const { parseRFP, checkCompliance } = require("../services/parser.service");
const { researchCompany } = require("../services/websearch.service");

const router = express.Router();

/**
 * SSE endpoint for real-time proposal generation with progress tracking
 */
router.post("/", async (req, res) => {
  try {
    const { extractedText } = req.body;

    if (!extractedText) {
      return res.status(400).json({ error: "extractedText is required" });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Helper function to send progress updates
    const sendProgress = (step, percentage, message) => {
      res.write(`data: ${JSON.stringify({ step, percentage, message })}\n\n`);
    };

    // Helper function to send final result
    const sendComplete = (data) => {
      res.write(`data: ${JSON.stringify({ type: 'complete', data })}\n\n`);
      res.end();
    };

    // Helper function to send error
    const sendError = (error) => {
      res.write(`data: ${JSON.stringify({ type: 'error', error })}\n\n`);
      res.end();
    };

    try {
      // Step 1: Parse RFP (0-15%)
      sendProgress(1, 5, "Parsing RFP document...");
      const rfpData = await parseRFP(extractedText);
      sendProgress(1, 15, "RFP parsed successfully");

      // Step 2: Check compliance (15-25%)
      sendProgress(2, 18, "Checking compliance...");
      const compliance = await checkCompliance(extractedText);
      const {
        compliance_score = 0,
        missing_sections = [],
        present_sections = []
      } = compliance;

      sendProgress(2, 25, `Compliance check complete (Score: ${compliance_score}%)`);

      // Validate compliance score threshold
      if (compliance_score < 80) {
        sendError({
          message: "RFP compliance score is below the minimum threshold",
          compliance_score,
          missing_sections,
          present_sections
        });
        return;
      }

      // Step 3: Extract requirements (25-35%)
      sendProgress(3, 28, "Extracting structured requirements...");
      const requirementsJson = await extractRequirements(extractedText);
      sendProgress(3, 35, "Requirements extracted successfully");

      // Step 4: Company research (35-50%)
      sendProgress(4, 38, "Identifying company name...");
      const companyName = await extractCompanyName(extractedText);
      let companyResearch = [];
      
      if (companyName) {
        sendProgress(4, 42, `Researching ${companyName}...`);
        try {
          companyResearch = await researchCompany(companyName);
          sendProgress(4, 50, "Company research completed");
        } catch (error) {
          console.warn(`Company research failed: ${error.message}`);
          sendProgress(4, 50, "Continuing without company research");
        }
      } else {
        sendProgress(4, 50, "No company name found, skipping research");
      }

      // Step 5: Retrieve similar proposals (50-60%)
      sendProgress(5, 52, "Searching for similar past proposals...");
      const retrievedEvidence = await searchSimilarProposals(
        requirementsJson.industry || "",
        extractedText
      );
      sendProgress(5, 60, `Found ${retrievedEvidence.length} similar proposals`);

      // Step 6: Generate proposal sections (60-90%)
      sendProgress(6, 62, "Generating Executive Summary...");
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI update
      
      sendProgress(6, 70, "Generating Client Understanding...");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      sendProgress(6, 78, "Generating Proposed Approach...");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      sendProgress(6, 85, "Generating Team & Governance...");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      sendProgress(6, 90, "Generating Value Proposition...");
      
      const proposal = await generateFullProposal({
        extractedText,
        requirementsJson,
        retrievedEvidence,
        rfpData,
        companyResearch
      });

      // Step 7: Save to Blob (90-100%)
      sendProgress(7, 92, "Saving proposal to storage...");
      const outputBlobName = `proposal-${Date.now()}.txt`;
      await uploadToBlob("output", outputBlobName, Buffer.from(proposal, "utf-8"));
      sendProgress(7, 100, "Proposal saved successfully");

      // Send complete result
      sendComplete({
        message: "Proposal generated successfully",
        companyName,
        rfpData,
        compliance,
        requirementsJson,
        companyResearch,
        retrievedEvidence,
        proposal,
        savedAs: outputBlobName
      });

    } catch (err) {
      console.error("Generate stream error:", err);
      sendError(err.message);
    }

  } catch (err) {
    console.error("Generate stream setup error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Made with Bob
