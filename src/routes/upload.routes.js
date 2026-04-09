const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const { uploadToBlob } = require("../services/blob.service");
const { extractTextFromFileBuffer } = require("../services/parser.service");


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


/**
 * @openapi
 * /api/upload:
 *   post:
 *     tags:
 *       - RFP Upload
 *     summary: Upload an RFP file and extract its text content
 *     description: >
 *       This endpoint accepts an RFP (Request for Proposal) document as a file upload
 *       (PDF, DOCX, etc.), stores it in Azure Blob Storage, and extracts its text content
 *       for downstream processing.
 *
 *       Internally, a unique file ID is generated, the file is uploaded to blob storage,
 *       and a parser service extracts plain text.
 *
 *       This route exists to provide a standardized ingestion point for RFP documents,
 *       decoupling file handling from proposal generation. An MCP server can infer that
 *       this endpoint is for document ingestion, not proposal creation.
 *     operationId: uploadRFP
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               rfp:
 *                 type: string
 *                 format: binary
 *                 description: RFP file to upload (PDF, DOCX, etc.)
 *           examples:
 *             basic:
 *               summary: Typical file upload
 *               value:
 *                 rfp: (binary)
 *     responses:
 *       200:
 *         description: Successfully uploaded and extracted RFP text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileId:
 *                   type: string
 *                 blobName:
 *                   type: string
 *                 extractedTextPreview:
 *                   type: string
 *                 extractedText:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Successful upload
 *                 value:
 *                   message: RFP uploaded successfully
 *                   fileId: 123e4567-e89b-12d3-a456-426614174000
 *                   blobName: 123e4567-RFP.pdf
 *                   extractedTextPreview: "The client requests..."
 *                   extractedText: "The client requests a cloud migration..."
 *       400:
 *         description: No file uploaded or invalid input
 *       500:
 *         description: Internal server error during upload or extraction
 *     x-sideEffects:
 *       - Uploads file to Azure Blob Storage
 *       - Extracts text from the uploaded file
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/", upload.single("rfp"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileId = uuidv4();
    const originalName = req.file.originalname;
    const blobName = `${fileId}-${originalName}`;

    // Upload original RFP to Blob
    await uploadToBlob("incoming", blobName, req.file.buffer);

    // Extract text
    const extractedText = await extractTextFromFileBuffer(req.file);

    res.json({
      message: "RFP uploaded successfully",
      fileId,
      blobName,
      extractedTextPreview: extractedText.substring(0, 2000),
      extractedText
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;