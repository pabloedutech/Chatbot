Logs do ChatBot

Este é um projeto desenvolvido pela Versátil com o objetivo de armazenar logs de conversas entre um ChatBot e os usuários e salvar esses logs em uma tabela no banco de dados SQL do PlanetScale, bem como gerar um arquivo CSV com esses dados.


Requisitos:
Node.js
MySQL


Bibliotecas requeridas:
mysql
Express
bodyParser
createCsvWriter


Primeiros passos:
1 Crie um Chatbot no DialogFlow
2 Faça o download do Software Ngrok gratuitamente na página: https://ngrok.com
3 Crie uma conta pessoal no Ngrok


Instalação:
1 Clone o repositório para sua máquina
2 Instale as dependências com o comando `npm install`
3 Configure as variáveis de ambiente para conexão com o seu banco de dados no arquivo server.js
(const connection = mysql.createConnection('mysql://...={"rejectUnauthorized":true}'))


Uso:
1. Abra um terminal na pasta raiz onde o repositório foi clonado em sua máquina e inicie o servidor com o comando `npm run dev`
2 Abra o arquivo Ngrok enviado por download. Isso abrirá outra guia do terminal na sua máquina
3 Na aba setup & instalação do site ngrok.com copie o comando mostrado no item 2 (no site Ngrok). A execução desse comando no terminal aberto pelo arquivo Ngrok na sua  máquina adicionará seu token de autenticação ao arquivo de configuração padrão. Aparecerá a seguinte mensagem no terminal: 'Authtoken saved to configuration file: C:\Users\...'
3.2 Logo abaixo, no item 3 (ainda no site Ngrok). Copie o seguite comando: `ngrok http 80` e cole no terminal
3.3 A porta padrão utilizada no Ngrok é 80. Mude para a porta 3000 que foi configurada no servidor local `ngrok http 3000` e pressione enter
4 Copie o caminho https que irá aparecer no terminal 
5 Habilite o Webhook na opção Fullfilment do seu agente no Dialogflow e cole a URL copiada na etapa 3. Não esqueça de clicar no botão salvar no final da página. Agora o webhook criado pelo ngrok está apontando para a porta 3000 do servidor local. 





Interaja com o ChatBot e todos os logs das conversas serão armazenados na tabela logschatbot do seu banco de dados e também serão exportados para um arquivo CSV na pasta 'logs' na raiz do projeto
