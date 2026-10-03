document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();
  const image = form.image.files[0];
  const prompt = form.prompt.value;

  if (!image || !prompt) {
    alert("Both image and prompt are required.");
    return;
  }

  formData.append("image", image);
  formData.append("prompt", prompt);

  try {
    const response = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    const resultBox = document.getElementById("result");
    if (result.success) {
      resultBox.innerHTML = `<strong>Response:</strong><br>${result.response.content}`;
    } else {
      resultBox.innerHTML = `<strong>Error:</strong><br>${result.error}`;
    }
    resultBox.style.display = "block";
  } catch (err) {
    console.error("Request failed:", err);
    alert("Failed to send the request. See console for details.");
  }
});
