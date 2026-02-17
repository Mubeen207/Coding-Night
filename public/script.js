document.addEventListener("DOMContentLoaded", () => {
  const promptForm = document.getElementById("promptForm");
  const promptInput = document.getElementById("prompt");
  const chatWindow = document.getElementById("chat-window");
  const submitBtn = document.getElementById("submitBtn");

  function appendMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(
      sender === "user" ? "user-message" : "gemini-message",
    );

    messageDiv.innerHTML = text.replace(/\n/g, "<br>");

    chatWindow.appendChild(messageDiv);

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  promptInput.addEventListener("input", () => {
    promptInput.style.height = "auto";
    promptInput.style.height = promptInput.scrollHeight + "px";
  });

  promptForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const prompt = promptInput.value.trim();
    if (prompt === "") return;

    appendMessage(prompt, "user");

    promptInput.value = "";
    promptInput.style.height = "20px";
    submitBtn.disabled = true;
    submitBtn.innerHTML = "...";

    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        appendMessage(data.result, "gemini");
      } else {
        appendMessage(`Error: ${data.error || "Server error."}`, "gemini");
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      appendMessage(
        "Network error ya server se connection toot gaya.",
        "gemini",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "➤";
      promptInput.focus();
    }
  });
});
