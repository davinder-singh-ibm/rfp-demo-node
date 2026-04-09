# 🎯 Bob Demo Prompts - Azure MCP Server

Quick, easy-to-follow prompts for demonstrating the RFP automation system with Azure-deployed MCP server.

---

## 📋 Demo Scenario: Two-File Workflow

### **Prompt 1: Upload Incomplete RFP & Check Compliance**

```
Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP, then check its compliance score using checkRFPCompliance tool.
```

**Expected Result:**
- File uploaded to Azure Blob Storage
- Compliance score: ~60-70% (incomplete)
- Missing sections identified
- Bob tells user to upload complete file

---

### **Prompt 2: Upload Complete RFP**

```
Now upload sample_rfps/complete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP and check its compliance.
```

**Expected Result:**
- File uploaded successfully
- Compliance score: 90%+ (complete)
- Ready for proposal generation

---

### **Prompt 3: Generate Proposal & Send Email**

```
Generate a complete proposal using generateProposal tool from rfp-server MCP with the complete RFP, then send it via email to client@example.com using sendProposalEmail tool.
```

**Expected Result:**
- Professional proposal generated
- Email sent with proposal content
- Demo complete!

---

## 🚀 Alternative: Single Complete Flow

```
Hi Bob! Let's process an RFP:

1. Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP from rfp-server MCP
2. Check compliance using checkRFPCompliance - show me the score
3. Tell me it's incomplete and I need to upload a better file
4. Then I'll upload sample_rfps/complete_RFP_Document.pdf using uploadRFP
5. Check compliance again - should be 90%+
6. Generate proposal using generateProposal from rfp-server MCP
7. Send email to client@example.com using sendProposalEmail from rfp-server MCP

Execute step by step.
```

---

## 📝 For PDF Text Extraction (Using Bob's Skill)

### **Prompt: Extract Text from PDF**

```
Read sample_rfps/incomplete_RFP_Document.pdf to extract its text content using your built-in file reading capability.
```

**Then parse it:**

```
Parse the extracted text using parseRFPText tool from rfp-server MCP to identify deadlines, criteria, and sections.
```

---

## 🎬 Quick 3-Step Demo

### Step 1: Upload & Check
```
Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP from rfp-server MCP and check compliance.
```

### Step 2: Upload Complete File
```
Upload sample_rfps/complete_RFP_Document.pdf using uploadRFP from rfp-server MCP and check compliance.
```

### Step 3: Generate & Send
```
Generate proposal using generateProposal from rfp-server MCP and send to client@example.com using sendProposalEmail.
```

---

## 🔧 MCP Tools Reference

### Available from rfp-server:

1. **uploadRFP** - Upload RFP file to Azure Blob
2. **parseRFPText** - Extract metadata from text
3. **parseRFPFromBlob** - Parse uploaded file
4. **checkRFPCompliance** - Validate completeness
5. **retrieveSimilarProposals** - Find past proposals
6. **generateProposal** - Create complete proposal
7. **downloadProposalPDF** - Generate PDF
8. **sendProposalEmail** - Send via email

---

## 💡 Demo Tips

- **Start with incomplete file** to show compliance checking value
- **Show the compliance score difference** between incomplete and complete
- **Emphasize time savings** - minutes vs hours/days
- **Highlight Azure integration** - enterprise-grade solution

---

## 📊 Expected Compliance Scores

- **incomplete_RFP_Document.pdf**: 60-70% (missing sections)
- **complete_RFP_Document.pdf**: 90%+ (all sections present)

---

**Demo Duration:** 5-7 minutes  
**Server:** Azure-deployed MCP server  
**Files:** Both PDFs in sample_rfps folder