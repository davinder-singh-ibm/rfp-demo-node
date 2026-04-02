## Plan: Expose Parser and Proposal Retriever Endpoints

Add dedicated HTTP endpoints so other pods can call the RFP parser and proposal retriever using either raw RFP text or an uploaded document stored in blob storage.

**Steps**
1. Create `src/routes/parser.routes.js` with endpoints:
   - `POST /api/parser/parse` for raw `extractedText`
   - `POST /api/parser/parse-from-blob` for `blobName` in the incoming container
   - `POST /api/parser/compliance` for raw `extractedText` compliance checks
2. Create `src/routes/proposal.routes.js` with endpoints:
   - `POST /api/proposals/retrieve` for raw `extractedText` and optional `industry`
   - `POST /api/proposals/retrieve-from-blob` for `blobName` and optional `industry`
3. Update `src/server.js` to mount the new routes:
   - `app.use('/api/parser', parserRoutes)`
   - `app.use('/api/proposals', proposalRoutes)`
4. Reuse existing services:
   - `parser.service.js` for `extractTextFromFileBuffer`, `parseRFP`, `checkCompliance`
   - `search.service.js` for `searchSimilarProposals`
   - `blob.service.js` for `downloadBlob`
5. Add request validation and clear error responses for missing `blobName` or `extractedText`.

**Verification**
1. Confirm new endpoints are mounted and reachable via `GET /api/health` plus new POST endpoints.
2. Test `POST /api/parser/parse` with raw text and ensure JSON parse output returns.
3. Test `POST /api/parser/parse-from-blob` with an uploaded incoming blob name.
4. Test `POST /api/proposals/retrieve` and `POST /api/proposals/retrieve-from-blob`.
5. Validate error handling for missing inputs.

**Decisions / assumptions**
- "Proposal retriever" is implemented as the existing `searchSimilarProposals` service.
- "Any uploaded document" is accessed via the incoming blob container and blob name.
- No external MCP gateway changes are required beyond exposing new express endpoints.
