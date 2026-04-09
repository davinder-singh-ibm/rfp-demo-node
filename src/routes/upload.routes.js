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

/**
 * @openapi
 * /api/upload/base64:
 *   post:
 *     tags:
 *       - RFP Upload
 *     summary: Upload an RFP file using base64 encoding (MCP-friendly)
 *     description: >
 *       This endpoint accepts an RFP document as a base64-encoded string,
 *       making it suitable for AI agents and MCP interfaces that cannot
 *       send multipart/form-data. The file is decoded, stored in Azure Blob
 *       Storage, and its text content is extracted.
 *
 *
 *       **INSTRUCTIONS FOR AI AGENTS:**
 *
 *       To upload a file using this endpoint, follow these steps:
 *
 *       1. **Read the file from the filesystem** using the appropriate file reading method
 *          for your environment (e.g., fs.readFileSync in Node.js, open() in Python).
 *
 *       2. **Convert the file buffer to base64 encoding**:
 *          - Node.js: `fileBuffer.toString('base64')`
 *          - Python: `base64.b64encode(file_bytes).decode('utf-8')`
 *
 *       3. **Send a POST request** to this endpoint with JSON body containing:
 *          - `fileName`: The original filename with extension (e.g., "document.pdf")
 *          - `fileContent`: The base64-encoded string of the file
 *          - `mimeType`: (optional) The MIME type, will be auto-detected if not provided
 *
 *       4. **Example workflow**:
 *          ```
 *          Step 1: Read file "sample_rfps/rfp_demo_doc.docx"
 *          Step 2: Convert to base64: "UEsDBBQABgAIAAAAIQDfpNJs..."
 *          Step 3: POST to /api/upload/base64 with:
 *          {
 *            "fileName": "rfp_demo_doc.docx",
 *            "fileContent": "UEsDBBQABgAIAAAAIQDfpNJs..."
 *          }
 *          ```
 *
 *       5. **Response** will include:
 *          - `fileId`: Unique identifier for the uploaded file
 *          - `blobName`: Name of the file in blob storage
 *          - `extractedText`: Full text content extracted from the document
 *          - `extractedTextPreview`: First 2000 characters of extracted text
 *
 *       **IMPORTANT NOTES:**
 *       - Maximum file size: 20MB (due to JSON body limit)
 *       - Supported formats: PDF, DOCX, DOC, TXT, RTF
 *       - The fileName MUST include a file extension
 *       - The fileContent MUST be valid base64-encoded data
 *       - Authentication required: Include `x-api-key` header
 *     operationId: uploadRFPBase64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Original filename with extension (e.g., "rfp.pdf", "document.docx")
 *               fileContent:
 *                 type: string
 *                 description: Base64-encoded file content
 *               mimeType:
 *                 type: string
 *                 description: MIME type of the file (optional, will be inferred from extension if not provided)
 *             required:
 *               - fileName
 *               - fileContent
 *           examples:
 *             pdf:
 *               summary: Upload PDF file
 *               value:
 *                 fileName: "rfp_document.pdf"
 *                 fileContent: "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCA3MDAgVGQKKEhlbGxvIFdvcmxkKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAowMDAwMDAwMzI0IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKNDE3CiUlRU9GCg=="
 *                 mimeType: "application/pdf"
 *             docx:
 *               summary: Upload DOCX file
 *               value:
 *                 fileName: "rfp_document.docx"
 *                 fileContent: "UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAAC..."
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
 *       400:
 *         description: Missing required fields or invalid base64 content
 *       500:
 *         description: Internal server error during upload or extraction
 *     x-sideEffects:
 *       - Uploads file to Azure Blob Storage
 *       - Extracts text from the uploaded file
 *     security:
 *       - ApiKeyAuth: []
 */
router.post("/base64", async (req, res) => {
  try {
    const { fileName, fileContent, mimeType } = req.body;

    // Validate required fields
    if (!fileName || !fileContent) {
      return res.status(400).json({
        error: "Missing required fields: fileName and fileContent are required"
      });
    }

    // Validate fileName has an extension
    if (!fileName.includes('.')) {
      return res.status(400).json({
        error: "fileName must include a file extension (e.g., .pdf, .docx)"
      });
    }

    // Decode base64 content
    let fileBuffer;
    try {
      fileBuffer = Buffer.from(fileContent, 'base64');
    } catch (decodeError) {
      return res.status(400).json({
        error: "Invalid base64 content",
        details: decodeError.message
      });
    }

    // Validate decoded content is not empty
    if (fileBuffer.length === 0) {
      return res.status(400).json({
        error: "Decoded file content is empty"
      });
    }

    // Generate unique file ID and blob name
    const fileId = uuidv4();
    const blobName = `${fileId}-${fileName}`;

    // Upload to Blob Storage
    await uploadToBlob("incoming", blobName, fileBuffer);

    // Create a file object compatible with extractTextFromFileBuffer
    const fileObject = {
      originalname: fileName,
      buffer: fileBuffer,
      mimetype: mimeType || getMimeTypeFromExtension(fileName)
    };

    // Extract text
    const extractedText = await extractTextFromFileBuffer(fileObject);

    res.json({
      message: "RFP uploaded successfully via base64",
      fileId,
      blobName,
      extractedTextPreview: extractedText.substring(0, 2000),
      extractedText
    });
  } catch (err) {
    console.error("Base64 upload error:", err);
    res.status(500).json({
      error: err.message || "Failed to upload file via base64"
    });
  }
});

/**
 * Helper function to infer MIME type from file extension
 */
function getMimeTypeFromExtension(fileName) {
  const ext = fileName.toLowerCase().split('.').pop();
  const mimeTypes = {
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword',
    'txt': 'text/plain',
    'rtf': 'application/rtf'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

module.exports = router;