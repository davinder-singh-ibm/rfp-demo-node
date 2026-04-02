const express = require("express");
const {
  extractTextFromFileBuffer,
  parseRFP,
  checkCompliance
} = require("../services/parser.service");
const { downloadBlob } = require("../services/blob.service");


const router = express.Router();

/**
 * @openapi
 * /api/parser/parse:
 *   post:
 *     tags:
 *       - RFP Parsing
 *     summary: Parse extracted RFP text into structured metadata
 *     description: >
 *       Parses extracted RFP text and returns structured metadata such as
 *       deadlines and evaluation criteria.
 *
 *       This route exists to convert unstructured text into machine-readable data.
 *     operationId: parseRFPText
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extractedText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parsed RFP metadata
 *       400:
 *         description: Missing or invalid extractedText
 *       500:
 *         description: Parser failure
 *     security:
 *       - {}
 *
 * /api/parser/parse-from-blob:
 *   post:
 *     tags:
 *       - RFP Parsing
 *     summary: Parse RFP metadata from a blob-stored file
 *     description: >
 *       Downloads an RFP file from blob storage, extracts its text,
 *       and parses structured metadata.
 *     operationId: parseRFPFromBlob
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blobName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parsed metadata from blob file
 *       400:
 *         description: Missing blobName
 *       500:
 *         description: Blob or parser failure
 *     security:
 *       - {}
 *
 * /api/parser/compliance:
 *   post:
 *     tags:
 *       - RFP Parsing
 *     summary: Check RFP compliance with required sections
 *     description: >
 *       Checks whether an RFP text contains required proposal sections.
 *
 *       Used for validation and quality control before generation.
 *     operationId: checkRFPCompliance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extractedText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Compliance check result
 *       400:
 *         description: Missing extractedText
 *       500:
 *         description: Compliance check failure
 *     security:
 *       - {}
 */
``
router.post("/parse", async (req, res) => {
  try {
    const { extractedText } = req.body;
    if (!extractedText || typeof extractedText !== "string") {
      return res.status(400).json({ error: "Missing extractedText in request body" });
    }

    const parsedRFP = await parseRFP(extractedText);
    res.json(parsedRFP);
  } catch (err) {
    console.error("Parser /parse error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/parse-from-blob", async (req, res) => {
  try {
    const { blobName } = req.body;
    if (!blobName || typeof blobName !== "string") {
      return res.status(400).json({ error: "Missing blobName in request body" });
    }

    const buffer = await downloadBlob("incoming", blobName);
    const file = { originalname: blobName, buffer };
    const extractedText = await extractTextFromFileBuffer(file);

    const parsedRFP = await parseRFP(extractedText);
    res.json(parsedRFP);
  } catch (err) {
    console.error("Parser /parse-from-blob error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/compliance", async (req, res) => {
  try {
    const { extractedText } = req.body;
    if (!extractedText || typeof extractedText !== "string") {
      return res.status(400).json({ error: "Missing extractedText in request body" });
    }

    const complianceResult = await checkCompliance(extractedText);
    res.json(complianceResult);
  } catch (err) {
    console.error("Parser /compliance error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
