"use strict";

const express = require("express");
const path = require("node:path");

const app = express();

// O Render informa a porta pela variável PORT. Localmente, usamos 3000.
const porta = process.env.PORT || 3000;

// Disponibiliza o HTML, o CSS e o JavaScript da pasta public.
// O caminho absoluto funciona mesmo ao iniciar o Node de outra pasta.
app.use(express.static(path.join(__dirname, "public")));

// Aceita conexões externas, como exige a hospedagem no Render.
app.listen(porta, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${porta}.`);
});
