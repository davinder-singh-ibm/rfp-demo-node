# 🎯 5-Minute RFP Demo Guide

**For IBM Bob + Azure MCP Server**

---

## 📋 What You'll Demonstrate

1. Upload incomplete RFP → See low compliance score (60%)
2. Upload complete RFP → See high compliance score (95%)
3. Generate professional proposal automatically
4. Send via email

**Total Time:** 5 minutes | **Result:** Complete proposal delivered

---

## 🎬 Step-by-Step Demo

### **Step 1: Extract & Check Incomplete RFP** (1 minute)

**Copy this prompt to Bob:**
```
Extract text from sample_rfps/incomplete_RFP_Document.pdf using your PDF extraction skill, then check its compliance using checkRFPCompliance tool from rfp-server MCP.
```

**What happens:**
- 📄 Bob extracts text from PDF using built-in skill
- 🔍 Text sent to Azure MCP server for compliance check
- ⚠️ **Compliance Score: ~57%**
- 📋 Missing sections identified:
  - Executive Summary or Introduction
  - Evaluation Criteria
  - Submission Instructions
  - Terms and Conditions

**Say to audience:**
> "Notice Bob extracted the PDF text and the system detected this RFP is incomplete with only 57% compliance. It identified 4 missing critical sections. This prevents us from generating an incomplete proposal."

---

### **Step 2: Extract & Check Complete RFP** (1 minute)

**Copy this prompt to Bob:**
```
Extract text from sample_rfps/complete_RFP_Document.pdf using your PDF extraction skill, then check its compliance using checkRFPCompliance tool from rfp-server MCP.
```

**What happens:**
- 📄 Bob extracts complete RFP text
- 🔍 Compliance analysis performed
- ✅ **Compliance Score: 90-95%**
- ✅ All required sections present
- ✅ Ready for proposal generation

**Say to audience:**
> "Now with the complete RFP, we have 90%+ compliance. All required sections are present. We can proceed with proposal generation."

---

### **Step 3: Generate Proposal** (2 minutes)

**Copy this prompt to Bob:**
```
Using the extracted text from complete_RFP_Document.pdf, generate a complete proposal using generateProposal tool from rfp-server MCP.
```

**What happens:**
- 🤖 Azure OpenAI analyzes requirements
- 📝 Generates complete proposal with:
  - Executive Summary
  - Understanding of Client Needs
  - Proposed Approach
  - Why Choose Us
  - Governance & Risk Management
  - Implementation Timeline
  - Pricing
- 💾 Saved to Azure Blob Storage

**Say to audience:**
> "In 2 minutes, AI generated a comprehensive proposal that would take 20+ hours manually. It includes all required sections tailored to the RFP requirements."

---

### **Step 4: Send Email** (1 minute)

**Copy this prompt to Bob:**
```
Send the generated proposal via email to client@example.com using sendProposalEmail tool from rfp-server MCP.
```

**What happens:**
- ✅ Professional HTML email sent
- ✅ Proposal content included
- ✅ Delivered via Azure Communication Services
- ✅ Confirmation received

**Say to audience:**
> "Done! The proposal is delivered to the client. What took 20+ hours manually now takes 5 minutes with 95% time savings."

---

## 💡 Key Messages for Audience

### 1. **Compliance Checking = Quality Control**
- Prevents incomplete proposals
- Identifies gaps automatically
- Ensures professional output

### 2. **Massive Time Savings**
- Manual: 20-40 hours per RFP
- Automated: 5 minutes
- **95-98% reduction**

### 3. **Enterprise-Grade Technology**
- Azure OpenAI for AI generation
- Azure Blob Storage for documents
- Azure Communication Services for email
- Secure, scalable, reliable

### 4. **End-to-End Automation**
- Upload → Validate → Generate → Deliver
- No manual intervention needed
- Consistent quality every time

---

## 📊 Results Summary

| Metric | Manual Process | Automated | Savings |
|--------|---------------|-----------|---------|
| **Time** | 20-40 hours | 5 minutes | 95-98% |
| **Quality** | Variable | Consistent | High |
| **Compliance** | Manual check | Automated | 100% |
| **Scalability** | 1-2 RFPs/week | Unlimited | ∞ |

---

## 🎯 One-Shot Demo (Alternative)

If you prefer, copy this single prompt for the complete workflow:

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

## ✅ Pre-Demo Checklist

Before starting:
- [ ] Azure MCP server is running and connected to Bob
- [ ] Files exist: `incomplete_RFP_Document.pdf` and `complete_RFP_Document.pdf`
- [ ] Bob AI Agent is open
- [ ] Email recipient configured

---

## 🐛 Quick Troubleshooting

**If PDF extraction fails:**
- Check file path: `sample_rfps/incomplete_RFP_Document.pdf`
- Verify Bob has access to the file location
- Try with absolute path if needed

**If compliance check fails:**
- Verify MCP server connection in Bob settings
- Check that rfp-server MCP is running

**If compliance is low:**
- This is expected for incomplete RFP! Show the difference
- Proceed to extract complete RFP

**If generation is slow:**
- Normal - Azure OpenAI takes 30-60 seconds
- Emphasize quality over speed

---

## 📈 ROI Calculation for Audience

```
Your Organization:
├─ RFPs per year: [X]
├─ Hours per RFP (manual): 20 hours
├─ Hours per RFP (automated): 0.1 hours
├─ Time saved per RFP: 19.9 hours
└─ Annual savings: [X] × 19.9 hours × [your hourly rate]

Additional Benefits:
+ Better win rate (higher quality)
+ Faster response time (competitive advantage)
+ Handle more RFPs (scalability)
+ Consistent quality (reduced errors)
```

---

## 🎓 Q&A Preparation

**Q: How accurate is compliance checking?**  
A: 95%+ accuracy, checks 15+ standard sections, customizable.

**Q: Can it handle different formats?**  
A: Yes - PDF, DOCX, TXT supported.

**Q: Is it secure?**  
A: Enterprise Azure security, encrypted storage, secure APIs.

**Q: Can we customize templates?**  
A: Absolutely! All prompts are configurable.

---

**Ready to start? Copy Step 1 prompt and paste into Bob! 🚀**

---

**Demo Guide Version:** 1.0  
**Duration:** 5 minutes  
**Difficulty:** Easy  
**Last Updated:** 2026-04-09