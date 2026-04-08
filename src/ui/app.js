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

// Simulate progress for API calls
function simulateProgress(progressId, textId, duration, callback) {
  let progress = 0;
  const interval = 50; // Update every 50ms
  const increment = (100 / duration) * interval;
  
  const timer = setInterval(() => {
    progress += increment;
    if (progress >= 95) {
      clearInterval(timer);
      updateProgress(progressId, textId, 95);
      // Wait for actual API response to complete to 100%
    } else {
      updateProgress(progressId, textId, Math.floor(progress));
    }
  }, interval);
  
  return timer;
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
  
  // Start progress simulation (2 seconds for upload)
  const progressTimer = simulateProgress("uploadProgress", "uploadProgressText", 2000);

  try {
    const formData = new FormData();
    formData.append("rfp", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    
    // Complete progress to 100%
    clearInterval(progressTimer);
    updateProgress("uploadProgress", "uploadProgressText", 100);
    
    // Show result after a brief delay
    setTimeout(() => {
      document.getElementById("uploadResult").textContent = JSON.stringify(data, null, 2);
      extractedTextGlobal = data.extractedText;
      hideLoader("uploadLoader", "uploadBtn");
    }, 500);
    
  } catch (error) {
    clearInterval(progressTimer);
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
  
  // Start progress simulation (5 seconds for generation - slower as AI processing takes longer)
  const progressTimer = simulateProgress("generateProgress", "generateProgressText", 5000);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extractedText: extractedTextGlobal })
    });

    const data = await res.json();
    
    // Store the generated proposal data
    generatedProposalData = data;
    
    // Complete progress to 100%
    clearInterval(progressTimer);
    updateProgress("generateProgress", "generateProgressText", 100);
    
    // Show result after a brief delay
    setTimeout(() => {
      document.getElementById("generateResult").textContent = JSON.stringify(data, null, 2);
      hideLoader("generateLoader", "generateBtn");
      
      // Enable Download and Send Email buttons
      document.getElementById("downloadBtn").disabled = false;
      document.getElementById("sendEmailBtn").disabled = false;
    }, 500);
    
  } catch (error) {
    clearInterval(progressTimer);
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipientEmail,
        subject: subject,
        proposalText: generatedProposalData.proposal,
        companyName: generatedProposalData.companyName,
        savedAs: generatedProposalData.savedAs
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("Email sent successfully to " + recipientEmail + "!");
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

// Made with Bob
