let extractedTextGlobal = "";
let generatedProposalData = null;

// Helper function to show loader
function showLoader(loaderId, progressId, textId, buttonId) {
  document.getElementById(loaderId).classList.add("active");
  document.getElementById(buttonId).disabled = true;
  document.getElementById(progressId).style.width = "0%";
  document.getElementById(textId).textContent = "0%";
}

// Helper function to hide loader
function hideLoader(loaderId, buttonId) {
  document.getElementById(loaderId).classList.remove("active");
  document.getElementById(buttonId).disabled = false;
}

// Helper function to update progress
function updateProgress(progressId, textId, percentage) {
  document.getElementById(progressId).style.width = percentage + "%";
  document.getElementById(textId).textContent = percentage + "%";
}


async function uploadRFP() {
  const fileInput = document.getElementById("rfpFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  // Hide previous analysis
  document.getElementById("rfpAnalysis").style.display = "none";

  // Show loader
  showLoader("uploadLoader", "uploadProgress", "uploadProgressText", "uploadBtn");
  
  try {
    const formData = new FormData();
    formData.append("rfp", file);

    // Create XMLHttpRequest for upload progress tracking
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 50); // Upload is 50% of total
        updateProgress("uploadProgress", "uploadProgressText", percentComplete);
      }
    });

    // Handle completion
    xhr.addEventListener("load", async () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        
        // Update progress to 50% (upload complete)
        updateProgress("uploadProgress", "uploadProgressText", 50);
        
        // Store extracted text
        extractedTextGlobal = data.extractedText;
        
        // Show basic upload result
        document.getElementById("uploadResult").textContent = JSON.stringify(data, null, 2);
        
        // Now analyze the RFP (parse and compliance check)
        await analyzeRFP(data.extractedText);
        
        // Complete progress to 100%
        updateProgress("uploadProgress", "uploadProgressText", 100);
        
        // Hide loader after brief delay
        setTimeout(() => {
          hideLoader("uploadLoader", "uploadBtn");
        }, 500);
      } else {
        hideLoader("uploadLoader", "uploadBtn");
        alert("Upload failed: " + xhr.statusText);
      }
    });

    // Handle errors
    xhr.addEventListener("error", () => {
      hideLoader("uploadLoader", "uploadBtn");
      alert("Upload failed: Network error");
    });

    // Send request
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("x-api-key", "demo-mcp-key");
    xhr.send(formData);
    
  } catch (error) {
    hideLoader("uploadLoader", "uploadBtn");
    alert("Upload failed: " + error.message);
  }
}

// Analyze RFP: Parse metadata and check compliance
async function analyzeRFP(extractedText) {
  try {
    // Update progress
    updateProgress("uploadProgress", "uploadProgressText", 60);
    
    // Call parse API
    const parseResponse = await fetch("/api/parser/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "demo-mcp-key"
      },
      body: JSON.stringify({ extractedText })
    });
    
    updateProgress("uploadProgress", "uploadProgressText", 75);
    
    // Call compliance API
    const complianceResponse = await fetch("/api/parser/compliance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "demo-mcp-key"
      },
      body: JSON.stringify({ extractedText })
    });
    
    updateProgress("uploadProgress", "uploadProgressText", 90);
    
    // Process responses
    let parseData = null;
    let complianceData = null;
    
    if (parseResponse.ok) {
      parseData = await parseResponse.json();
    }
    
    if (complianceResponse.ok) {
      complianceData = await complianceResponse.json();
    }
    
    // Display analysis results
    displayRFPAnalysis(parseData, complianceData);
    
  } catch (error) {
    console.error("Analysis error:", error);
    // Don't show error to user, just log it - upload was successful
  }
}

// Display RFP analysis results
function displayRFPAnalysis(parseData, complianceData) {
  const analysisDiv = document.getElementById("rfpAnalysis");
  
  // Show analysis section
  analysisDiv.style.display = "block";
  
  // Display compliance score
  if (complianceData) {
    displayComplianceScore(complianceData);
    displayMissingSections(complianceData.missing_sections);
    displayPresentSections(complianceData.present_sections);
  }
  
  // Display metadata
  if (parseData) {
    displayMetadata(parseData);
  }
}

// Display compliance score with visual indicator
function displayComplianceScore(complianceData) {
  const section = document.getElementById("complianceSection");
  const scoreCircle = document.getElementById("scoreCircle");
  const scoreValue = document.getElementById("scoreValue");
  const scoreStatus = document.getElementById("scoreStatus");
  const scoreRecommendation = document.getElementById("scoreRecommendation");
  
  section.style.display = "block";
  
  const score = complianceData.compliance_score || 0;
  // Remove any existing % sign and add it once
  const scoreText = String(score).replace('%', '');
  scoreValue.textContent = scoreText + "%";
  
  // Set color based on score
  scoreCircle.className = "score-circle";
  if (score < 60) {
    scoreCircle.classList.add("low");
    scoreStatus.textContent = "⚠️ Low Compliance";
    scoreStatus.style.color = "#dc3545";
  } else if (score < 80) {
    scoreCircle.classList.add("medium");
    scoreStatus.textContent = "⚡ Moderate Compliance";
    scoreStatus.style.color = "#ffc107";
  } else {
    scoreCircle.classList.add("high");
    scoreStatus.textContent = "✅ High Compliance";
    scoreStatus.style.color = "#28a745";
  }
  
  // Set recommendation
  if (complianceData.recommendation) {
    scoreRecommendation.textContent = complianceData.recommendation;
  } else if (score < 80) {
    scoreRecommendation.textContent = "Consider adding missing sections before generating proposal.";
  } else {
    scoreRecommendation.textContent = "RFP meets compliance requirements. Ready for proposal generation.";
  }
}

// Display missing sections
function displayMissingSections(missingSections) {
  const section = document.getElementById("missingSectionsDiv");
  const list = document.getElementById("missingSectionsList");
  
  if (missingSections && missingSections.length > 0) {
    section.style.display = "block";
    list.innerHTML = "";
    
    missingSections.forEach(sectionName => {
      const tag = document.createElement("div");
      tag.className = "section-tag missing";
      tag.innerHTML = `<span>❌</span><span>${sectionName}</span>`;
      list.appendChild(tag);
    });
  } else {
    section.style.display = "none";
  }
}

// Display present sections
function displayPresentSections(presentSections) {
  const section = document.getElementById("presentSectionsDiv");
  const list = document.getElementById("presentSectionsList");
  
  if (presentSections && presentSections.length > 0) {
    section.style.display = "block";
    list.innerHTML = "";
    
    presentSections.forEach(sectionName => {
      const tag = document.createElement("div");
      tag.className = "section-tag present";
      tag.innerHTML = `<span>✓</span><span>${sectionName}</span>`;
      list.appendChild(tag);
    });
  } else {
    section.style.display = "none";
  }
}

// Display RFP metadata
function displayMetadata(parseData) {
  const section = document.getElementById("metadataSection");
  const grid = document.getElementById("metadataGrid");
  
  section.style.display = "block";
  grid.innerHTML = "";
  
  // Helper function to add metadata item
  function addMetadataItem(label, value) {
    if (value && value !== "N/A" && value !== "Not specified") {
      const item = document.createElement("div");
      item.className = "metadata-item";
      item.innerHTML = `
        <div class="metadata-label">${label}</div>
        <div class="metadata-value">${value}</div>
      `;
      grid.appendChild(item);
    }
  }
  
  // Add various metadata fields
  if (parseData.deadlines && parseData.deadlines.length > 0) {
    addMetadataItem("Deadlines", parseData.deadlines.join(", "));
  }
  
  if (parseData.criteria && parseData.criteria.length > 0) {
    addMetadataItem("Evaluation Criteria", parseData.criteria.join(", "));
  }
  
  if (parseData.pricing) {
    addMetadataItem("Pricing", parseData.pricing);
  }
  
  if (parseData.sections && parseData.sections.length > 0) {
    addMetadataItem("Total Sections", parseData.sections.length.toString());
  }
  
  if (parseData.title) {
    addMetadataItem("Title", parseData.title);
  }
  
  if (parseData.issueDate) {
    addMetadataItem("Issue Date", parseData.issueDate);
  }
  
  if (parseData.deadline) {
    addMetadataItem("Submission Deadline", parseData.deadline);
  }
  
  if (parseData.industry) {
    addMetadataItem("Industry", parseData.industry);
  }
  
  if (parseData.projectType) {
    addMetadataItem("Project Type", parseData.projectType);
  }
  
  // If no metadata items were added, hide the section
  if (grid.children.length === 0) {
    section.style.display = "none";
  }
}

async function generateProposal() {
  if (!extractedTextGlobal) {
    alert("Upload RFP first!");
    return;
  }

  // Show loader
  showLoader("generateLoader", "generateProgress", "generateProgressText", "generateBtn");
  
  try {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      const currentProgress = parseInt(document.getElementById("generateProgress").style.width) || 0;
      if (currentProgress < 90) {
        updateProgress("generateProgress", "generateProgressText", currentProgress + 10);
      }
    }, 1000);

    // Call the regular generate API
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "demo-mcp-key"
      },
      body: JSON.stringify({ extractedText: extractedTextGlobal })
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Generation failed");
    }

    const data = await response.json();
    generatedProposalData = data;
    
    // Complete progress
    updateProgress("generateProgress", "generateProgressText", 100);
    
    // Show result after a brief delay
    setTimeout(() => {
      displayProposalResult(data);
      hideLoader("generateLoader", "generateBtn");
      
      // Enable Download and Send Email buttons
      document.getElementById("downloadBtn").disabled = false;
      document.getElementById("sendEmailBtn").disabled = false;
    }, 500);
    
  } catch (error) {
    hideLoader("generateLoader", "generateBtn");
    alert("Generation failed: " + error.message);
  }
}

// Download the generated proposal as PDF
async function downloadProposal() {
  if (!generatedProposalData || !generatedProposalData.proposal) {
    alert("No proposal available to download!");
    return;
  }

  // Disable button and show loading state
  const downloadBtn = document.getElementById("downloadBtn");
  const originalText = downloadBtn.innerHTML;
  downloadBtn.disabled = true;
  downloadBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating PDF...';

  try {
    // Call the PDF generation API
    const res = await fetch("/api/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "demo-mcp-key"
      },
      body: JSON.stringify({
        proposal: generatedProposalData.proposal,
        companyName: generatedProposalData.companyName,
        rfpData: generatedProposalData.rfpData,
        requirementsJson: generatedProposalData.requirementsJson,
        savedAs: generatedProposalData.savedAs
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to generate PDF");
    }

    // Get the PDF blob
    const blob = await res.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Use the savedAs name or generate a default name
    const filename = generatedProposalData.savedAs
      ? generatedProposalData.savedAs.replace('.txt', '.pdf')
      : `proposal-${Date.now()}.pdf`;
    a.download = filename;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Show success message
    alert("PDF downloaded successfully!");
  } catch (error) {
    alert("PDF download failed: " + error.message);
  } finally {
    // Re-enable button and restore original text
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = originalText;
  }
}

// Send email with the generated proposal
async function sendEmail() {
  if (!generatedProposalData || !generatedProposalData.proposal) {
    alert("No proposal available to send!");
    return;
  }

  // Prompt user for email details
  const recipientEmail = prompt("Enter recipient email address:");
  if (!recipientEmail) {
    return; // User cancelled
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    alert("Please enter a valid email address!");
    return;
  }

  const subject = prompt("Enter email subject:", "RFP Proposal - " + (generatedProposalData.companyName || "Generated Proposal"));
  if (!subject) {
    return; // User cancelled
  }

  // Disable button and show loading state
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const originalText = sendEmailBtn.innerHTML;
  sendEmailBtn.disabled = true;
  sendEmailBtn.innerHTML = '<span class="btn-icon">⏳</span> Sending...';

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "demo-mcp-key"
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: subject,
        proposalText: generatedProposalData.proposal,
        companyName: generatedProposalData.companyName,
        savedAs: generatedProposalData.savedAs,
        rfpData: generatedProposalData.rfpData,
        requirementsJson: generatedProposalData.requirementsJson
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("Email sent successfully to " + recipientEmail + " with PDF attachment!");
    } else {
      alert("Failed to send email: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    alert("Email sending failed: " + error.message);
  } finally {
    // Re-enable button and restore original text
    sendEmailBtn.disabled = false;
    sendEmailBtn.innerHTML = originalText;
  }
}

// Display proposal result in a formatted way
function displayProposalResult(data) {
  const resultElement = document.getElementById("generateResult");
  
  // Create a formatted display
  let formattedOutput = '';
  
  // Add metadata section
  if (data.companyName) {
    formattedOutput += `📋 COMPANY: ${data.companyName}\n\n`;
  }
  
  if (data.rfpData) {
    formattedOutput += '📊 RFP DETAILS:\n';
    if (data.rfpData.title) formattedOutput += `   Title: ${data.rfpData.title}\n`;
    if (data.rfpData.issueDate) formattedOutput += `   Issue Date: ${data.rfpData.issueDate}\n`;
    if (data.rfpData.deadline) formattedOutput += `   Deadline: ${data.rfpData.deadline}\n`;
    formattedOutput += '\n';
  }
  
  if (data.compliance) {
    formattedOutput += `✅ COMPLIANCE SCORE: ${data.compliance.compliance_score}%\n`;
    if (data.compliance.present_sections && data.compliance.present_sections.length > 0) {
      formattedOutput += `   Present Sections: ${data.compliance.present_sections.join(', ')}\n`;
    }
    formattedOutput += '\n';
  }
  
  if (data.requirementsJson) {
    formattedOutput += '🎯 REQUIREMENTS:\n';
    if (data.requirementsJson.industry) formattedOutput += `   Industry: ${data.requirementsJson.industry}\n`;
    if (data.requirementsJson.projectType) formattedOutput += `   Project Type: ${data.requirementsJson.projectType}\n`;
    formattedOutput += '\n';
  }
  
  if (data.retrievedEvidence && data.retrievedEvidence.length > 0) {
    formattedOutput += `📚 SIMILAR PROPOSALS FOUND: ${data.retrievedEvidence.length}\n\n`;
  }
  
  // Add separator
  formattedOutput += '═'.repeat(60) + '\n\n';
  
  // Add the actual proposal content
  if (data.proposal) {
    formattedOutput += data.proposal;
  }
  
  resultElement.textContent = formattedOutput;
}

// Made with Bob
