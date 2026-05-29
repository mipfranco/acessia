require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

let conversationHistory = [];

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    conversationHistory.push({
      role: "user",
      content: userMessage
    });

    const completion =
      await openai.chat.completions.create({

      model: "gpt-4.1-mini",

      messages: [

        {
          role: "system",

          content: `
Você é o AcessIA.

Um chatbot acessível e inclusivo.

Ajude pessoas com:
- deficiência visual
- deficiência auditiva

Responda:
- de forma clara
- amigável
- objetiva
- simples

Mantenha contexto da conversa.
`
        },

        ...conversationHistory
      ]
    });

    const botReply =
      completion.choices[0].message.content;

    conversationHistory.push({
      role: "assistant",
      content: botReply
    });

    if (conversationHistory.length > 10) {

  conversationHistory =
    conversationHistory.slice(-10);
}

    res.json({
      reply: botReply
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Erro ao conectar com IA."
    });
  }
});

app.listen(3000, () => {

  console.log(
    "Servidor rodando na porta 3000"
  );
});