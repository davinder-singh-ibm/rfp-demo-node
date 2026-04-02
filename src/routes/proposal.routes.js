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
 *             properties:
 *               extractedText:
 *                 type: string
 *               industry:
 *                 type: string
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
 *       - {}
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
