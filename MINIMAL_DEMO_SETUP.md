# 🎯 Minimal Demo Setup for IBM Bob with Azure MCP Server

This guide shows the **absolute minimum** files and folders needed to copy to a new workspace for demonstrating the RFP automation system with IBM Bob.

---

## 📁 Required Files & Folders

### **Core Configuration (3 files)**
```
.bob/
  └── mcp.json                    # MCP server connection config
.env.example                      # Environment variables template
package.json                      # Dependencies
```

### **Demo Files (2 RFP samples)**
```
sample_rfps/
  ├── incomplete_RFP_Document.pdf  # For showing compliance check (60-70%)
  └── complete_RFP_Document.pdf    # For full proposal generation (90%+)
```

### **Demo Guide (1 file)**
```
DEMO_PROMPTS_BOB_AZURE.md         # Step-by-step prompts for Bob
```

---

## 📦 Total: 6 Files in 2 Folders

```
your-new-workspace/
├── .bob/
│   └── mcp.json
├── sample_rfps/
│   ├── incomplete_RFP_Document.pdf
│   └── complete_RFP_Document.pdf
├── .env.example
├── package.json
└── DEMO_PROMPTS_BOB_AZURE.md
```

---

## 🚀 Setup Steps

### 1. Copy Files to New Workspace
```bash
# Create new workspace directory
mkdir rfp-demo-minimal
cd rfp-demo-minimal

# Copy required files
cp -r /path/to/original/.bob .
cp /path/to/original/.env.example .
cp /path/to/original/package.json .
cp /path/to/original/DEMO_PROMPTS_BOB_AZURE.md .
cp -r /path/to/original/sample_rfps .
```

### 2. Verify MCP Server Configuration
Open `.bob/mcp.json` and confirm it contains:
```json
{
  "mcpServers": {
    "rfp-server": {
      "type": "streamable-http",
      "url": "https://rfp-mcp-g5bqg8dyehbcc0fd.canadacentral-01.azurewebsites.net/mcp",
      "disabled": false,
      "alwaysAllow": ["parseRFPText", "uploadRFP", "checkRFPCompliance"],
      "disabledTools": []
    }
  }
}
```

### 3. Open in VS Code with IBM Bob
```bash
code .
```

---

## ✅ You're Ready!

**No npm install needed** - The app is deployed on Azure, not running locally.

**No .env setup needed** - MCP server handles all Azure connections.

**Just open Bob and start the demo!**

---

## 🎬 Quick Demo Flow

### **Prompt 1: Upload Incomplete RFP**
```
Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP, then check its compliance score using checkRFPCompliance tool.
```
**Result:** ~60-70% compliance, missing sections identified

### **Prompt 2: Upload Complete RFP**
```
Now upload sample_rfps/complete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP and check its compliance.
```
**Result:** 90%+ compliance, ready for proposal

### **Prompt 3: Generate & Send**
```
Generate a complete proposal using generateProposal tool from rfp-server MCP with the complete RFP, then send it via email to client@example.com using sendProposalEmail tool.
```
**Result:** Professional proposal generated and emailed

---

## 🔧 MCP Tools Available

From **rfp-server** (Azure-deployed):
1. `uploadRFP` - Upload RFP to Azure Blob
2. `parseRFPText` - Extract metadata
3. `parseRFPFromBlob` - Parse uploaded file
4. `checkRFPCompliance` - Validate completeness
5. `retrieveSimilarProposals` - Find past proposals
6. `generateProposal` - Create proposal
7. `downloadProposalPDF` - Generate PDF
8. `sendProposalEmail` - Send via email

---

## 💡 Why So Minimal?

- **No local server needed** - App deployed on Azure
- **No dependencies to install** - MCP server handles everything
- **No environment setup** - Azure resources pre-configured
- **Just Bob + 2 PDFs** - Perfect for quick demos

---

## 📊 Demo Duration

**5-7 minutes** for complete workflow demonstration

---

## 🎯 Key Demo Points

✅ Show compliance checking (incomplete vs complete)  
✅ Demonstrate AI-powered proposal generation  
✅ Highlight Azure enterprise integration  
✅ Emphasize time savings (minutes vs hours)

---

## 🆘 Troubleshooting

**Bob can't find MCP tools?**
- Verify `.bob/mcp.json` exists and has correct URL
- Restart VS Code

**Files not uploading?**
- Check Azure MCP server is running: https://rfp-mcp-g5bqg8dyehbcc0fd.canadacentral-01.azurewebsites.net/mcp
- Verify sample PDFs exist in `sample_rfps/` folder

---

**That's it! You're ready to demo with just 6 files.** 🚀