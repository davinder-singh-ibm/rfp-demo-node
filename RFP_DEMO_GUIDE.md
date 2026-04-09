# RFP Processing Demo Guide - Using Bob AI Agent with MCP Server

This guide demonstrates a complete real-world RFP processing workflow using Bob AI Agent and the RFP MCP Server.

## 🎯 Demo Overview

This demo shows how to:
1. Upload an RFP document (using Bob's file upload skill)
2. Parse the RFP to extract metadata
3. Check compliance before generating proposal
4. Identify missing sections and add them
5. Generate a complete proposal
6. Download as PDF and send via email

---

## 📋 Prerequisites

- Bob AI Agent with MCP Server connected
- RFP document ready (sample: `sample_rfps/rfp_demo_doc.docx`)
- Server running on `http://localhost:3000` or Azure endpoint

---

## 🚀 Step-by-Step Demo Workflow

### **Step 1: Extract Text from RFP Document**

**Prompt to Bob:**
```
Please read the file sample_rfps/rfp_demo_doc.docx to extract its text content. Use your built-in file reading capability to get the full text from the document.
```

**What happens:**
- Bob uses its built-in `read_file` tool to read the DOCX file
- Text content is extracted from the document
- Returns the full `extractedText` content

**Expected Tool Call:**
```xml
<read_file>
<args>
  <file>
    <path>sample_rfps/rfp_demo_doc.docx</path>
  </file>
</args>
</read_file>
```

**Sample Output:**
The extracted text will contain the full RFP content including:
- Introduction
- Project Overview
- Scope of Work
- Functional Requirements
- Technical Requirements
- Deliverables
- Deadlines, Criteria, Pricing

---

### **Step 2: Parse RFP Metadata**

**Prompt to Bob:**
```
Now parse the extracted RFP text to identify key metadata like deadlines, evaluation criteria, and required sections using the parseRFPText tool.
```

**What happens:**
- AI analyzes the RFP text
- Extracts structured metadata:
  - Deadlines
  - Evaluation criteria
  - Required sections
  - Pricing information
  - Technical requirements

**Expected MCP Tool Call:**
```xml
<use_mcp_tool>
<server_name>rfp-server</server_name>
<tool_name>parseRFPText</tool_name>
<arguments>
{
  "body": {
    "extractedText": "[Full RFP text from Step 1]"
  }
}
</arguments>
</use_mcp_tool>
```

**Sample Output:**
```json
{
  "deadlines": ["01-10-1990"],
  "criteria": ["It should be in COBOL, dinosaur language"],
  "pricing": "100$",
  "sections": ["Introduction", "Project Overview", "Scope of Work", "Functional Requirements", "Technical Requirements", "Deliverables"]
}
```

---

### **Step 3: Check RFP Compliance** ⚠️ **CRITICAL STEP**

**Prompt to Bob:**
```
Before generating the proposal, check if the RFP meets compliance requirements using the checkRFPCompliance tool. This will identify any missing sections that need to be addressed.
```

**What happens:**
- AI checks for required proposal sections
- Returns compliance score (0-100)
- Lists missing sections
- Lists present sections

**Expected MCP Tool Call:**
```xml
<use_mcp_tool>
<server_name>rfp-server</server_name>
<tool_name>checkRFPCompliance</tool_name>
<arguments>
{
  "body": {
    "extractedText": "[Full RFP text from Step 1]"
  }
}
</arguments>
</use_mcp_tool>
```

**Sample Output:**
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
  "present_sections": [
    "Introduction",
    "Project Overview",
    "Scope of Work",
    "Technical Requirements"
  ],
  "recommendation": "Add missing sections before generating proposal"
}
```

---

### **Step 4: Add Missing Sections to RFP** 📝

**Prompt to Bob:**
```
The compliance check shows we're missing several important sections. Please help me add the following sections to the RFP text:

1. Executive Summary - A brief overview of the project
2. Company Background - Information about ABC Corporation
3. Team Qualifications - Required team expertise
4. Risk Management - How risks should be addressed
5. Implementation Timeline - Expected project phases

Please suggest content for these sections based on the existing RFP context.
```

**What Bob should do:**
- Analyze the existing RFP content
- Generate appropriate content for missing sections
- Provide the enhanced RFP text

**Enhanced RFP Text Example:**
```
[Original RFP content]

7. Executive Summary
ABC Corporation seeks an innovative AI-powered solution to streamline our RFP response process. This project aims to reduce response time by 60% while maintaining high-quality proposals.

8. Company Background
ABC Corporation is a leading enterprise with 20+ years of experience in technology solutions. We process 100+ RFPs annually and seek to modernize our proposal generation workflow.

9. Team Qualifications
Required team expertise:
- AI/ML Engineers with Azure OpenAI experience
- Cloud Architects (Azure certified)
- Full-stack developers
- Technical writers

10. Risk Management
Vendors must address:
- Data security and compliance
- System availability and disaster recovery
- Integration risks with existing systems
- Change management strategy

11. Implementation Timeline
- Phase 1: Requirements & Design (2 weeks)
- Phase 2: Development (6 weeks)
- Phase 3: Testing & UAT (2 weeks)
- Phase 4: Deployment & Training (1 week)
```

---

### **Step 5: Re-check Compliance**

**Prompt to Bob:**
```
Now that we've added the missing sections, please check compliance again to ensure we meet all requirements.
```

**Expected Result:**
```json
{
  "compliance_score": 95,
  "missing_sections": [],
  "present_sections": [
    "Introduction",
    "Project Overview",
    "Scope of Work",
    "Functional Requirements",
    "Technical Requirements",
    "Deliverables",
    "Executive Summary",
    "Company Background",
    "Team Qualifications",
    "Risk Management",
    "Implementation Timeline"
  ],
  "recommendation": "RFP is compliant. Ready for proposal generation."
}
```

---

### **Step 6: Retrieve Similar Past Proposals**

**Prompt to Bob:**
```
Before generating the proposal, retrieve similar past proposals from our database to use as reference using the retrieveSimilarProposals tool.
```

**Expected MCP Tool Call:**
```xml
<use_mcp_tool>
<server_name>rfp-server</server_name>
<tool_name>retrieveSimilarProposals</tool_name>
<arguments>
{
  "body": {
    "extractedText": "[Enhanced RFP text]",
    "industry": "Technology"
  }
}
</arguments>
</use_mcp_tool>
```

**Sample Output:**
```json
{
  "industry": "Technology",
  "proposals": [
    {
      "id": "prop-001",
      "title": "AI Document Processing Platform",
      "similarityScore": 0.87,
      "content": "Executive Summary: We propose..."
    },
    {
      "id": "prop-002",
      "title": "Cloud Migration Automation",
      "similarityScore": 0.82,
      "content": "Our approach leverages..."
    }
  ]
}
```

---

### **Step 7: Generate Complete Proposal**

**Prompt to Bob:**
```
Now generate a complete proposal using the generateProposal tool. Use the enhanced RFP text with all required sections included.
```

**Expected MCP Tool Call:**
```xml
<use_mcp_tool>
<server_name>rfp-server</server_name>
<tool_name>generateProposal</tool_name>
<arguments>
{
  "body": {
    "extractedText": "[Enhanced RFP text with all sections]"
  }
}
</arguments>
</use_mcp_tool>
```

**What happens:**
- AI generates complete proposal with:
  - Executive Summary
  - Understanding of Client Needs
  - Proposed Approach
  - Why Choose Us
  - Governance & Risk Management
  - Implementation Timeline
  - Pricing
- Proposal is saved to Azure Blob Storage
- Returns complete proposal text and metadata

---

### **Step 8: Download Proposal as PDF**

**Prompt to Bob:**
```
Please download the generated proposal as a PDF using the downloadProposalPDF tool.
```

**Expected MCP Tool Call:**
```xml
<use_mcp_tool>
<server_name>rfp-server</server_name>
<tool_name>downloadProposalPDF</tool_name>
<arguments>
{
  "body": {
    "proposal": "[Generated proposal text]",
    "companyName": "ABC Corporation",
    "rfpData": {
      "deadlines": ["01-10-1990"],
      "pricing": "100$"
    },
    "savedAs": "[blob file name from Step 7]"
  }
}
</arguments>
</use_mcp_tool>
```

**Result:**
- Professional PDF document generated
- Includes branding and formatting
- Ready for submission

---

### **Step 9: Send Proposal via Email**

**Prompt to Bob:**
```
Finally, send the generated proposal via email to the client using the sendProposalEmail tool.
```

**Expected MCP Tool Call:**
```xml
<use_mcp_tool>
<server_name>rfp-server</server_name>
<tool_name>sendProposalEmail</tool_name>
<arguments>
{
  "body": {
    "to": "client@abccorp.com",
    "subject": "Proposal for AI-Powered RFP Response Solution",
    "proposalText": "[Generated proposal text]",
    "companyName": "ABC Corporation",
    "savedAs": "[blob file name]"
  }
}
</arguments>
</use_mcp_tool>
```

**Result:**
- Email sent via Azure Communication Services
- Formatted HTML email with proposal content
- Confirmation with message ID

---

## 🎬 Complete Demo Script

Here's a complete script you can copy-paste to Bob for a full demo:

```
Hi Bob! I need to respond to an RFP. Let's go through the complete workflow:

1. First, read the file sample_rfps/rfp_demo_doc.docx to extract its text content using your built-in file reading capability.

2. Parse the extracted text using the parseRFPText tool from rfp-server MCP to identify deadlines, criteria, and sections.

3. Check compliance using the checkRFPCompliance tool from rfp-server MCP to see if we're missing any required sections.

4. If compliance score is below 80%, help me add the missing sections to the RFP text.

5. Re-check compliance using checkRFPCompliance to ensure we meet all requirements.

6. Retrieve similar past proposals using the retrieveSimilarProposals tool from rfp-server MCP for reference.

7. Generate a complete proposal using the generateProposal tool from rfp-server MCP with the enhanced RFP text.

8. Download the proposal as PDF using the downloadProposalPDF tool from rfp-server MCP.

9. Send the proposal via email to client@abccorp.com using the sendProposalEmail tool from rfp-server MCP.

Please execute these steps one by one and wait for my confirmation after each step.
```

---

## 🔍 Key Points for Demo

### **Why Compliance Check is Critical:**
- Ensures all required sections are present
- Prevents incomplete proposals
- Improves proposal quality
- Increases win rate

### **Real-World Benefits:**
- **Time Savings:** 60-80% reduction in proposal creation time
- **Quality:** Consistent, professional proposals
- **Reusability:** Leverage past successful proposals
- **Compliance:** Automated validation
- **Scalability:** Handle multiple RFPs simultaneously

### **Technical Highlights:**
- Azure OpenAI for AI generation
- Azure Blob Storage for document management
- Azure AI Search for semantic similarity
- Azure Communication Services for email
- RESTful API with MCP integration

---

## 🐛 Troubleshooting

### Issue: "No valid session ID provided"
**Solution:** The MCP server needs to be properly configured with API authentication. Ensure the server is running and accessible.

### Issue: Low compliance score
**Solution:** Add missing sections identified in the compliance check before generating the proposal.

### Issue: No similar proposals found
**Solution:** This is normal for new deployments. The system learns from past proposals over time.

---

## 📊 Success Metrics

After completing the demo, you should have:
- ✅ Uploaded RFP document
- ✅ Extracted and parsed metadata
- ✅ Compliance score > 80%
- ✅ Generated complete proposal
- ✅ PDF document ready
- ✅ Email sent to client

---

## 🎓 Learning Outcomes

This demo showcases:
1. **MCP Integration:** How AI agents can use external tools
2. **Workflow Orchestration:** Multi-step process automation
3. **Quality Control:** Compliance checking before generation
4. **AI-Powered Generation:** Context-aware proposal creation
5. **End-to-End Solution:** From upload to email delivery

---

## 📝 Notes for Presenters

- Emphasize the **compliance check** as a key differentiator
- Show how **missing sections** are identified and added
- Highlight **semantic search** for past proposals
- Demonstrate **time savings** compared to manual process
- Explain **Azure services integration**

---

## 🚀 Next Steps

After the demo:
1. Index more past proposals for better similarity search
2. Customize proposal templates for different industries
3. Add more compliance rules
4. Integrate with CRM systems
5. Add approval workflows

---

**Demo Duration:** 15-20 minutes
**Difficulty Level:** Intermediate
**Prerequisites:** Basic understanding of RFPs and AI concepts

---

*This demo guide is designed for IBM Bob AI Agent with MCP Server integration.*