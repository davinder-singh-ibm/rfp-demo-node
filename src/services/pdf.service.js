const PDFDocument = require("pdfkit");

/**
 * Generate a professional PDF from proposal data
 * @param {Object} proposalData - The proposal data
 * @param {string} proposalData.proposal - The proposal text
 * @param {string} proposalData.companyName - Company name (optional)
 * @param {Object} proposalData.rfpData - RFP metadata (optional)
 * @param {Object} proposalData.requirementsJson - Requirements data (optional)
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateProposalPDF(proposalData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        info: {
          Title: "RFP Proposal",
          Author: "AI RFP Proposal Generator - POD 5",
          Subject: "Generated RFP Proposal",
          Keywords: "RFP, Proposal, AI Generated"
        }
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on("error", reject);

      // Header with branding
      doc
        .fontSize(24)
        .fillColor("#6366f1")
        .text("AI RFP Proposal Generator", { align: "center" })
        .moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor("#64748b")
        .text("Powered by POD 5 Team", { align: "center" })
        .text("Saritha • Davinder • Prasanna • Muthu • Jovitto", { align: "center" })
        .moveDown(1);

      // Horizontal line
      doc
        .strokeColor("#e2e8f0")
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(1);

      // Company Name (if available)
      if (proposalData.companyName) {
        doc
          .fontSize(18)
          .fillColor("#1e293b")
          .text(`Proposal for: ${proposalData.companyName}`, { align: "center" })
          .moveDown(1);
      }

      // Metadata section
      if (proposalData.rfpData || proposalData.requirementsJson) {
        doc
          .fontSize(14)
          .fillColor("#6366f1")
          .text("Proposal Details", { underline: true })
          .moveDown(0.5);

        doc.fontSize(10).fillColor("#1e293b");

        if (proposalData.rfpData) {
          if (proposalData.rfpData.title) {
            doc.text(`Title: ${proposalData.rfpData.title}`);
          }
          if (proposalData.rfpData.issueDate) {
            doc.text(`Issue Date: ${proposalData.rfpData.issueDate}`);
          }
          if (proposalData.rfpData.deadline) {
            doc.text(`Deadline: ${proposalData.rfpData.deadline}`);
          }
        }

        if (proposalData.requirementsJson) {
          if (proposalData.requirementsJson.industry) {
            doc.text(`Industry: ${proposalData.requirementsJson.industry}`);
          }
          if (proposalData.requirementsJson.projectType) {
            doc.text(`Project Type: ${proposalData.requirementsJson.projectType}`);
          }
        }

        doc.moveDown(1);

        // Horizontal line
        doc
          .strokeColor("#e2e8f0")
          .lineWidth(1)
          .moveTo(50, doc.y)
          .lineTo(545, doc.y)
          .stroke()
          .moveDown(1);
      }

      // Main proposal content
      doc
        .fontSize(14)
        .fillColor("#6366f1")
        .text("Proposal Content", { underline: true })
        .moveDown(0.5);

      // Parse and format the proposal text
      const proposalText = proposalData.proposal || "";
      const sections = parseProposalSections(proposalText);

      sections.forEach((section) => {
        // Check if we need a new page
        if (doc.y > 700) {
          doc.addPage();
        }

        if (section.type === "heading") {
          doc
            .font("Helvetica-Bold")
            .fontSize(13)
            .fillColor("#d04a02")
            .text(section.content, { continued: false })
            .font("Helvetica")
            .moveDown(0.35);
        } else if (section.type === "subheading") {
          doc
            .fontSize(11)
            .fillColor("#1e293b")
            .font("Helvetica-Bold")
            .text(section.content, { continued: false })
            .font("Helvetica")
            .moveDown(0.3);
        } else {
          writeFormattedParagraph(doc, section.content);
        }
      });

      // Footer on all pages
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        
        // Footer line
        doc
          .strokeColor("#e2e8f0")
          .lineWidth(1)
          .moveTo(50, 770)
          .lineTo(545, 770)
          .stroke();

        // Footer text
        doc
          .fontSize(8)
          .fillColor("#64748b")
          .text(
            `Generated on ${new Date().toLocaleDateString()} | Page ${i + 1} of ${range.count}`,
            50,
            780,
            { align: "center" }
          );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Parse proposal text into sections with formatting
 * @param {string} text - Proposal text
 * @returns {Array} Array of section objects
 */
function parseProposalSections(text) {
  const sections = [];
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    const markdownHeadingMatch = line.match(/^\*\*(.+?)\*\*$/);
    const normalizedLine = normalizeMarkdownInline(line);

    if (markdownHeadingMatch) {
      sections.push({ type: "heading", content: markdownHeadingMatch[1].trim() });
    } else if (normalizedLine === normalizedLine.toUpperCase() && normalizedLine.length > 3 && normalizedLine.length < 100) {
      sections.push({ type: "heading", content: normalizedLine });
    } else if (/^\d+\.\s+[A-Z]/.test(normalizedLine) || /^[A-Z][A-Z\s]+:/.test(normalizedLine)) {
      sections.push({ type: "subheading", content: normalizedLine });
    } else {
      sections.push({ type: "paragraph", content: line });
    }
  }

  return sections;
}

function normalizeMarkdownInline(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

function writeFormattedParagraph(doc, text) {
  const segments = text.split(/(\*\*.+?\*\*)/g).filter(Boolean);

  doc.fontSize(10).fillColor("#1e293b");

  segments.forEach((segment, index) => {
    const isBold = /^\*\*(.+)\*\*$/.test(segment);
    const content = isBold ? segment.replace(/^\*\*(.+)\*\*$/, "$1").trim() : segment;

    if (!content) {
      return;
    }

    doc
      .font(isBold ? "Helvetica-Bold" : "Helvetica")
      .text(content, {
        continued: index !== segments.length - 1,
        align: "justify",
        lineGap: 2
      });
  });

  doc.font("Helvetica").moveDown(0.5);
}

module.exports = {
  generateProposalPDF
};

// Made with Bob
