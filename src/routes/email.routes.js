const express = require("express");
const { sendProposalEmail } = require("../services/email.service");

const router = express.Router();

/**
 * @openapi
 * /api/send-email:
 *   post:
 *     tags:
 *       - Email
 *     summary: Send generated proposal via email
 *     description: >
 *       Sends the generated proposal to a specified email address using
 *       Azure Communication Services Email. The email includes formatted
 *       HTML content with the proposal text.
 *     operationId: sendProposalEmail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - proposalText
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient email address
 *                 format: email
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               proposalText:
 *                 type: string
 *                 description: Generated proposal text content
 *               companyName:
 *                 type: string
 *                 description: Company name (optional)
 *               savedAs:
 *                 type: string
 *                 description: Blob file name reference (optional)
 *           examples:
 *             basic:
 *               summary: Typical email request
 *               value:
 *                 to: "client@example.com"
 *                 subject: "Proposal for AI RFP Automation"
 *                 proposalText: "Executive Summary\n\nWe are pleased to submit..."
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 to:
 *                   type: string
 *                 messageId:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid email format
 *       500:
 *         description: Email sending failed
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/", async (req, res) => {
  try {
    const { to, subject, proposalText, companyName, savedAs, rfpData, requirementsJson } = req.body;

    // Validate required fields
    if (!to || !subject || !proposalText) {
      return res.status(400).json({
        error: "Missing required fields: to, subject, and proposalText are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        error: "Invalid email address format"
      });
    }

    // Send the email with PDF attachment
    const result = await sendProposalEmail({
      to,
      subject,
      proposalText,
      companyName,
      savedAs,
      rfpData,
      requirementsJson
    });

    return res.json({
      success: true,
      message: "Email sent successfully with PDF attachment",
      to: to,
      messageId: result.messageId,
      attachmentName: result.attachmentName
    });
  } catch (err) {
    console.error("Email sending error:", err);
    return res.status(500).json({
      error: err.message || "Failed to send email"
    });
  }
});

module.exports = router;

// Made with Bob
