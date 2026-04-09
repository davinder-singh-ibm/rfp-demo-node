# 🎯 RFP Demo - Quick Reference Prompts

Copy-paste these prompts directly to Bob AI Agent for a smooth demo flow.

---

## 📌 Quick Demo (5 minutes)

### Prompt 1: Extract Text & Parse
```
Read the file sample_rfps/rfp_demo_doc.docx to extract its text content, then parse it using the parseRFPText tool from rfp-server MCP to extract metadata like deadlines, criteria, and sections.
```

### Prompt 2: Check Compliance
```
Check compliance of the extracted RFP text using the checkRFPCompliance tool from rfp-server MCP.
```

### Prompt 3: Generate Proposal
```
Generate a complete proposal using the generateProposal tool from rfp-server MCP with the extracted RFP text.
```

---

## 🎬 Full Demo (15 minutes)

### Step 1: Extract Text from RFP
```
Please read the file sample_rfps/rfp_demo_doc.docx to extract its text content. Use your built-in file reading capability to get the full text.
```

### Step 2: Parse Metadata
```
Now parse the extracted RFP text using the parseRFPText tool from rfp-server MCP to identify:
- Deadlines
- Evaluation criteria
- Required sections
- Pricing information
- Technical requirements
```

### Step 3: Compliance Check (CRITICAL)
```
Check RFP compliance using the checkRFPCompliance tool from rfp-server MCP. Identify:
- Compliance score
- Missing sections
- Present sections
- Recommendations
```

### Step 4: Analyze Missing Sections
```
Based on the compliance check, we're missing these sections:
[List will be provided by compliance check]

Please suggest content for each missing section based on the RFP context.
```

### Step 5: Enhance RFP Text
```
Add the following sections to the RFP text:

Executive Summary:
[Your suggested content]

Company Background:
[Your suggested content]

Team Qualifications:
[Your suggested content]

Risk Management:
[Your suggested content]

Implementation Timeline:
[Your suggested content]

Please provide the complete enhanced RFP text.
```

### Step 6: Re-check Compliance
```
Check compliance again with the enhanced RFP text to ensure we meet all requirements.
```

### Step 7: Retrieve Similar Proposals
```
Retrieve similar past proposals using the retrieveSimilarProposals tool from rfp-server MCP with the enhanced RFP text and industry "Technology".
```

### Step 8: Generate Proposal
```
Generate a complete proposal using the generateProposal tool from rfp-server MCP with the enhanced RFP text that includes all required sections.
```

### Step 9: Download PDF
```
Download the generated proposal as PDF using the downloadProposalPDF tool from rfp-server MCP. Include:
- Company name: ABC Corporation
- RFP metadata from parsing
- Generated proposal text
```

### Step 10: Send Email
```
Send the proposal via email using the sendProposalEmail tool from rfp-server MCP to:
- To: client@abccorp.com
- Subject: Proposal for AI-Powered RFP Response Solution
- Include the generated proposal text
```

---

## 🔥 One-Shot Complete Demo

```
Hi Bob! Execute this complete RFP processing workflow:

1. Read the file sample_rfps/rfp_demo_doc.docx to extract its text content
2. Parse the extracted text using the parseRFPText tool from rfp-server MCP
3. Check compliance using the checkRFPCompliance tool from rfp-server MCP
4. If compliance < 80%, identify missing sections and suggest content
5. Add missing sections to create enhanced RFP text
6. Re-check compliance using checkRFPCompliance to confirm > 80%
7. Retrieve similar proposals using the retrieveSimilarProposals tool from rfp-server MCP
8. Generate proposal using the generateProposal tool from rfp-server MCP with enhanced text
9. Download as PDF using the downloadProposalPDF tool from rfp-server MCP
10. Send email using the sendProposalEmail tool from rfp-server MCP to client@abccorp.com

Execute steps sequentially and show results after each step.
```

---

## 🎯 Focused Demos

### Demo A: Compliance Focus
```
1. Read sample_rfps/rfp_demo_doc.docx to extract text
2. Parse using parseRFPText from rfp-server MCP
3. Check compliance using checkRFPCompliance - show missing sections
4. Add missing sections to the RFP text
5. Re-check compliance - show improvement
6. Generate proposal using generateProposal with complete RFP
```

### Demo B: AI Generation Focus
```
1. Read and parse RFP using parseRFPText from rfp-server MCP
2. Retrieve similar past proposals using retrieveSimilarProposals
3. Generate proposal using generateProposal showing AI capabilities
4. Download professional PDF using downloadProposalPDF
```

### Demo C: End-to-End Automation
```
1. Read RFP document to extract text
2. Full automated processing using rfp-server MCP tools (parse, compliance, generate)
3. Email delivery using sendProposalEmail
Show time savings vs manual process
```

---

## 🐛 Troubleshooting Prompts

### If upload fails:
```
The file path should be relative to the workspace. Try: sample_rfps/rfp_demo_doc.docx
```

### If compliance is low:
```
Show me the missing sections from the compliance check. I'll add them to the RFP text.
```

### If generation fails:
```
Let's check if the RFP text has all required sections. Run compliance check first.
```

### If MCP tool fails:
```
The MCP server might need authentication. Check if the server is running and accessible.
```

---

## 📊 Expected Results

### After Upload:
```json
{
  "message": "RFP uploaded successfully",
  "fileId": "uuid",
  "blobName": "uuid-rfp_demo_doc.docx",
  "extractedText": "Request for Proposal (RFP)..."
}
```

### After Parse:
```json
{
  "deadlines": ["01-10-1990"],
  "criteria": ["It should be in COBOL, dinosaur language"],
  "pricing": "100$",
  "sections": ["Introduction", "Project Overview", ...]
}
```

### After Compliance Check:
```json
{
  "compliance_score": 65,
  "missing_sections": [
    "Executive Summary",
    "Company Background",
    "Team Qualifications",
    "Risk Management",
    "Implementation Timeline"
  ],
  "present_sections": [...],
  "recommendation": "Add missing sections"
}
```

### After Enhanced Compliance:
```json
{
  "compliance_score": 95,
  "missing_sections": [],
  "recommendation": "Ready for proposal generation"
}
```

---

## 🎓 Demo Tips

1. **Start with compliance check** - This is the key differentiator
2. **Show before/after** - Demonstrate improvement after adding sections
3. **Highlight AI capabilities** - Semantic search, intelligent generation
4. **Emphasize time savings** - Compare to manual process
5. **Show end-to-end** - From upload to email delivery

---

## 📝 Presenter Notes

### Key Messages:
- ✅ Automated compliance checking prevents incomplete proposals
- ✅ AI-powered generation maintains quality and consistency
- ✅ Semantic search leverages past successful proposals
- ✅ End-to-end automation saves 60-80% of time
- ✅ Azure integration ensures enterprise-grade security

### Demo Flow:
1. **Problem:** Manual RFP responses are time-consuming and error-prone
2. **Solution:** AI-powered automation with compliance checking
3. **Demo:** Show complete workflow with real RFP
4. **Results:** Professional proposal in minutes vs hours/days
5. **Value:** Time savings, quality improvement, scalability

---

## 🚀 Advanced Prompts

### Custom Industry:
```
Retrieve similar proposals for industry "Healthcare" instead of Technology.
```

### Multiple RFPs:
```
Process multiple RFPs in parallel:
1. Read rfp_demo_doc.docx to extract text
2. Read RFP_Document.pdf to extract text
3. Parse both using parseRFPText from rfp-server MCP
Compare compliance scores and generate proposals for both.
```

### Custom Sections:
```
Add these custom sections to the RFP:
- Sustainability Approach
- Innovation Strategy
- Partnership Model
```

---

## 📞 Support

If you encounter issues during the demo:
1. Verify Azure server is running: https://rfp-api-service-c8adb8a8h2gmbcf8.canadacentral-01.azurewebsites.net/api/health
2. Check MCP connection in Bob settings (should show "Connected")
3. Ensure file paths are correct (relative to workspace)
4. Verify MCP authentication is configured in Bob

---

**Last Updated:** 2026-04-09
**Version:** 1.0
**For:** IBM Bob AI Agent Demo