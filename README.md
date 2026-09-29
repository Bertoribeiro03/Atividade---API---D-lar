# Câmbio — Cotação do dólar com Node.js e Express

Aplicação em pt-BR que consulta o dólar comercial (USD/BRL) na AwesomeAPI. O servidor Express entrega os arquivos da pasta `public/`, e o JavaScript do navegador consulta a cotação por HTTPS. O visual, os comentários e o comportamento do site anterior foram preservados.

## 1. Estrutura de pastas

```text
Atividade---API---D-lar/
├── public/
│   ├── index.html       # Estrutura da página (HTML)
│   ├── style.css        # Aparência e responsividade (CSS)
│   └── script.js        # Consulta e exibição da cotação (JavaScript)
├── server.js            # Servidor Node.js com Express (JavaScript)
├── package.json         # Dependências e comando de inicialização
├── package-lock.json    # Versões exatas instaladas pelo npm
├── .gitignore           # Arquivos que o Git deve ignorar
└── README.md            # Este guia
```

A pasta `node_modules/` é criada ao instalar as dependências e não é enviada ao GitHub. O `package-lock.json` deve ser enviado.

Os links `href="style.css"` e `src="script.js"` continuam funcionando: o Express expõe o conteúdo de `public/` na raiz do site. Assim, as URLs são `/`, `/style.css` e `/script.js`, sem `/public` no endereço.

## 2. Servidor: server.js

```js
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
```

O middleware `express.static()` entrega automaticamente o `index.html` ao acessar `/`. `__dirname` identifica a pasta de `server.js`, e `path.join()` monta o caminho correto no Windows e no Linux. Apenas a pasta `public/` fica disponível pelo servidor. [Documentação do Express](https://expressjs.com/en/starter/static-files/).

## 3. Configuração do Node

Conteúdo de `package.json`:

```json
{
  "name": "cotacao-dolar",
  "version": "1.0.0",
  "description": "Cotação do dólar em reais com HTML, CSS, JavaScript e Express.",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "24.x"
  },
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

`npm start` executa `node server.js`. `private: true` evita publicar o projeto acidentalmente no registro npm; o repositório GitHub e o site ainda podem ser públicos. `engines.node` mantém o projeto na versão principal 24 do Node, também reconhecida pelo Render. [Configuração do Node no Render](https://render.com/docs/node-version).

Conteúdo de `.gitignore`:

```gitignore
# Dependências instaladas pelo npm.
node_modules/

# Configurações locais e registros de erro.
.env
.env.*
npm-debug.log*
```

## 4. Testar localmente

Instale o Node.js 24, com npm, pelo [site oficial do Node.js](https://nodejs.org/). Para publicar, tenha também o [Git](https://git-scm.com/downloads) instalado.

1. Abra o terminal na pasta que contém `package.json` e `server.js`. Neste computador, no PowerShell:

   ```powershell
   cd "C:\Users\BERTO\Documents\aula-4-main\Atividade---API---D-lar"
   ```

2. Confira as instalações:

   ```powershell
   node --version
   npm --version
   git --version
   ```

3. Instale as dependências já declaradas e inicie o servidor:

   ```powershell
   npm install
   npm start
   ```

4. Aguarde a mensagem `Servidor iniciado na porta 3000.` e abra [http://localhost:3000](http://localhost:3000).
5. Confira o CSS, a cotação, a máxima, a mínima e a última atualização. Clique em **Atualizar agora** e aguarde também o recarregamento automático de 10 segundos.
6. Mantenha o terminal aberto enquanto usa o site. Para encerrar, pressione `Ctrl+C`.

### Como iniciar um projeto do zero com npm init

Este projeto já tem `package.json`; não é necessário recriá-lo. Para repetir a configuração em uma pasta nova, execute:

```powershell
npm init -y
npm install express
npm pkg set "scripts.start=node server.js" "engines.node=24.x"
```

`npm init -y` cria o `package.json`; `npm install express` instala e registra o Express; o último comando configura o início e a versão do Node. Depois, crie o `server.js`, o `.gitignore` e a pasta `public/` conforme este guia, coloque nela os três arquivos do site e execute `npm start`.

### Conferir a variável PORT

Depois de encerrar o servidor, você pode testar outra porta no PowerShell:

```powershell
$env:PORT = "4000"
npm start
```

Abra [http://localhost:4000](http://localhost:4000). Ao terminar, pressione `Ctrl+C` e remova a variável apenas desse terminal:

```powershell
Remove-Item Env:PORT
```

## 5. Enviar o código ao GitHub

### Usar o repositório já configurado neste projeto

Esta pasta já está na branch `main` e possui o remoto `origin` apontando para [Bertoribeiro03/Atividade---API---D-lar](https://github.com/Bertoribeiro03/Atividade---API---D-lar).

No terminal, na raiz do projeto, confira e envie a migração:

```powershell
git status
git remote -v
git add .
git commit -m "Migra site de cotacao para Node.js com Express"
git push -u origin main
```

Se o Git pedir sua identidade, configure seu nome e o e-mail associado à sua conta e repita o commit:

```powershell
git config user.name "Seu Nome"
git config user.email "seu-email@example.com"
```

Se houver uma solicitação de login no envio, conclua a autenticação do GitHub no navegador ou no gerenciador de credenciais. Se o terminal solicitar uma senha para HTTPS, o GitHub exige um token de acesso pessoal em vez da senha da conta. [Autenticação por HTTPS](https://docs.github.com/en/get-started/git-basics/about-remote-repositories#cloning-with-https-urls).

### Criar e enviar um repositório novo, do zero

Use esta alternativa somente se estiver começando em uma pasta nova, sem configuração Git. Para o projeto atual, siga o bloco anterior.

1. Entre no [GitHub](https://github.com/) e clique em **+ → New repository**.
2. Escolha um nome, por exemplo `cotacao-dolar`, e a visibilidade desejada. Para facilitar o acesso do professor, você pode escolher **Public**.
3. Deixe desmarcadas as opções de criar README, `.gitignore` e licença: esses arquivos serão enviados do computador.
4. Clique em **Create repository** e copie a URL HTTPS.
5. Na pasta local com os arquivos deste projeto, execute os comandos abaixo. Substitua `SEU-USUARIO` pela sua conta e ajuste o nome do repositório, se necessário:

   ```powershell
   git init
   git add .
   git commit -m "Cria aplicacao de cotacao com Express"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/cotacao-dolar.git
   git push -u origin main
   ```

6. Atualize a página do repositório e confirme que `public/`, `server.js`, `package.json`, `package-lock.json`, `.gitignore` e `README.md` estão presentes. `node_modules/` não deve aparecer.

O GitHub guarda o código; o processo Node.js será executado no Render. Para esta atividade, a hospedagem será um **Web Service**. [Guia oficial de envio ao GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## 6. Hospedar no Render

1. Acesse [Render.com](https://render.com/), crie sua conta ou entre nela e abra o painel.
2. Clique em **New + → Web Service**.
3. Em **Git Provider**, conecte sua conta GitHub e permita o acesso ao repositório que será publicado.
4. Selecione `Atividade---API---D-lar` ou o novo repositório que você criou.
5. Preencha os campos:

   | Campo | Valor |
   | --- | --- |
   | Name | Um nome disponível, como `cotacao-dolar-berto` |
   | Language / Runtime | `Node` |
   | Branch | `main` |
   | Region | Escolha uma das regiões disponíveis |
   | Root Directory | Deixe vazio: `package.json` está na raiz do repositório |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | `Free`, para a atividade |

6. O Render fornece `PORT` automaticamente. A linha `process.env.PORT || 3000` já utiliza esse valor, e o servidor aceita conexões em `0.0.0.0`. Não é necessário cadastrar a porta manualmente. [Portas no Render](https://render.com/docs/web-services#port-binding).
7. Clique em **Create Web Service** e acompanhe a instalação e a inicialização nos registros da implantação.
8. Aguarde a indicação de que o serviço está ativo, como **Live**. Com a publicação automática habilitada, os próximos envios para `main` iniciam uma nova implantação. [Guia oficial de Express no Render](https://render.com/docs/deploy-node-express-app).

A pasta raiz deve conter `server.js` e `package.json`; não selecione `public/` como Root Directory. O Express é quem disponibiliza essa pasta.

## 7. Obter, testar e entregar o link público

1. Copie a URL HTTPS exibida na página do serviço no Render. O formato é `https://meu-projeto.onrender.com`; esse endereço é apenas um exemplo, e o link real só existe após a publicação.
2. Abra o link real em uma janela anônima para confirmar que o acesso não depende do seu login.
3. Confira se a página aparece com o estilo correto e se mostra a cotação em reais, a máxima, a mínima e a data da API em horário de Brasília.
4. Clique em **Atualizar agora** e aguarde pelo menos 10 segundos para conferir o recarregamento automático.
5. Abra o endereço também no celular e confira a organização dos cartões.
6. Para conferir os arquivos publicados, abra `/style.css` e `/script.js` no mesmo domínio. Exemplo de formato: `https://meu-projeto.onrender.com/style.css`.
7. Envie o **link público do Render** na atividade. O endereço `localhost` só funciona no seu computador.

No plano Free, o serviço pode parar após 15 minutos sem acessos e levar cerca de um minuto para voltar no primeiro acesso seguinte. Aguarde o carregamento antes de avaliar o resultado. [Funcionamento do plano gratuito](https://render.com/docs/free#spinning-down-on-idle).

## Funcionamento da cotação

- `public/script.js` consulta `https://economia.awesomeapi.com.br/last/USD-BRL` diretamente pelo navegador.
- `USDBRL.bid`, `high` e `low` fornecem a compra, a máxima e a mínima.
- `timestamp` informa a data/hora da fonte. O painel formata esse horário para `America/Sao_Paulo`.
- O HTML recarrega a página a cada 10 segundos com `<meta http-equiv="refresh" content="10">`.
- O JavaScript trata falhas, dados inválidos e tempo limite de 7 segundos, sem inventar cotações. A frequência de novos valores depende da fonte.

Referência: [documentação da AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).

## Soluções rápidas

| Situação | O que conferir |
| --- | --- |
| `npm` não é reconhecido | Instale o Node.js com npm e reabra o terminal. |
| PowerShell bloqueia `npm.ps1` | Execute `npm.cmd install` e `npm.cmd start`, ou use o Prompt de Comando. |
| `Cannot find module 'express'` | Execute `npm install` na pasta que contém `package.json`. |
| Porta 3000 ocupada (`EADDRINUSE`) | Encerre a outra instância deste projeto ou teste com `PORT=4000`, conforme o exemplo de PowerShell. |
| Git informa `remote origin already exists` | Confira `git remote -v`; no projeto atual, use o remoto já configurado. |
| O envio ao GitHub é rejeitado | Confira login, permissões e alterações remotas. Se o remoto avançou, com suas mudanças já commitadas, use `git pull --rebase origin main`, resolva eventuais conflitos e tente o push novamente. |
| Render não encontra `package.json` | Confira a branch publicada e mantenha Root Directory vazio para esta estrutura. |
| Página abre sem estilo | Confira se `public/style.css` foi enviado, mantendo letras minúsculas no nome e no link do HTML. |
| Cotação mostra erro | Verifique a conexão e o serviço da AwesomeAPI. HTTP 429 significa limite de consultas; aguarde antes de tentar novamente. |
| A versão online não mudou | Confira se fez commit e push e se a implantação mais recente no Render terminou com sucesso. |
