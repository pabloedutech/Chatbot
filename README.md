# Logs do ChatBot

Este é um projeto desenvolvido com o objetivo de armazenar logs de conversas entre um ChatBot e os usuários, salvando esses logs em uma tabela no banco de dados SQL do PlanetScale e gerando um arquivo CSV com esses dados.

## Requisitos
- Node.js
- MySQL
- Dialogflow
- Ngrok

## Bibliotecas requeridas
- mysql
- Express
- bodyParser
- createCsvWriter

## Primeiros passos
1. Crie um Chatbot no DialogFlow.
2. Faça o download do software Ngrok gratuitamente em [https://ngrok.com](https://ngrok.com).
3. Crie uma conta pessoal no Ngrok.

## Instalação
1. Clone o repositório em sua máquina.
2. Instale as dependências com o comando `npm install`.
3. Configure as variáveis de ambiente para conexão com o seu banco de dados no arquivo `server.js`:

```
const connection = mysql.createConnection('mysql://(senha BD):(user BD)={"rejectUnauthorized":true}')
```

## Uso
1. Abra um terminal na pasta raiz onde o repositório foi clonado em sua máquina e inicie o servidor com o comando `npm run dev`.

2. Abra o arquivo Ngrok que foi baixado. Isso abrirá outra guia do terminal em sua máquina.

3. Na aba "setup & instalação" do site [ngrok.com](https://ngrok.com), copie o comando mostrado no item 2 (no site Ngrok). A execução desse comando no terminal aberto pelo arquivo Ngrok adicionará seu token de autenticação ao arquivo de configuração padrão. A seguinte mensagem aparecerá no terminal:

```
Authtoken saved to configuration file: C:\Users\...
```

- Logo abaixo, no item 3 (ainda no site Ngrok), copie o seguinte comando: `ngrok http 80` e cole no terminal.
- A porta padrão utilizada no Ngrok é 80. Mude para a porta 3000 que foi configurada no servidor local: `ngrok http 3000` e pressione Enter.

4. Copie o caminho HTTPS que aparecerá no terminal.

5. Habilite o Webhook na opção "Fullfilment" do seu agente no Dialogflow e cole a URL copiada na etapa 4. Não esqueça de clicar no botão "Salvar" no final da página. Agora o payload gerado pelo dialogflow será enviado através do webhook criado pelo Ngrok, que está apontando para a porta 3000 do servidor local.

6. Interaja com o ChatBot e todos os logs das conversas serão armazenados na tabela `logschatbot` do seu banco de dados e também serão exportados para um arquivo CSV na pasta `logs` na raiz do projeto. 
