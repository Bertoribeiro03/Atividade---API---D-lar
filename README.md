# Câmbio — Dólar comercial

Página em pt-BR feita com HTML, CSS e JavaScript puro para consultar o dólar comercial (USD/BRL) na AwesomeAPI. Não exige instalação de pacotes, framework, compilação ou servidor de aplicação.

## Arquivos

- `index.html`: estrutura acessível e atualização automática.
- `style.css`: painel responsivo com Grid e Flexbox.
- `script.js`: consulta com `fetch()`, validação, formatação e tratamento de erros.

Os três arquivos devem ficar na mesma pasta. O código contém comentários explicativos.

## Executar localmente

1. Abra `index.html` no navegador com conexão à internet.
2. Para servir por HTTP, você também pode usar a extensão Live Server do VS Code ou, com Python instalado, executar `python -m http.server 5500` na pasta do projeto.
3. Nesse caso, abra <http://localhost:5500>. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## Funcionamento

- Endpoint: <https://economia.awesomeapi.com.br/last/USD-BRL>.
- `USDBRL.bid`: cotação atual de compra; `high`: máxima; `low`: mínima.
- `timestamp`: data/hora da API, convertida para o horário de Brasília (`America/Sao_Paulo`). Se necessário, é usado `create_date`, informado pela API em UTC-3. O horário mostrado não é o horário do computador ao fazer a consulta.
- `Intl.NumberFormat` formata os valores em reais, como `R$ 5,20`.
- Estados de carregamento, sucesso e erro ficam visíveis. Há mensagens para indisponibilidade, limite de consultas (HTTP 429), dados inválidos e tempo limite de 7 segundos.
- O botão **Atualizar agora** permite consultar novamente.

O recarregamento da página é feito obrigatoriamente no `<head>` de `index.html`:

```html
<meta http-equiv="refresh" content="10">
```

Não há `setInterval` para atualizar a página. O `setTimeout` no JavaScript serve apenas para cancelar uma requisição que ultrapasse 7 segundos.

A página recarrega a cada 10 segundos, mas isso não garante uma nova cotação em cada consulta: a documentação da AwesomeAPI informa cache de 1 minuto para solicitações sem autenticação. Por isso, confira o horário retornado pela API. Quando não é possível consultar, a página exibe traços e uma mensagem de erro, sem inventar valores.

Documentação: [API de moedas da AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).

## Publicar no GitHub Pages — passo a passo

1. Entre em sua conta no [GitHub](https://github.com) e clique em **New repository** (Novo repositório).
2. Escolha um nome, como `cotacao-dolar`, marque **Public** (Público) e clique em **Create repository**.
3. Na página do repositório vazio, clique em **uploading an existing file**. Se já houver arquivos, use **Add file → Upload files**.
4. Envie `index.html`, `style.css` e `script.js` diretamente para a raiz do repositório. Você também pode enviar este `README.md`. Clique em **Commit changes** para salvar na branch `main`.
5. Abra **Settings → Pages** (Configurações → Páginas).
6. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
7. Em **Branch**, selecione **main** e a pasta **/ (root)**. Clique em **Save**.
8. Aguarde a publicação. O endereço aparecerá nessa mesma página, normalmente como `https://SEU-USUARIO.github.io/cotacao-dolar/`.
9. Abra o endereço e confira a cotação. Alterações futuras nos arquivos da branch `main` serão publicadas automaticamente.

Os caminhos relativos de CSS e JavaScript já estão preparados para GitHub Pages. Não é necessário configurar domínio nem chave de API para usar o endpoint público solicitado.

Referência: [documentação oficial do GitHub Pages](https://docs.github.com/pt/pages/quickstart).
