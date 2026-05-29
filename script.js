const chat = document.getElementById("chat");

function addMessage(sender, text, className) {

  const div = document.createElement("div");

  div.classList.add("message", className);

  const icon =
  sender === "AcessIA"
    ? "🤖"
    : "👤";

div.innerHTML = `
  <div class="message-header">
    ${icon} <strong>${sender}</strong>
  </div>

  <div class="message-text">
    ${text}
  </div>
`;

  chat.appendChild(div);
  saveMessages();

  chat.scrollTop = chat.scrollHeight;
}

function speakText(text) {

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = "pt-BR";

  speech.rate = 1;

  window.speechSynthesis.speak(speech);
}

async function sendMessage() {

  const input =
    document.getElementById("message");

  const message = input.value;

  if (!message) return;

  addMessage("Você", message, "user");

  input.value = "";

  try {

    const typingDiv =
      document.createElement("div");

    typingDiv.classList.add(
      "message",
      "bot"
    );

    typingDiv.id = "typing";

    typingDiv.innerHTML =
      "AcessIA está digitando...";

    chat.appendChild(typingDiv);

    chat.scrollTop = chat.scrollHeight;

    const response = await fetch(
      "http://localhost:3000/chat",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: message
        })
      }
    );

    const data = await response.json();

    document
      .getElementById("typing")
      ?.remove();

    addMessage(
      "AcessIA",
      data.reply,
      "bot"
    );

    speakText(data.reply);

  } catch (error) {

    document
      .getElementById("typing")
      ?.remove();

    addMessage(
      "AcessIA",
      "Erro ao conectar com o servidor.",
      "bot"
    );
  }
}

function startVoice() {

  const recognition =
    new webkitSpeechRecognition();

  recognition.lang = "pt-BR";

  recognition.start();

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    document.getElementById("message").value =
      transcript;
  };
}

let currentFontSize = 16;

function increaseFont() {

  currentFontSize += 2;

  document.querySelectorAll(
    ".message"
  ).forEach((msg) => {

    msg.style.fontSize =
      currentFontSize + "px";
  });

  document.querySelector(
    "input"
  ).style.fontSize =
    currentFontSize + "px";
}

function decreaseFont() {

  currentFontSize -= 2;

  document.querySelectorAll(
    ".message"
  ).forEach((msg) => {

    msg.style.fontSize =
      currentFontSize + "px";
  });

  document.querySelector(
    "input"
  ).style.fontSize =
    currentFontSize + "px";
}

document
  .getElementById("message")
  .addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

      sendMessage();
    }
});
function toggleTheme() {

  document.body.classList.toggle(
    "light-mode"
  );
}
function saveMessages() {

  localStorage.setItem(
    "acessiaChat",
    chat.innerHTML
  );
}

function loadMessages() {

  const savedMessages =
    localStorage.getItem("acessiaChat");

  if (savedMessages) {

    chat.innerHTML = savedMessages;
  }
}

loadMessages();

function clearChat() {

  chat.innerHTML = "";

  localStorage.removeItem(
    "acessiaChat"
  );
}

function toggleTheme() {

  document.body.classList.toggle("light-mode");
}