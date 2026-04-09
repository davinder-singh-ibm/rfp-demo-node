# 🚀 Quick Start Card - RFP Demo

**⏱️ 5-Minute Demo | 🌐 Azure MCP Server | 🤖 IBM Bob AI Agent**

---

## 📋 Copy-Paste These 3 Prompts

### 1️⃣ Upload Incomplete RFP & Check
```
Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP, then check its compliance using checkRFPCompliance tool.
```
**Result:** 60-70% compliance, missing sections identified ⚠️

---

### 2️⃣ Upload Complete RFP & Check
```
Upload sample_rfps/complete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP and check its compliance.
```
**Result:** 90%+ compliance, ready to generate ✅

---

### 3️⃣ Generate & Send Email
```
Generate a complete proposal using generateProposal tool from rfp-server MCP, then send it via email to client@example.com using sendProposalEmail tool.
```
**Result:** Professional proposal sent in minutes 🎉

---

## 🎯 One-Shot Complete Demo

```
Hi Bob! Execute this RFP workflow:

1. Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP from rfp-server MCP
2. Check compliance using checkRFPCompliance - show me the score
3. Tell me it's incomplete and needs a better file
4. Upload sample_rfps/complete_RFP_Document.pdf using uploadRFP from rfp-server MCP
5. Check compliance again - should be 90%+
6. Generate proposal using generateProposal from rfp-server MCP
7. Send email to client@example.com using sendProposalEmail from rfp-server MCP

Execute step by step and show results.
```

---

## 🔧 MCP Tools Available

| Tool | Purpose |
|------|---------|
| `uploadRFP` | Upload file to Azure Blob |
| `parseRFPText` | Extract metadata from text |
| `parseRFPFromBlob` | Parse uploaded file |
| `checkRFPCompliance` | Validate completeness |
| `retrieveSimilarProposals` | Find past proposals |
| `generateProposal` | Create complete proposal |
| `downloadProposalPDF` | Generate PDF |
| `sendProposalEmail` | Send via email |

---

## 💡 Key Messages

- ⚠️ **Compliance checking prevents incomplete proposals**
- ⏱️ **95% time savings** (20 hours → 5 minutes)
- 🔒 **Enterprise Azure security**
- 🤖 **AI-powered quality**
- 📧 **End-to-end automation**

---

## 📁 Files

- `incomplete_RFP_Document.pdf` → 60-70% compliance
- `complete_RFP_Document.pdf` → 90%+ compliance

---

## 📚 Full Documentation

- **[DEMO_PROMPTS_BOB_AZURE.md](DEMO_PROMPTS_BOB_AZURE.md)** - Detailed prompts
- **[AZURE_DEMO_SCRIPT.md](AZURE_DEMO_SCRIPT.md)** - Complete script with talking points
- **[README_DEMO.md](README_DEMO.md)** - Full overview

---

**Ready? Copy Prompt #1 and paste into Bob! 🚀**