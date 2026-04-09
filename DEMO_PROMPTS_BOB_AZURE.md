# 🎯 Bob Demo Prompts - Azure MCP Server

Quick, easy-to-follow prompts for demonstrating the RFP automation system with Azure-deployed MCP server.

**⚠️ IMPORTANT:** Do NOT use `uploadRFP` MCP tool (multipart/form-data not supported). Use Bob's built-in PDF reading skill instead.

---

## 📋 Demo Scenario: Two-File Workflow (RECOMMENDED)

### **Prompt 1: Extract & Check Incomplete RFP**

```
Extract text from sample_rfps/incomplete_RFP_Document.pdf using your built-in file reading capability, then check its compliance using checkRFPCompliance tool from rfp-server MCP.
```

**Expected Result:**
- Text extracted from PDF
- Compliance score: **37.5%** (incomplete)
- Present sections: Executive Summary, Scope of Work, Requirements
- Missing sections: Timeline, Evaluation Criteria, Submission Instructions, Terms
- Bob explains it's incomplete

---

### **Prompt 2: Extract & Check Complete RFP**

```
Now extract text from sample_rfps/complete_RFP_Document.pdf using your built-in file reading capability, then check its compliance using checkRFPCompliance tool from rfp-server MCP.
```

**Expected Result:**
- Text extracted from PDF
- Compliance score: **90%+** (complete)
- All required sections present
- Ready for proposal generation

---

### **Prompt 3: Generate Proposal & Send Email**

```
Generate a complete proposal using generateProposal tool from rfp-server MCP with the complete RFP text, then send it via email to client@example.com using sendProposalEmail tool from rfp-server MCP.
```

**Expected Result:**
- Professional 5-section proposal generated
- Email sent with proposal content
- Demo complete!

---

## 🚀 Single Complete Flow (Copy-Paste Ready)

```
Hi Bob! Let's process an RFP workflow:

1. Extract text from sample_rfps/incomplete_RFP_Document.pdf using your built-in file reading
2. Check compliance using checkRFPCompliance tool from rfp-server MCP - show me the score
3. Explain it's incomplete (should be ~37.5%)
4. Extract text from sample_rfps/complete_RFP_Document.pdf using your built-in file reading
5. Check compliance again using checkRFPCompliance - should be 90%+
6. Generate proposal using generateProposal tool from rfp-server MCP
7. Send email to client@example.com using sendProposalEmail tool from rfp-server MCP

Execute step by step and show results after each step.
```

---

## 📝 Alternative: Manual Step-by-Step

### **Step 1: Extract & Check Incomplete RFP**

```
Extract text from sample_rfps/incomplete_RFP_Document.pdf to extract its text content using your built-in file reading capability, then check compliance using checkRFPCompliance tool from rfp-server MCP.
```

### **Step 2: Extract & Check Complete RFP**

```
Extract text from sample_rfps/complete_RFP_Document.pdf using your built-in file reading, then check compliance using checkRFPCompliance tool from rfp-server MCP.
```

### **Step 3: Generate & Send**

```
Generate proposal using generateProposal tool from rfp-server MCP with the complete RFP text, then send to client@example.com using sendProposalEmail tool from rfp-server MCP.
```

---

## 🔧 MCP Tools Reference

### Available from rfp-server:

1. ~~**uploadRFP**~~ - ❌ DO NOT USE (multipart not supported) - Use Bob's PDF reading skill instead
2. **parseRFPText** - Extract metadata from text
3. **parseRFPFromBlob** - Parse uploaded file (if file already in blob)
4. **checkRFPCompliance** - ✅ Validate completeness (USE THIS)
5. **retrieveSimilarProposals** - Find past proposals
6. **generateProposal** - ✅ Create complete proposal (USE THIS)
7. **downloadProposalPDF** - Generate PDF
8. **sendProposalEmail** - ✅ Send via email (USE THIS)

### Recommended Workflow:
1. **Bob's PDF Skill** → Extract text from local PDF
2. **checkRFPCompliance** → Check if RFP is complete
3. **generateProposal** → Generate proposal from text
4. **sendProposalEmail** → Send proposal via email

---

## 💡 Demo Tips

- **Use Bob's built-in PDF reading** - Don't use uploadRFP MCP tool
- **Start with incomplete file** to show compliance checking value (37.5%)
- **Show the compliance score difference** between incomplete (37.5%) and complete (90%+)
- **Emphasize time savings** - minutes vs hours/days
- **Highlight Azure integration** - enterprise-grade MCP server solution
- **Show AI-powered analysis** - compliance checking, proposal generation

---

## 📊 Expected Compliance Scores

- **incomplete_RFP_Document.pdf**: **37.5%** (missing 4 critical sections)
  - Present: Executive Summary, Scope of Work, Requirements
  - Missing: Timeline, Evaluation Criteria, Submission Instructions, Terms
  
- **complete_RFP_Document.pdf**: **90%+** (all sections present)
  - All required sections included
  - Ready for proposal generation

---

**Demo Duration:** 5-7 minutes  
**Server:** Azure-deployed MCP server  
**Files:** Both PDFs in sample_rfps folder