const express = require("express");
const { searchSimilarProposals } = require("../services/search.service");
const { downloadBlob } = require("../services/blob.service");
const { extractTextFromFileBuffer } = require("../services/parser.service");


const router = express.Router();

/**
 * @openapi
 * /api/proposals/retrieve:
 *   post:
 *     tags:
 *       - Proposals
 *     summary: Retrieve similar past proposals
 *     description: >
 *       Uses semantic similarity search to find past proposals relevant
 *       to the provided RFP text and optional industry.
 *
 *       This route exists to support proposal research and reuse.
 *     operationId: retrieveSimilarProposals
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
 *               industry:
 *                 type: string
 *                 description: Optional industry filter (e.g., "healthcare", "finance")
 *           examples:
 *             basic:
 *               summary: Typical retrieval request
 *               value:
 *                 extractedText: "Request for Proposal for cloud migration services..."
 *                 industry: "technology"
 *     responses:
 *       200:
 *         description: List of similar proposals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 industry:
 *                   type: string
 *                   nullable: true
 *                 proposals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       similarityScore:
 *                         type: number
 *                       content:
 *                         type: string
 *       400:
 *         description: Missing extractedText
 *       500:
 *         description: Search service failure
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/retrieve", async (req, res) => {
  try {
    const { extractedText, industry } = req.body;
    if (!extractedText || typeof extractedText !== "string") {
      return res.status(400).json({ error: "Missing extractedText in request body" });
    }

    const proposals = await searchSimilarProposals(industry, extractedText);
    res.json({ industry: industry || null, proposals });
  } catch (err) {
    console.error("Proposals /retrieve error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/proposals/retrieve-from-blob:
 *   post:
 *     tags:
 *       - Proposals
 *     summary: Retrieve similar proposals from blob-stored RFP
 *     description: >
 *       Downloads an RFP file from blob storage, extracts its text,
 *       and retrieves similar past proposals using semantic search.
 *     operationId: retrieveSimilarProposalsFromBlob
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blobName
 *             properties:
 *               blobName:
 *                 type: string
 *                 description: Name of the blob file in incoming container
 *               industry:
 *                 type: string
 *                 description: Optional industry filter (e.g., "healthcare", "finance")
 *           examples:
 *             basic:
 *               summary: Typical blob retrieval request
 *               value:
 *                 blobName: "123e4567-RFP.pdf"
 *                 industry: "healthcare"
 *     responses:
 *       200:
 *         description: List of similar proposals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blobName:
 *                   type: string
 *                 industry:
 *                   type: string
 *                   nullable: true
 *                 proposals:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing blobName
 *       500:
 *         description: Blob download or search failure
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/retrieve-from-blob", async (req, res) => {
  try {
    const { blobName, industry } = req.body;
    if (!blobName || typeof blobName !== "string") {
      return res.status(400).json({ error: "Missing blobName in request body" });
    }

    const buffer = await downloadBlob("incoming", blobName);
    const file = { originalname: blobName, buffer };
    const extractedText = await extractTextFromFileBuffer(file);

    const proposals = await searchSimilarProposals(industry, extractedText);
    res.json({ blobName, industry: industry || null, proposals });
  } catch (err) {
    console.error("Proposals /retrieve-from-blob error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
