# 🔄 RFP Processing Workflow - Visual Guide

## Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RFP PROCESSING WORKFLOW                          │
│                    (Using Bob AI Agent + MCP)                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   START      │
│  User has    │
│  RFP File    │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: EXTRACT TEXT FROM RFP DOCUMENT                             │
│  ─────────────────────────────────────────────────────────────────  │
│  Tool: read_file (Bob's built-in skill)                             │
│  Input: File path (sample_rfps/rfp_demo_doc.docx)                  │
│  Output: extractedText (full content)                               │
│                                                                      │
│  ┌──────────┐      ┌──────────────┐      ┌─────────────┐          │
│  │ RFP File │─────▶│ Bob's File   │─────▶│ Extracted   │          │
│  │ (DOCX)   │      │ Reader       │      │ Text        │          │
│  └──────────┘      └──────────────┘      └─────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: PARSE RFP METADATA                                         │
│  ─────────────────────────────────────────────────────────────────  │
│  Tool: parseRFPText                                                 │
│  Input: extractedText                                               │
│  Output: deadlines, criteria, sections, pricing                     │
│                                                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────┐      │
│  │ Extracted    │─────▶│ Azure OpenAI │─────▶│ Structured  │      │
│  │ Text         │      │ Analysis     │      │ Metadata    │      │
│  └──────────────┘      └──────────────┘      └─────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: COMPLIANCE CHECK ⚠️ CRITICAL                               │
│  ─────────────────────────────────────────────────────────────────  │
│  Tool: checkRFPCompliance                                           │
│  Input: extractedText                                               │
│  Output: compliance_score, missing_sections, present_sections       │
│                                                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────┐      │
│  │ RFP Text     │─────▶│ AI Validator │─────▶│ Compliance  │      │
│  │              │      │              │      │ Report      │      │
│  └──────────────┘      └──────────────┘      └─────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
       │
       ▼
       ┌─────────────────────────────────┐
       │  Compliance Score >= 80%?       │
       └─────────────┬───────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
        NO                      YES
         │                       │
         ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐
│  STEP 4: FIX        │   │  STEP 6: RETRIEVE   │
│  COMPLIANCE         │   │  SIMILAR PROPOSALS  │
│  ─────────────────  │   │  ─────────────────  │
│  Action Required:   │   │  Tool:              │
│  1. Identify gaps   │   │  retrieveSimilar    │
│  2. Add sections    │   │  Proposals          │
│  3. Enhance text    │   │                     │
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           ▼                         │
┌─────────────────────┐             │
│  STEP 5: RE-CHECK   │             │
│  COMPLIANCE         │             │
│  ─────────────────  │             │
│  Tool:              │             │
│  checkRFPCompliance │             │
│  (with enhanced     │             │
│   RFP text)         │             │
└──────────┬──────────┘             │
           │                         │
           └─────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 7: GENERATE PROPOSAL                                          │
│  ─────────────────────────────────────────────────────────────────  │
│  Tool: generateProposal                                             │
│  Input: extractedText (enhanced)                                    │
│  Output: Complete proposal with all sections                        │
│                                                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────┐      │
│  │ Enhanced     │─────▶│ Azure OpenAI │─────▶│ Generated   │      │
│  │ RFP Text     │      │ + Past       │      │ Proposal    │      │
│  │              │      │ Proposals    │      │             │      │
│  └──────────────┘      └──────────────┘      └─────────────┘      │
│                                                                      │
│  Generated Sections:                                                │
│  • Executive Summary                                                │
│  • Understanding of Client Needs                                    │
│  • Proposed Approach                                                │
│  • Why Choose Us                                                    │
│  • Governance & Risk Management                                     │
│  • Implementation Timeline                                          │
│  • Pricing                                                          │
└─────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 8: DOWNLOAD PDF                                               │
│  ─────────────────────────────────────────────────────────────────  │
│  Tool: downloadProposalPDF                                          │
│  Input: proposal, companyName, rfpData                              │
│  Output: Professional PDF document                                  │
│                                                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────┐      │
│  │ Proposal     │─────▶│ PDF          │─────▶│ Formatted   │      │
│  │ Text         │      │ Generator    │      │ PDF File    │      │
│  └──────────────┘      └──────────────┘      └─────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 9: SEND EMAIL                                                 │
│  ─────────────────────────────────────────────────────────────────  │
│  Tool: sendProposalEmail                                            │
│  Input: to, subject, proposalText                                   │
│  Output: Email sent confirmation                                    │
│                                                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────┐      │
│  │ Proposal     │─────▶│ Azure Comm   │─────▶│ Email       │      │
│  │ + Metadata   │      │ Services     │      │ Delivered   │      │
│  └──────────────┘      └──────────────┘      └─────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   COMPLETE   │
│  Proposal    │
│  Delivered   │
└──────────────┘
```

---

## 🔍 Detailed Step Breakdown

### Step 1: Extract Text (read_file)
```
Input:  RFP File Path (sample_rfps/rfp_demo_doc.docx)
        ↓
Process: • Bob reads file using built-in capability
         • Extracts text content from DOCX
         • Returns full text
        ↓
Output: • extractedText (full content)
```

### Step 2: Parse (parseRFPText)
```
Input:  extractedText
        ↓
Process: • AI analyzes text structure
         • Identifies key metadata
         • Extracts requirements
        ↓
Output: • deadlines []
        • criteria []
        • sections []
        • pricing
        • technical requirements
```

### Step 3: Compliance Check (checkRFPCompliance)
```
Input:  extractedText
        ↓
Process: • Check for required sections
         • Calculate compliance score
         • Identify gaps
        ↓
Output: • compliance_score (0-100)
        • missing_sections []
        • present_sections []
        • recommendation
```

### Step 4-5: Fix & Re-check
```
IF compliance_score < 80%:
    ↓
    Add missing sections:
    • Executive Summary
    • Company Background
    • Team Qualifications
    • Risk Management
    • Implementation Timeline
    ↓
    Re-check compliance
    ↓
    Ensure score >= 80%
```

### Step 6: Retrieve Similar (retrieveSimilarProposals)
```
Input:  extractedText + industry
        ↓
Process: • Generate embeddings
         • Semantic search
         • Rank by similarity
        ↓
Output: • proposals []
          - id
          - title
          - similarityScore
          - content
```

### Step 7: Generate (generateProposal)
```
Input:  extractedText (enhanced)
        ↓
Process: • Parse requirements
         • Research company
         • Retrieve evidence
         • Generate sections
         • Save to blob
        ↓
Output: • Complete proposal text
        • All required sections
        • Professional formatting
        • Blob storage reference
```

### Step 8: PDF (downloadProposalPDF)
```
Input:  proposal + metadata
        ↓
Process: • Format content
         • Add branding
         • Generate PDF
        ↓
Output: • Professional PDF file
        • Ready for submission
```

### Step 9: Email (sendProposalEmail)
```
Input:  to + subject + proposalText
        ↓
Process: • Format HTML email
         • Send via Azure Comm Services
         • Track delivery
        ↓
Output: • Email sent confirmation
        • Message ID
```

---

## 🎯 Critical Decision Points

### Decision Point 1: Compliance Check
```
┌─────────────────────────────────┐
│  Compliance Score >= 80%?       │
└─────────────┬───────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
   YES                 NO
    │                   │
    ▼                   ▼
Continue          Add Missing
to Generate       Sections
```

### Decision Point 2: Similar Proposals Found
```
┌─────────────────────────────────┐
│  Similar Proposals Available?   │
└─────────────┬───────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
   YES                 NO
    │                   │
    ▼                   ▼
Use as            Generate
Reference         from Scratch
```

---

## 📊 Data Flow

```
┌──────────────┐
│  RFP File    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Bob's File Reader (read_file)       │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Extracted Text                      │
└──────┬───────────────────────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────────┐          ┌──────────────────┐
│  Parser Service  │          │  Compliance      │
│  (Azure OpenAI)  │          │  Checker         │
└──────┬───────────┘          └──────┬───────────┘
       │                             │
       ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│  Metadata        │          │  Compliance      │
│  (JSON)          │          │  Report          │
└──────────────────┘          └──────────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────────┐          ┌──────────────────┐
│  Search Service  │          │  Proposal        │
│  (AI Search)     │          │  Generator       │
└──────┬───────────┘          └──────┬───────────┘
       │                             │
       ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│  Past Proposals  │          │  Generated       │
│  (Evidence)      │          │  Proposal        │
└──────────────────┘          └──────┬───────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
          ┌──────────────────┐          ┌──────────────────┐
          │  PDF Generator   │          │  Email Service   │
          └──────┬───────────┘          └──────┬───────────┘
                 │                             │
                 ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │  PDF File        │          │  Email Sent      │
          └──────────────────┘          └──────────────────┘
```

---

## 🔄 Error Handling Flow

```
┌─────────────────┐
│  Any Step       │
└────────┬────────┘
         │
         ▼
    ┌────────────┐
    │  Success?  │
    └─────┬──────┘
          │
    ┌─────┴─────┐
    │           │
   YES         NO
    │           │
    ▼           ▼
Continue    ┌──────────────┐
to Next     │  Error       │
Step        │  Handler     │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Log Error   │
            │  Return      │
            │  Message     │
            └──────────────┘
```

---

## 🎯 Success Criteria

```
✅ Text Extraction Success
   └─▶ File read successfully
       └─▶ Text extracted

✅ Parse Success
   └─▶ Metadata extracted
       └─▶ All fields populated

✅ Compliance Success
   └─▶ Score >= 80%
       └─▶ All sections present

✅ Generation Success
   └─▶ Proposal created
       └─▶ All sections included
           └─▶ Saved to blob

✅ Delivery Success
   └─▶ PDF generated
       └─▶ Email sent
           └─▶ Confirmation received
```

---

## 📈 Performance Metrics

```
Traditional Manual Process:
├─ RFP Analysis: 2-4 hours
├─ Research: 4-8 hours
├─ Writing: 8-16 hours
├─ Review: 2-4 hours
├─ Formatting: 1-2 hours
└─ Total: 17-34 hours

Automated Process:
├─ Read File: 5 seconds
├─ Parse: 30 seconds
├─ Compliance: 20 seconds
├─ Generate: 2-3 minutes
├─ PDF: 10 seconds
├─ Email: 5 seconds
└─ Total: 3-4 minutes

Time Savings: 95-98%
```

---

## 🔐 Security Flow

```
┌─────────────────┐
│  API Request    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Authentication     │
│  (x-api-key)        │
└────────┬────────────┘
         │
    ┌────┴────┐
    │  Valid? │
    └────┬────┘
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
Process   Return 401
Request   Unauthorized
```

---

**Visual Guide Version:** 1.0  
**Last Updated:** 2026-04-09  
**For:** IBM Bob AI Agent Demo