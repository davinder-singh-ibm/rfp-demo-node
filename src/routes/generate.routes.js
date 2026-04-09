const express = require("express");

const { extractRequirements, extractCompanyName } = require("../services/openai.service");
const { searchSimilarProposals } = require("../services/search.service");
const { generateFullProposal } = require("../services/proposal.service");
const { uploadToBlob } = require("../services/blob.service");
const { parseRFP, checkCompliance } = require("../services/parser.service");
const { researchCompany } = require("../services/websearch.service");


const router = express.Router();

/**
 * @openapi
 * /api/generate:
 *   post:
 *     tags:
 *       - Proposal Generation
 *     summary: Generate a full proposal from extracted RFP text
 *     description: >
 *       This endpoint orchestrates the full proposal generation workflow using
 *       extracted RFP text.
 *
 *       It parses deadlines and criteria, checks compliance, extracts structured
 *       requirements, performs optional company research, retrieves similar past
 *       proposals, and generates a complete proposal document.
 *
 *       This route exists as the primary entry point for automated proposal generation.
 *       An MCP server can infer that this endpoint coordinates multiple AI services.
 *     operationId: generateProposal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - extractedText
 *             properties:
 *               extractedText:
 *                 type: string
 *                 description: Full extracted plain text of the RFP
 *           examples:
 *             basic:
 *               summary: Typical request
 *               value:
 *                 extractedText: "The client seeks a cloud migration partner..."
 *             edgeCase:
 *               summary: "Edge case: minimal text"
 *               value:
 *                 extractedText: "RFP for cafeteria services."
 *     responses:
 *       200:
 *         description: Proposal generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                   nullable: true
 *                 rfpData:
 *                   type: object
 *                 compliance:
 *                   type: object
 *                 requirementsJson:
 *                   type: object
 *                 companyResearch:
 *                   type: array
 *                   items:
 *                     type: object
 *                 retrievedEvidence:
 *                   type: array
 *                   items:
 *                     type: object
 *                 proposal:
 *                   type: string
 *                 savedAs:
 *                   type: string
 *       400:
 *         description: Missing or invalid extractedText, or compliance score below threshold
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 compliance_score:
 *                   type: number
 *                 missing_sections:
 *                   type: array
 *                   items:
 *                     type: string
 *                 present_sections:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal error during proposal generation
 *     x-sideEffects:
 *       - Calls AI services for extraction and generation
 *       - Calls semantic search
 *       - Writes proposal output to Blob Storage
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/", async (req, res) => {
  try {
    const { extractedText } = req.body;

    if (!extractedText) {
      return res.status(400).json({ error: "extractedText is required" });
    }

    // Step 1: Parse RFP for criteria and deadlines
    const rfpData = await parseRFP(extractedText);

    // Step 2: Check compliance for missing sections
    const compliance = await checkCompliance(extractedText);
    const {
      compliance_score = 0,
      missing_sections = [],
      present_sections = []
    } = compliance;

    // Validate compliance score threshold
    if (compliance_score < 80) {
      return res.status(400).json({
        error: "RFP compliance score is below the minimum threshold",
        compliance_score,
        missing_sections,
        present_sections
      });
    }

    // Step 3: Extract structured requirements
    const requirementsJson = await extractRequirements(extractedText);

    // Step 4: Extract company name and research it
    const companyName = await extractCompanyName(extractedText);
    let companyResearch = [];
    if (companyName) {
      try {
        companyResearch = await researchCompany(companyName);
      } catch (error) {
        console.warn(`Company research failed: ${error.message}`);
        // Continue without company research
      }
    }

    // Step 5: Retrieve similar past proposals
    const retrievedEvidence = await searchSimilarProposals(
      requirementsJson.industry || "",
      extractedText
    );

    // Step 6: Generate proposal sections
    const proposal = await generateFullProposal({
      extractedText,
      requirementsJson,
      retrievedEvidence,
      rfpData,
      companyResearch
    });

    // Step 7: Save to Blob
    const outputBlobName = `proposal-${Date.now()}.txt`;
    await uploadToBlob("output", outputBlobName, Buffer.from(proposal, "utf-8"));

    res.json({
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
    console.error("Generate error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;