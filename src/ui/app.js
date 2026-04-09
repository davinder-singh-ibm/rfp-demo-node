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

// Real-time progress tracking using Server-Sent Events
function trackProgressWithSSE(url, body, progressId, textId, onComplete, onError) {
  // Create a unique request ID for this generation
  const requestId = Date.now();
  
  // Use fetch to initiate the SSE connection
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "demo-mcp-key"
    },
    body: JSON.stringify(body)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    function processStream() {
      reader.read().then(({ done, value }) => {
        if (done) {
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'complete') {
                // Final result received
                updateProgress(progressId, textId, 100);
                onComplete(data.data);
              } else if (data.type === 'error') {
                // Error occurred
                onError(data.error);
              } else if (data.percentage !== undefined) {
                // Progress update
                updateProgress(progressId, textId, data.percentage);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        });

        processStream();
      }).catch(error => {
        console.error('Stream reading error:', error);
        onError(error.message);
      });
    }

    processStream();
  })
  .catch(error => {
    console.error('Fetch error:', error);
    onError(error.message);
  });
}

async function uploadRFP() {
  const fileInput = document.getElementById("rfpFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file first.");
    return;
  }

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
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        updateProgress("uploadProgress", "uploadProgressText", percentComplete);
      }
    });

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        
        // Complete progress to 100%
        updateProgress("uploadProgress", "uploadProgressText", 100);
        
        // Show result after a brief delay
        setTimeout(() => {
          document.getElementById("uploadResult").textContent = JSON.stringify(data, null, 2);
          extractedTextGlobal = data.extractedText;
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

async function generateProposal() {
  if (!extractedTextGlobal) {
    alert("Upload RFP first!");
    return;
  }

  // Show loader
  showLoader("generateLoader", "generateProgress", "generateProgressText", "generateBtn");
  
  // Use real-time progress tracking with SSE
  trackProgressWithSSE(
    "/api/generate-stream",
    { extractedText: extractedTextGlobal },
    "generateProgress",
    "generateProgressText",
    (data) => {
      // Success callback
      generatedProposalData = data;
      
      // Show result after a brief delay
      setTimeout(() => {
        displayProposalResult(data);
        hideLoader("generateLoader", "generateBtn");
        
        // Enable Download and Send Email buttons
        document.getElementById("downloadBtn").disabled = false;
        document.getElementById("sendEmailBtn").disabled = false;
      }, 500);
    },
    (error) => {
      // Error callback
      hideLoader("generateLoader", "generateBtn");
      alert("Generation failed: " + error);
    }
  );
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
