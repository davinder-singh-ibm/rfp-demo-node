const express = require("express");
const { generateProposalPDF } = require("../services/pdf.service");

const router = express.Router();

/**
 * @openapi
 * /api/download-pdf:
 *   post:
 *     tags:
 *       - PDF Generation
 *     summary: Generate and download proposal as PDF
 *     description: >
 *       Converts the generated proposal text into a professionally formatted PDF document
 *       with branding, metadata, and structured content sections.
 *     operationId: downloadProposalPDF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposal
 *             properties:
 *               proposal:
 *                 type: string
 *                 description: Generated proposal text content
 *               companyName:
 *                 type: string
 *                 description: Company name (optional)
 *               rfpData:
 *                 type: object
 *                 description: RFP metadata (optional)
 *               requirementsJson:
 *                 type: object
 *                 description: Requirements data (optional)
 *               savedAs:
 *                 type: string
 *                 description: Blob file name reference for filename (optional)
 *           examples:
 *             basic:
 *               summary: Typical PDF generation request
 *               value:
 *                 proposal: "Executive Summary\n\nWe are pleased to submit our proposal..."
 *                 companyName: "ABC Corporation"
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing required proposal text
 *       500:
 *         description: PDF generation failed
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/", async (req, res) => {
  try {
    const { proposal, companyName, rfpData, requirementsJson, savedAs } = req.body;

    // Validate required fields
    if (!proposal) {
      return res.status(400).json({
        error: "Missing required field: proposal text is required"
      });
    }

    // Generate PDF
    const pdfBuffer = await generateProposalPDF({
      proposal,
      companyName,
      rfpData,
      requirementsJson
    });

    // Generate filename
    const timestamp = Date.now();
    const filename = savedAs 
      ? savedAs.replace('.txt', '.pdf')
      : `proposal-${timestamp}.pdf`;

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF buffer
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate PDF"
    });
  }
});

module.exports = router;

// Made with Bob
