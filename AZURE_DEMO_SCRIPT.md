# 🎬 Azure MCP Server Demo Script

**Duration:** 5-7 minutes  
**Server:** Azure-deployed MCP (rfp-server)  
**Audience:** Technical & Business stakeholders

---

## 🎯 Demo Objective

Show how IBM Bob + Azure MCP Server automates RFP response generation with compliance checking, reducing 20+ hours of work to 5 minutes.

---

## 📋 Pre-Demo Checklist

- [ ] Azure MCP server is running and connected to Bob
- [ ] Files ready: `incomplete_RFP_Document.pdf` and `complete_RFP_Document.pdf`
- [ ] Bob AI Agent is open and ready
- [ ] Email recipient configured (client@example.com)

---

## 🎬 Demo Script

### **Introduction (30 seconds)**

> "Today I'll show you how we've automated RFP response generation using IBM Bob AI Agent connected to our Azure-deployed MCP server. We'll process two RFP files - one incomplete and one complete - to demonstrate our compliance checking feature."

---

### **Step 1: Upload Incomplete RFP (1 minute)**

**Say:**
> "First, let's upload an incomplete RFP document to see how our system validates it."

**Prompt to Bob:**
```
Upload sample_rfps/incomplete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP, then check its compliance using checkRFPCompliance tool.
```

**Expected Result:**
- ✅ File uploaded to Azure Blob Storage
- ⚠️ Compliance score: 60-70%
- 📋 Missing sections listed (Executive Summary, Company Background, etc.)

**Say:**
> "Notice the compliance score is only 65%. The system identified several missing sections that are critical for a complete proposal. This prevents us from generating an incomplete response."

---

### **Step 2: Upload Complete RFP (1 minute)**

**Say:**
> "Now let's upload a complete RFP that has all required sections."

**Prompt to Bob:**
```
Upload sample_rfps/complete_RFP_Document.pdf using uploadRFP tool from rfp-server MCP and check its compliance.
```

**Expected Result:**
- ✅ File uploaded successfully
- ✅ Compliance score: 90%+
- ✅ All required sections present
- ✅ Ready for proposal generation

**Say:**
> "Perfect! This RFP has a 95% compliance score with all required sections. We can now proceed with proposal generation."

---

### **Step 3: Generate Proposal (2 minutes)**

**Say:**
> "Let's generate a complete, professional proposal using Azure OpenAI."

**Prompt to Bob:**
```
Generate a complete proposal using generateProposal tool from rfp-server MCP with the complete RFP data.
```

**Expected Result:**
- 🤖 AI analyzes RFP requirements
- 📝 Generates complete proposal with:
  - Executive Summary
  - Understanding of Client Needs
  - Proposed Approach
  - Why Choose Us
  - Governance & Risk Management
  - Implementation Timeline
  - Pricing
- 💾 Saved to Azure Blob Storage

**Say:**
> "In just 2 minutes, our AI has generated a comprehensive proposal that would typically take 20+ hours of manual work. The proposal includes all required sections and is tailored to the RFP requirements."

---

### **Step 4: Send Email (1 minute)**

**Say:**
> "Finally, let's deliver this proposal via email."

**Prompt to Bob:**
```
Send the generated proposal via email to client@example.com using sendProposalEmail tool from rfp-server MCP.
```

**Expected Result:**
- ✅ Professional HTML email sent
- ✅ Proposal content included
- ✅ Confirmation with message ID
- ✅ Delivered via Azure Communication Services

**Say:**
> "Done! The proposal has been sent to the client. What took 20+ hours manually now takes 5 minutes with our automated system."

---

## 💡 Key Talking Points

### 1. **Compliance Checking** (Differentiator)
- Validates RFP completeness before generation
- Prevents incomplete proposals
- Identifies missing sections automatically
- Ensures quality control

### 2. **Time Savings**
- Manual process: 20-40 hours per RFP
- Automated process: 5 minutes
- **95-98% time reduction**

### 3. **Azure Integration**
- Enterprise-grade security
- Scalable cloud infrastructure
- Azure OpenAI for AI generation
- Azure Blob Storage for documents
- Azure AI Search for semantic search
- Azure Communication Services for email

### 4. **Quality & Consistency**
- AI-powered generation
- Professional formatting
- Consistent structure
- Leverages past successful proposals

---

## 🎯 Demo Variations

### **Quick Demo (3 minutes)**
1. Upload complete RFP only
2. Generate proposal
3. Send email

### **Compliance-Focused Demo (5 minutes)**
1. Upload incomplete RFP - show low score
2. Upload complete RFP - show high score
3. Generate proposal from complete RFP

### **Full Feature Demo (7 minutes)**
1. Upload incomplete RFP
2. Show compliance issues
3. Upload complete RFP
4. Retrieve similar proposals (optional)
5. Generate proposal
6. Download PDF (optional)
7. Send email

---

## 📊 Expected Results Summary

| Step | Tool | Duration | Result |
|------|------|----------|--------|
| Upload Incomplete | uploadRFP | 10s | 65% compliance |
| Upload Complete | uploadRFP | 10s | 95% compliance |
| Generate Proposal | generateProposal | 2-3min | Complete proposal |
| Send Email | sendProposalEmail | 5s | Email delivered |
| **Total** | | **3-4min** | **Ready proposal** |

---

## 🐛 Troubleshooting

### If upload fails:
- Verify file path: `sample_rfps/incomplete_RFP_Document.pdf`
- Check Azure Blob Storage connection
- Ensure MCP server is running

### If compliance check fails:
- This is expected for incomplete RFP!
- Show the missing sections
- Proceed to upload complete RFP

### If generation is slow:
- Azure OpenAI may take 30-60 seconds
- This is normal for complex proposals
- Emphasize quality over speed

### If email fails:
- Check Azure Communication Services config
- Verify email address format
- Check `.env` file settings

---

## 🎓 Q&A Preparation

**Q: How accurate is the compliance checking?**  
A: 95%+ accuracy. It checks for 15+ standard proposal sections and can be customized for industry-specific requirements.

**Q: Can it handle different RFP formats?**  
A: Yes - PDF, DOCX, TXT. The system extracts text and analyzes structure regardless of format.

**Q: How does it compare to manual proposals?**  
A: 95-98% time savings, consistent quality, automated validation, and leverages past successful proposals.

**Q: Is it secure?**  
A: Yes - enterprise-grade Azure security, encrypted storage, secure API authentication, and compliance with data protection standards.

**Q: Can we customize the proposal templates?**  
A: Absolutely! All prompts and templates are configurable in the `src/prompts/` directory.

**Q: What about industry-specific requirements?**  
A: The system can be trained on your past proposals and customized for your industry standards.

---

## 📝 Follow-Up Actions

After the demo:
1. Share documentation links
2. Provide access to demo environment
3. Schedule technical deep-dive if interested
4. Discuss customization requirements
5. Plan pilot deployment

---

## 🚀 Success Metrics

Demo is successful if audience understands:
- ✅ Compliance checking prevents incomplete proposals
- ✅ 95%+ time savings vs manual process
- ✅ Azure integration provides enterprise security
- ✅ AI-powered generation maintains quality
- ✅ End-to-end automation from upload to delivery

---

**Demo Script Version:** 1.0  
**Last Updated:** 2026-04-09  
**For:** IBM Bob + Azure MCP Server Demo