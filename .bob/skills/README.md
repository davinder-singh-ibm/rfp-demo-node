# Bob Skills Library

This directory contains reusable skills for AI agents to perform common tasks without making external API calls.

## Available Skills

### 1. Extract Text from File (`extract-text-from-file.js`)

**Purpose:** Extract text content from PDF, DOCX, and TXT files locally without API calls.

**Dependencies:**
```bash
npm install pdf-parse mammoth
```

**Usage Examples:**

#### Basic Extraction
```javascript
const { extractTextFromFile } = require('./.bob/skills/extract-text-from-file');

const result = await extractTextFromFile('sample_rfps/rfp_demo_doc.docx');
console.log(result.text);
console.log(result.metadata);
```

#### Quick Extract (Text Only)
```javascript
const { quickExtract } = require('./.bob/skills/extract-text-from-file');

const text = await quickExtract('document.pdf');
console.log(text);
```

#### Batch Processing
```javascript
const { extractTextFromMultipleFiles } = require('./.bob/skills/extract-text-from-file');

const results = await extractTextFromMultipleFiles([
  'file1.pdf',
  'file2.docx',
  'file3.txt'
]);
```

#### Extract and Save
```javascript
const { extractAndSaveText } = require('./.bob/skills/extract-text-from-file');

await extractAndSaveText('input.pdf', 'output.txt');
```

#### CLI Usage
```bash
# Extract and display
node .bob/skills/extract-text-from-file.js document.pdf

# Extract and save to file
node .bob/skills/extract-text-from-file.js document.pdf output.txt
```

**Supported Formats:**
- PDF (`.pdf`)
- Microsoft Word (`.docx`)
- Plain Text (`.txt`)

**Return Format:**
```javascript
{
  success: true,
  text: "Full extracted text...",
  preview: "First 500 characters...",
  metadata: {
    fileName: "document.docx",
    filePath: "path/to/document.docx",
    fileSize: 12345,
    fileSizeKB: "12.06",
    fileType: "DOCX",
    characterCount: 5000,
    wordCount: 850,
    lineCount: 120,
    extractedAt: "2026-04-09T12:00:00.000Z"
  }
}
```

**Error Handling:**
```javascript
const result = await extractTextFromFile('nonexistent.pdf');
if (!result.success) {
  console.error('Error:', result.error);
}
```

## Creating New Skills

To add a new reusable skill:

1. Create a new `.js` file in this directory
2. Export functions using `module.exports`
3. Add documentation with JSDoc comments
4. Include usage examples
5. Update this README with the new skill

### Skill Template

```javascript
/**
 * Skill Name
 * 
 * Description of what this skill does
 * 
 * @requires dependency-name
 */

/**
 * Main function description
 * 
 * @param {type} paramName - Parameter description
 * @returns {Promise<type>} Return value description
 * 
 * @example
 * const result = await functionName(param);
 */
async function functionName(param) {
  // Implementation
}

module.exports = {
  functionName
};
```

## Best Practices

1. **No External API Calls:** Skills should work offline and locally
2. **Error Handling:** Always return structured error information
3. **Documentation:** Include JSDoc comments and examples
4. **Reusability:** Design for multiple use cases
5. **Dependencies:** Minimize external dependencies
6. **Testing:** Include CLI usage for easy testing

## Contributing

When adding new skills:
- Follow the existing code style
- Add comprehensive documentation
- Include usage examples
- Update this README
- Test thoroughly before committing