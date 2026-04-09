/**
 * Local Text Extraction Skill
 * 
 * Extracts text content from PDF, DOCX, and TXT files without making API calls.
 * This is a reusable skill for AI agents to process documents locally.
 * 
 * @requires pdf-parse - For PDF text extraction
 * @requires mammoth - For DOCX text extraction
 * @requires fs - Node.js file system (built-in)
 * 
 * Installation:
 * npm install pdf-parse mammoth
 */

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from a local file (PDF, DOCX, or TXT)
 * 
 * @param {string} filePath - Absolute or relative path to the file
 * @returns {Promise<Object>} Object containing extracted text and metadata
 * @throws {Error} If file doesn't exist or format is unsupported
 * 
 * @example
 * const result = await extractTextFromFile('sample_rfps/rfp_demo_doc.docx');
 * console.log(result.text);
 * console.log(result.metadata);
 */
async function extractTextFromFile(filePath) {
  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Read file into buffer
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = filePath.toLowerCase();
  const fileStats = fs.statSync(filePath);

  let extractedText = '';
  let metadata = {
    fileName: filePath.split(/[/\\]/).pop(),
    filePath: filePath,
    fileSize: fileStats.size,
    fileSizeKB: (fileStats.size / 1024).toFixed(2),
    fileType: '',
    extractedAt: new Date().toISOString()
  };

  try {
    // Handle PDF files
    if (fileName.endsWith('.pdf')) {
      metadata.fileType = 'PDF';
      const data = await pdfParse(fileBuffer);
      extractedText = data.text;
      metadata.pageCount = data.numpages;
      metadata.pdfInfo = data.info;
    }
    // Handle DOCX files
    else if (fileName.endsWith('.docx')) {
      metadata.fileType = 'DOCX';
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value;
      if (result.messages && result.messages.length > 0) {
        metadata.warnings = result.messages;
      }
    }
    // Handle TXT files
    else if (fileName.endsWith('.txt')) {
      metadata.fileType = 'TXT';
      extractedText = fileBuffer.toString('utf-8');
    }
    // Unsupported format
    else {
      throw new Error(
        `Unsupported file type: ${fileName}. Only PDF, DOCX, and TXT are supported.`
      );
    }

    // Add text statistics
    metadata.characterCount = extractedText.length;
    metadata.wordCount = extractedText.split(/\s+/).filter(w => w.length > 0).length;
    metadata.lineCount = extractedText.split('\n').length;

    return {
      success: true,
      text: extractedText,
      preview: extractedText.substring(0, 500),
      metadata: metadata
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      filePath: filePath,
      metadata: metadata
    };
  }
}

/**
 * Extract text from multiple files in batch
 * 
 * @param {string[]} filePaths - Array of file paths
 * @returns {Promise<Object[]>} Array of extraction results
 * 
 * @example
 * const results = await extractTextFromMultipleFiles([
 *   'file1.pdf',
 *   'file2.docx',
 *   'file3.txt'
 * ]);
 */
async function extractTextFromMultipleFiles(filePaths) {
  const results = [];
  
  for (const filePath of filePaths) {
    try {
      const result = await extractTextFromFile(filePath);
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        filePath: filePath
      });
    }
  }
  
  return results;
}

/**
 * Extract text and save to a text file
 * 
 * @param {string} inputPath - Path to input file (PDF/DOCX/TXT)
 * @param {string} outputPath - Path to save extracted text
 * @returns {Promise<Object>} Extraction result with output path
 * 
 * @example
 * await extractAndSaveText('document.pdf', 'output.txt');
 */
async function extractAndSaveText(inputPath, outputPath) {
  const result = await extractTextFromFile(inputPath);
  
  if (result.success) {
    fs.writeFileSync(outputPath, result.text, 'utf-8');
    result.outputPath = outputPath;
    result.message = `Text extracted and saved to ${outputPath}`;
  }
  
  return result;
}

/**
 * Quick extraction - returns just the text string
 * 
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} Extracted text
 * 
 * @example
 * const text = await quickExtract('document.docx');
 */
async function quickExtract(filePath) {
  const result = await extractTextFromFile(filePath);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.text;
}

// Export functions
module.exports = {
  extractTextFromFile,
  extractTextFromMultipleFiles,
  extractAndSaveText,
  quickExtract
};

// CLI usage example (if run directly)
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node extract-text-from-file.js <file-path> [output-path]');
    console.log('Example: node extract-text-from-file.js document.pdf output.txt');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  (async () => {
    try {
      if (outputPath) {
        const result = await extractAndSaveText(inputPath, outputPath);
        console.log(JSON.stringify(result, null, 2));
      } else {
        const result = await extractTextFromFile(inputPath);
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

// Made with Bob
