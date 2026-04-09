# OpenAPI Documentation Updates for MCP Tool Generation

## Summary

Updated all OpenAPI/Swagger documentation in route files to ensure MCP tools are generated correctly with proper request schemas.

## Changes Made

### 1. Parser Routes (`src/routes/parser.routes.js`)
**Updated endpoints:**
- `/api/parser/parse` (parseRFPText)
- `/api/parser/parse-from-blob` (parseRFPFromBlob)
- `/api/parser/compliance` (checkRFPCompliance)

**Improvements:**
- Added `required` array to schema definitions
- Added detailed property descriptions
- Added request/response examples
- Added response schema definitions with expected structure

### 2. Generate Routes (`src/routes/generate.routes.js`)
**Updated endpoint:**
- `/api/generate` (generateProposal)

**Improvements:**
- Added `required: ["extractedText"]` to schema
- Maintains existing examples

### 3. Email Routes (`src/routes/email.routes.js`)
**Updated endpoint:**
- `/api/send-email` (sendProposalEmail)

**Improvements:**
- Moved `required` array to proper location in schema
- Added `format: email` for email validation
- Added comprehensive request example

### 4. PDF Routes (`src/routes/pdf.routes.js`)
**Updated endpoint:**
- `/api/download-pdf` (downloadProposalPDF)

**Improvements:**
- Added `required: ["proposal"]` to schema
- Added request example

### 5. Proposal Routes (`src/routes/proposal.routes.js`)
**Updated endpoints:**
- `/api/proposals/retrieve` (retrieveSimilarProposals)
- `/api/proposals/retrieve-from-blob` (retrieveSimilarProposalsFromBlob)

**Improvements:**
- Added `required` arrays to schemas
- Added detailed property descriptions
- Added request examples for both endpoints

## Key Schema Improvements

### Before:
```yaml
schema:
  type: object
  properties:
    extractedText:
      type: string
```

### After:
```yaml
schema:
  type: object
  required:
    - extractedText
  properties:
    extractedText:
      type: string
      description: Full extracted plain text of the RFP
examples:
  basic:
    summary: Typical RFP text
    value:
      extractedText: "Request for Proposal..."
```

## Regenerated Files

1. **swagger.json** - Regenerated with updated OpenAPI specs
2. **generate-swagger.js** - Created utility script for regenerating swagger.json

## MCP Tool Generation

The updated OpenAPI documentation now properly specifies:

1. **Required Parameters** - Using `required` array in schema
2. **Parameter Descriptions** - Clear descriptions for each property
3. **Request Examples** - Concrete examples showing proper usage
4. **Response Schemas** - Expected response structure with examples

## Testing

Direct API testing via PowerShell confirmed the endpoints work correctly:

```powershell
Invoke-RestMethod -Uri "https://rfp-api-service-c8adb8a8h2gmbcf8.canadacentral-01.azurewebsites.net/api/parser/compliance" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"; "x-api-key"="demo-mcp-key"} `
  -Body '{"extractedText":"Test RFP text"}'
```

**Result:**
```json
{
  "compliance_score": "37.5%",
  "present_sections": ["Executive Summary or Introduction", "Scope of Work", "Requirements or Specifications"],
  "missing_sections": ["Timeline or Schedule", "Evaluation Criteria", "Submission Instructions", "Terms and Conditions"]
}
```

## Next Steps for MCP Server

To make the MCP tools work correctly in Bob:

1. **Redeploy the Azure MCP server** with the updated swagger.json
2. **Clear any MCP server cache** that might be using old schema definitions
3. **Restart Bob** to reload MCP tool definitions
4. **Test MCP tools** using the updated schemas

## Files Modified

- `src/routes/parser.routes.js`
- `src/routes/generate.routes.js`
- `src/routes/email.routes.js`
- `src/routes/pdf.routes.js`
- `src/routes/proposal.routes.js`
- `swagger.json` (regenerated)

## Files Created

- `generate-swagger.js` (utility script)
- `OPENAPI_UPDATES_SUMMARY.md` (this file)

## Verification

All route files now have:
✅ Proper `required` arrays in request schemas
✅ Detailed property descriptions
✅ Request/response examples
✅ Consistent OpenAPI 3.0 format
✅ Security scheme definitions (ApiKeyAuth)

The swagger.json has been successfully regenerated and is ready for MCP server deployment.