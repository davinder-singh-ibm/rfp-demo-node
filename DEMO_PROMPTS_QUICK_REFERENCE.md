# 🎯 RFP Demo - Quick Reference Prompts

Copy-paste these prompts directly to Bob AI Agent for a smooth demo flow.

---

## 📌 Quick Demo (5 minutes) - RECOMMENDED

### Prompt 1: Extract & Check Incomplete RFP
```
Extract text from sample_rfps/incomplete_RFP_Document.pdf using your PDF extraction skill, then check its compliance using checkRFPCompliance tool from rfp-server MCP.
```

### Prompt 2: Extract & Check Complete RFP
```
Extract text from sample_rfps/complete_RFP_Document.pdf using your PDF extraction skill, then check its compliance using checkRFPCompliance tool from rfp-server MCP.
```

### Prompt 3: Generate & Send Proposal
```
Using the extracted text from complete_RFP_Document.pdf, generate a complete proposal using generateProposal tool from rfp-server MCP, then send it to client@example.com using sendProposalEmail tool.
```

---

## 🔥 One-Shot Complete Demo

```
Hi Bob! Execute this RFP workflow:

1. Extract text from sample_rfps/incomplete_RFP_Document.pdf using your PDF skill
2. Check compliance using checkRFPCompliance from rfp-server MCP - show the score (should be ~57%)
3. Tell me it's incomplete and what's missing
4. Extract text from sample_rfps/complete_RFP_Document.pdf using your PDF skill
5. Check compliance again using checkRFPCompliance (should be 90%+)
6. Generate proposal using generateProposal from rfp-server MCP with the extracted text
7. Send email to client@example.com using sendProposalEmail from rfp-server MCP

Execute step by step and show results after each step.
```

---

## 🎬 Full Demo (15 minutes)

### Step 1: Extract Text from Incomplete RFP
```
Extract text from sample_rfps/incomplete_RFP_Document.pdf using your built-in PDF extraction skill. Show me the extracted content.
```

### Step 2: Check Compliance (Incomplete)
```
Check compliance of the extracted text using the checkRFPCompliance tool from rfp-server MCP. Show:
- Compliance score
- Missing sections
- Present sections
- Recommendations
```

### Step 3: Extract Text from Complete RFP
```
Extract text from sample_rfps/complete_RFP_Document.pdf using your PDF extraction skill.
```

### Step 4: Check Compliance (Complete)
```
Check compliance of the complete RFP text using checkRFPCompliance tool from rfp-server MCP. Compare with the incomplete RFP results.
```

### Step 5: Parse Metadata
```
Parse the complete RFP text using the parseRFPText tool from rfp-server MCP to identify:
- Deadlines
- Evaluation criteria
- Required sections
- Pricing information
- Technical requirements
```

### Step 6: Retrieve Similar Proposals
```
Retrieve similar past proposals using the retrieveSimilarProposals tool from rfp-server MCP with the complete RFP text and industry "Technology".
```

### Step 7: Generate Proposal
```
Generate a complete proposal using the generateProposal tool from rfp-server MCP with the complete RFP text.
```

### Step 8: Download PDF
```
Download the generated proposal as PDF using the downloadProposalPDF tool from rfp-server MCP.
```

### Step 9: Send Email
```
Send the proposal via email using the sendProposalEmail tool from rfp-server MCP to client@example.com with subject "Proposal Response".
```

---

## 🎯 Focused Demos

### Demo A: Compliance Focus (RECOMMENDED)
```
1. Extract text from incomplete_RFP_Document.pdf using PDF skill
2. Check compliance using checkRFPCompliance - show ~57% score
3. Extract text from complete_RFP_Document.pdf using PDF skill
4. Check compliance again - show 90%+ improvement
5. Generate proposal using generateProposal with complete RFP
```

### Demo B: AI Generation Focus
```
1. Extract text from complete_RFP_Document.pdf using PDF skill
2. Parse using parseRFPText from rfp-server MCP
3. Retrieve similar past proposals using retrieveSimilarProposals
4. Generate proposal using generateProposal showing AI capabilities
5. Download professional PDF using downloadProposalPDF
```

### Demo C: End-to-End Automation
```
1. Extract text from complete_RFP_Document.pdf using PDF skill
2. Full automated processing using rfp-server MCP tools (parse, compliance, generate)
3. Email delivery using sendProposalEmail
Show time savings vs manual process
```

---

## 🐛 Troubleshooting Prompts

### If PDF extraction fails:
```
The file path should be relative to the workspace. Try: sample_rfps/incomplete_RFP_Document.pdf
```

### If compliance is low:
```
This is expected for the incomplete RFP! Show me the missing sections. Now let's try the complete RFP.
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

### After Incomplete RFP Compliance Check:
```json
{
  "present_sections": [
    "Introduction",
    "Scope of Work",
    "Requirements or Specifications",
    "Timeline or Schedule"
  ],
  "missing_sections": [
    "Executive Summary or Introduction",
    "Evaluation Criteria",
    "Submission Instructions",
    "Terms and Conditions"
  ],
  "compliance_score": "57%"
}
```

### After Complete RFP Compliance Check:
```json
{
  "compliance_score": "90-95%",
  "missing_sections": [],
  "present_sections": [
    "Executive Summary",
    "Introduction",
    "Scope of Work",
    "Requirements",
    "Timeline",
    "Evaluation Criteria",
    "Submission Instructions",
    "Terms and Conditions"
  ],
  "recommendation": "Ready for proposal generation"
}
```

---

## 🎓 Demo Tips

1. **Start with compliance check** - This is the key differentiator
2. **Show before/after** - Demonstrate improvement from incomplete to complete
3. **Highlight AI capabilities** - Semantic search, intelligent generation
4. **Emphasize time savings** - Compare to manual process (20+ hours → 5 minutes)
5. **Show end-to-end** - From extraction to email delivery

---

## 📝 Presenter Notes

### Key Messages:
- ✅ Bob's PDF extraction + Azure MCP = Powerful automation
- ✅ Automated compliance checking prevents incomplete proposals
- ✅ AI-powered generation maintains quality and consistency
- ✅ End-to-end automation saves 95-98% of time
- ✅ Azure integration ensures enterprise-grade security

### Demo Flow:
1. **Problem:** Manual RFP responses are time-consuming and error-prone
2. **Solution:** AI-powered automation with compliance checking
3. **Demo:** Show complete workflow with real RFPs
4. **Results:** Professional proposal in 5 minutes vs 20+ hours
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
1. Extract text from incomplete_RFP_Document.pdf
2. Extract text from complete_RFP_Document.pdf
3. Check compliance for both using checkRFPCompliance
Compare compliance scores and generate proposal for the complete one.
```

---

## 📞 Support

If you encounter issues during the demo:
1. Verify MCP server connection in Bob settings (should show "Connected")
2. Ensure file paths are correct (relative to workspace)
3. Check that PDF files exist in sample_rfps/ directory
4. Verify rfp-server MCP is running

---

**Last Updated:** 2026-04-09
**Version:** 2.0 (Updated for PDF Extraction)
**For:** IBM Bob AI Agent Demo