"use strict";

const URL_API = "https://economia.awesomeapi.com.br/last/USD-BRL";
const TEMPO_LIMITE_MS = 7000;

// Intl usa vírgula decimal, símbolo R$ e duas casas no padrão brasileiro.
const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatoData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: "America/Sao_Paulo",
});

const elementos = {
  painel: document.getElementById("painel"),
  cotacao: document.getElementById("cotacao"),
  maxima: document.getElementById("maxima"),
  minima: document.getElementById("minima"),
  atualizacao: document.getElementById("ultima-atualizacao"),
  status: document.getElementById("status"),
  erro: document.getElementById("mensagem-erro"),
  botao: document.getElementById("botao-atualizar"),
  textoBotao: document.getElementById("texto-botao"),
};

function definirStatus(texto, estado) {
  elementos.status.textContent = texto;
  elementos.status.dataset.estado = estado;
}

function limparValores() {
  [elementos.cotacao, elementos.maxima, elementos.minima].forEach((elemento) => {
    elemento.textContent = "—";
  });
  elementos.atualizacao.textContent = "Aguardando dados…";
  elementos.atualizacao.removeAttribute("datetime");
}

function lerValor(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero <= 0) {
    throw new Error("A API retornou uma cotação inválida. Aguarde a próxima consulta.");
  }
  return numero;
}

function lerData(cotacao) {
  // timestamp representa segundos desde a época Unix, sem ambiguidade de fuso.
  let data = new Date(Number(cotacao.timestamp) * 1000);

  if (!Number.isFinite(data.getTime()) || Number(cotacao.timestamp) <= 0) {
    // Alternativa: create_date é informado pela API em UTC-3.
    const dataTexto = cotacao.create_date;
    data = typeof dataTexto === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dataTexto)
      ? new Date(`${dataTexto.replace(" ", "T")}-03:00`)
      : new Date(NaN);
  }

  if (!Number.isFinite(data.getTime())) {
    throw new Error("A API não informou uma data de atualização válida. Aguarde a próxima consulta.");
  }
  return data;
}

async function consultarCotacao() {
  elementos.botao.disabled = true;
  elementos.textoBotao.textContent = "Consultando…";
  elementos.painel.setAttribute("aria-busy", "true");
  elementos.erro.hidden = true;
  limparValores();
  definirStatus("Consultando API…", "carregando");

  // Este temporizador apenas cancela requisições lentas. O recarregamento
  // automático da página é feito exclusivamente pela meta tag do HTML.
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(URL_API, {
      signal: controlador.signal,
      cache: "no-store",
    });

    // fetch não rejeita automaticamente respostas HTTP como 429 ou 500.
    if (!resposta.ok) {
      throw new Error(resposta.status === 429
        ? "O limite de consultas da API foi atingido. Aguarde uma nova tentativa automática."
        : `Não foi possível consultar a API (HTTP ${resposta.status}). Aguarde ou tente atualizar novamente.`);
    }

    const dados = await resposta.json();
    const cotacao = dados?.USDBRL;
    if (!cotacao) {
      throw new Error("A API não retornou a cotação USD/BRL. Aguarde ou tente atualizar novamente.");
    }

    // Valida todos os campos antes de exibir qualquer valor no painel.
    const atual = lerValor(cotacao.bid);
    const maxima = lerValor(cotacao.high);
    const minima = lerValor(cotacao.low);
    const data = lerData(cotacao);

    elementos.cotacao.textContent = formatoMoeda.format(atual);
    elementos.maxima.textContent = formatoMoeda.format(maxima);
    elementos.minima.textContent = formatoMoeda.format(minima);
    elementos.atualizacao.textContent = formatoData.format(data);
    elementos.atualizacao.setAttribute("datetime", data.toISOString());
    definirStatus("Dados recebidos", "sucesso");
  } catch (erro) {
    let mensagem = erro.message;
    if (erro.name === "AbortError") {
      mensagem = "A API demorou para responder. Aguarde a próxima consulta ou tente atualizar novamente.";
    } else if (erro instanceof TypeError) {
      mensagem = "Não foi possível conectar à API. Verifique sua conexão e tente atualizar novamente.";
    } else if (erro instanceof SyntaxError) {
      mensagem = "A API enviou uma resposta inválida. Aguarde a próxima consulta.";
    }

    elementos.erro.textContent = mensagem;
    elementos.erro.hidden = false;
    elementos.atualizacao.textContent = "Indisponível no momento";
    definirStatus("Falha na consulta", "erro");
  } finally {
    clearTimeout(limite);
    elementos.painel.setAttribute("aria-busy", "false");
    elementos.botao.disabled = false;
    elementos.textoBotao.textContent = "Atualizar agora";
  }
}

// Uma consulta na abertura e outra somente quando o usuário solicita.
// A meta tag recarrega o documento a cada 10 segundos e reinicia o script.
elementos.botao.addEventListener("click", consultarCotacao);
consultarCotacao();
