let extractedTextGlobal = "";

async function uploadRFP() {
  const fileInput = document.getElementById("rfpFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("rfp", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("uploadResult").textContent = JSON.stringify(data, null, 2);

  extractedTextGlobal = data.extractedText;
}

async function generateProposal() {
  if (!extractedTextGlobal) {
    alert("Upload RFP first!");
    return;
  }

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ extractedText: extractedTextGlobal })
  });

  const data = await res.json();
  document.getElementById("generateResult").textContent = JSON.stringify(data, null, 2);
}