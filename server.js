// SCRIPT ADD A SESSÃO (OK até aqui)

// req.body.queryResult.parameters.nome

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

// Conecta ao banco de dados Planetscale
const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
console.log('Conectado ao PlanetScale!')

// Configura time zone
connection.query('SET time_zone = "-03:00";', (err, result) => {
  if (err) throw err;
  console.log('Fuso horário de São Paulo configurado com sucesso!');
});

// Cria tabela de logs-chatbot
connection.query(`
  CREATE TABLE IF NOT EXISTS logschatbot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(255),
    chatBot VARCHAR(255),
    session TEXT,
    timestamp TIMESTAMP
  );
`, (err, result) => {
  if (err) throw err;
  console.log('Tabela logschatbot criada com sucesso!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { queryResult } = req.body;
  const now = new Date();
//   console.log(req.body.session)


  // pegar todo o payload
  const data = {
    user: queryResult.queryText,
    chatBot: queryResult.fulfillmentText,
    session: req.body.session,
    timestamp: now,
    // console.log(req.body)  // corpo da requisição
  };


  // Inseri dados na tabela logschatbot
  connection.query(`
    INSERT INTO logschatbot (user, chatBot, session, timestamp)
    VALUES ('${data.user}', '${data.chatBot}', '${data.session}', NOW());
    
  `, (err, result) => {
    if (err) throw err;
    console.log('Dados inseridos na tabela logschatbot com sucesso!');
  });
});

// cód adicionado

// Consulta SQL para selecionar dados da tabela logschatbot
const sql = 'SELECT * FROM logschatbot';

// Executa consulta SQL
connection.query(sql, (err, results) => {
  if (err) throw err;

  // Escreve dados em um arquivo CSV
  const csvWriter = createCsvWriter({
    path: './logs/logschatbot.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'user', title: 'Usuário' },
      { id: 'chatBot', title: 'ChatBot' },
      { id: 'session', title: 'session' },
      { id: 'timestamp', title: 'Data e Hora' },
    ]
  }); 

  const records = results.map(result => ({
    id: result.id,
    user: result.user,
    chatBot: result.chatBot,
    session: result.session,
    timestamp: result.timestamp.toISOString()
  }));

  csvWriter.writeRecords(records)
    .then(() => console.log('Arquivo CSV criado com sucesso!'))
    .catch(err => console.error(err));
});

// fim cód adicionado

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta:', PORT);
});








// SCRIPT que agrupa as mensagens por sessão (session_id VARCHAR(255) PRIMARY KEY)


// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const app = express();

// // Conecta ao banco de dados Planetscale
// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Conectado ao PlanetScale!')

// // Configura time zone
// connection.query('SET time_zone = "-03:00";', (err, result) => {
//   if (err) throw err;
//   console.log('Fuso horário de São Paulo configurado com sucesso!');
// });

// // Cria tabela de logs-chatbot
// // id INT AUTO_INCREMENT PRIMARY KEY, (linha 26)
// connection.query(`
//   CREATE TABLE IF NOT EXISTS logschatbot (
//     session_id VARCHAR(255) PRIMARY KEY,
//     user VARCHAR(255),
//     chatBot VARCHAR(255),
//     timestamp TIMESTAMP
//   );
// `, (err, result) => {
//   if (err) throw err;
//   console.log('Tabela logschatbot criada com sucesso!');
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.post('/', async (req, res) => {
//   const { queryResult } = req.body;
//   const now = new Date();


//   // Obter o identificador da sessão
//   const sessionId = req.body.session;


//   // Verificar se já existe uma sessão com o mesmo identificador na tabela
//   connection.query(`SELECT * FROM logschatbot WHERE session_id = '${sessionId}'`, (err, results) => {
//     if (err) throw err;

//     if (results.length > 0) {
//       // Se a sessão já existir, atualize os dados da sessão existente
//       const data = {
//         user: queryResult.queryText,
//         chatBot: queryResult.fulfillmentText,
//         timestamp: now,
//       };

//       // connection.query(`
//       //   UPDATE logschatbot SET user = '${data.user}', chatBot = '${data.chatBot}', timestamp = NOW()
//       //   WHERE session_id = '${sessionId}'
//       // `, (err, result) => {
//       //   if (err) throw err;
//       //   console.log('Dados da sessão atualizados na tabela logschatbot com sucesso!');
//       // });

//       connection.query(`
//       INSERT INTO logschatbot (session_id, user, chatBot, timestamp)
//       VALUES ('${sessionId}', '${data.user}', '${data.chatBot}', NOW())
//       ON DUPLICATE KEY UPDATE
//         user = CONCAT(user, ', ', '${data.user}'),
//         chatBot = CONCAT(chatBot, ', ', '${data.chatBot}'),
//         timestamp = NOW()
//     `, (err, result) => {
//       if (err) throw err;
//       console.log('Dados da sessão atualizados ou inseridos na tabela logschatbot com sucesso!');
//     });

      
//     } else {
//       // Se a sessão não existir, inserir um novo registro na tabela
//       const data = {
//         user: queryResult.queryText,
//         chatBot: queryResult.fulfillmentText,
//         timestamp: now,
//       };

//       connection.query(`
//         INSERT INTO logschatbot (session_id, user, chatBot, timestamp)
//         VALUES ('${sessionId}', '${data.user}', '${data.chatBot}', NOW());
//       `, (err, result) => {
//         if (err) throw err;
//         console.log('Nova sessão inserida na tabela logschatbot com sucesso!');
//       });
//     }
//   });
// });

// // cód adicionado

// // Consulta SQL para selecionar dados da tabela logschatbot
// const sql = 'SELECT * FROM logschatbot';

// // Executa consulta SQL
// connection.query(sql, (err, results) => {
//   if (err) throw err;

//   // Escreve dados em um arquivo CSV
//   const csvWriter = createCsvWriter({
//     path: './logs/logschatbot.csv',
//     header: [
//       { id: 'id', title: 'ID' },
//       { id: 'user', title: 'Usuário' },
//       { id: 'chatBot', title: 'ChatBot' },
//       { id: 'timestamp', title: 'Data e Hora' },
//     ]
//   }); 

//   const records = results.map(result => ({
//     id: result.id,
//     user: result.user,
//     chatBot: result.chatBot,
//     // timestamp: result.timestamp.toISOString()
//     timestamp: result.timestamp ? result.timestamp.toISOString() : null
//   }));

//   csvWriter.writeRecords(records)
//     .then(() => console.log('Arquivo CSV criado com sucesso!'))
//     .catch(err => console.error(err));
// });

// // fim cód adicionado

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log('Servidor rodando na porta:', PORT);
// });










// // agrupa as sessões por id na tabela (sobrescreve mensagens)


// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const app = express();

// // Conecta ao banco de dados Planetscale
// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Conectado ao PlanetScale!')

// // Configura time zone
// connection.query('SET time_zone = "-03:00";', (err, result) => {
//   if (err) throw err;
//   console.log('Fuso horário de São Paulo configurado com sucesso!');
// });

// // Cria tabela de logs-chatbot
// connection.query(`
//   CREATE TABLE IF NOT EXISTS logschatbot (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user VARCHAR(255),
//     chatBot VARCHAR(255),
//     sessionId VARCHAR(255),
//     timestamp TIMESTAMP
//   );
// `, (err, result) => {
//   if (err) throw err;
//   console.log('Tabela logschatbot criada com sucesso!');
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const sessions = {};

// app.post('/', async (req, res) => {
//   const { queryResult } = req.body;
//   const now = new Date();
//   const sessionId = req.body.session.split('/').pop();

//   // pegar todo o payload
//   const data = {
//     user: queryResult.queryText,
//     chatBot: queryResult.fulfillmentText,
//     sessionId: sessionId,
//     timestamp: now,
//     // console.log(req.body)  // corpo da requisição
//   };

//   if (!sessions[sessionId]) {
//     // Cria objeto para essa nova sessão
//     sessions[sessionId] = {
//       id: null,
//       rows: []
//     }


//   // Insere dados na tabela logschatbot
//   connection.query(`
//   INSERT INTO logschatbot (user, chatBot, sessionId, timestamp)
//   VALUES ('${data.user}', '${data.chatBot}', '${sessionId}', NOW());`, (err, result) => {
//   if (err) throw err;

//   // Atualiza o ID do objeto da sessão
//   sessions[sessionId].id = result.insertId;

//   console.log('Dados inseridos na tabela logschatbot com sucesso!');
// });
// } else {
// // Adiciona os dados na lista de rows da sessão
// sessions[sessionId].rows.push(data);

// console.log(`Dados adicionados a sessão ${sessionId}`);
// }
// });


// // Consulta SQL para selecionar dados da tabela logschatbot
// const sql = 'SELECT * FROM logschatbot';

// // Executa consulta SQL
// connection.query(sql, (err, results) => {
//   if (err) throw err;

//   // Escreve dados em um arquivo CSV
//   const csvWriter = createCsvWriter({
//     path: './logs/logschatbot.csv',
//     header: [
//       { id: 'id', title: 'ID' },
//       { id: 'user', title: 'Usuário' },
//       { id: 'chatBot', title: 'ChatBot' },
//       { id: 'sessionId', title: 'sessionId' },
//       { id: 'timestamp', title: 'Data e Hora' },
//     ]
//   });

//   const records = results.map(result => ({
//     id: result.id,
//     user: result.user,
//     chatBot: result.chatBot,
//     sessionId: result.sessionId,
//     timestamp: result.timestamp.toISOString()
//   }));

//   csvWriter.writeRecords(records)
//     .then(() => console.log('Arquivo CSV criado com sucesso!'))
//     .catch(err => console.error(err));
// });

// // fim cód adicionado

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log('Servidor rodando na porta:', PORT);
// });








// SCRIPT FINAL    


// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const app = express();

// // Conecta ao banco de dados Planetscale
// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Conectado ao PlanetScale!')

// // Configura time zone
// connection.query('SET time_zone = "-03:00";', (err, result) => {
//   if (err) throw err;
//   console.log('Fuso horário de São Paulo configurado com sucesso!');
// });

// // Cria tabela de logs-chatbot
// connection.query(`
//   CREATE TABLE IF NOT EXISTS logschatbot (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user TEXT,
//     chatBot TEXT,
//     timestamp TIMESTAMP
//   );
// `, (err, result) => {
//   if (err) throw err;
//   console.log('Tabela logschatbot criada com sucesso!');
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.post('/', async (req, res) => {
//   const { queryResult } = req.body;
// //   const result = req.body;  // (dica do LUIZ)
//   const now = new Date();


//   // pegar todo o payload
//   const data = {
//     user: queryResult.queryText,
//     chatBot: queryResult.fulfillmentText,
//     timestamp: now,
//     // console.log(req.body)  // corpo da requisição
//   };

//   // Inseri dados na tabela logschatbot
//   // VALUES ('${data.user}', '${data.chatBot}', '${data.timestamp.toISOString()}');  (linha 53 original)
//   connection.query(`
//     INSERT INTO logschatbot (user, chatBot, timestamp)
//     VALUES ('${data.user}', '${data.chatBot}', NOW());
    
//   `, (err, result) => {
//     if (err) throw err;
//     console.log('Dados inseridos na tabela logschatbot com sucesso!');
//   });
// });

// // cód adicionado

// // Consulta SQL para selecionar dados da tabela logschatbot
// const sql = 'SELECT * FROM logschatbot';

// // Executa consulta SQL
// connection.query(sql, (err, results) => {
//   if (err) throw err;

//   // Escreve dados em um arquivo CSV
//   const csvWriter = createCsvWriter({
//     path: './logs/logschatbot.csv',
//     header: [
//       { id: 'id', title: 'ID' },
//       { id: 'user', title: 'Usuário' },
//       { id: 'chatBot', title: 'ChatBot' },
//       { id: 'timestamp', title: 'Data e Hora' },
//     ]
//   }); 

//   const records = results.map(result => ({
//     id: result.id,
//     user: result.user,
//     chatBot: result.chatBot,
//     timestamp: result.timestamp.toISOString()
//   }));

//   csvWriter.writeRecords(records)
//     .then(() => console.log('Arquivo CSV criado com sucesso!'))
//     .catch(err => console.error(err));
// });

// // fim cód adicionado

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log('Servidor rodando na porta:', PORT);
// });







// SCRIPT FINALIZADO QUE CRIAR ARQ.CSV COM DADOS DA PLAN DO PLANETSCALE



// const mysql = require('mysql2');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const fs = require('fs');

// // Conectar ao banco de dados Planetscale
// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Conectado ao PlanetScale!')

// // Consulta SQL para selecionar dados da tabela logschatbot
// const sql = 'SELECT * FROM logschatbot';

// // Executar consulta SQL
// connection.query(sql, (err, results) => {
//   if (err) throw err;

//   // Escrever dados em um arquivo CSV
//   const csvWriter = createCsvWriter({
//     path: './logs/logschatbot.csv',
//     header: [
//       { id: 'id', title: 'ID' },
//       { id: 'user', title: 'Usuário' },
//       { id: 'chatBot', title: 'ChatBot' },
//       { id: 'timestamp', title: 'Data e Hora' },
//     ]
//   }); 

//   const records = results.map(result => ({
//     id: result.id,
//     user: result.user,
//     chatBot: result.chatBot,
//     timestamp: result.timestamp.toISOString()
//   }));

//   csvWriter.writeRecords(records)
//     .then(() => console.log('Arquivo CSV criado com sucesso!'))
//     .catch(err => console.error(err));
// });









// SCRIPT FINALIZADO QUE SALVA OS LOGS NO PLANETSCALE


// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');

// const app = express();

// // Conectar ao banco de dados Planetscale
// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Conectado ao PlanetScale!')

// // Criar tabela de logs-chatbot
// connection.query(`
//   CREATE TABLE IF NOT EXISTS logschatbot (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user TEXT,
//     chatBot TEXT,
//     timestamp TIMESTAMP
//   );
// `, (err, result) => {
//   if (err) throw err;
//   console.log('Tabela logschatbot criada com sucesso!');
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.post('/', async (req, res) => {
//   const { queryResult } = req.body;
//   const now = new Date();

//   const data = {
//     user: queryResult.queryText,
//     chatBot: queryResult.fulfillmentText,
//     timestamp: now,
//   };

//   // Inserir dados na tabela logschatbot
//   // VALUES ('${data.user}', '${data.chatBot}', '${data.timestamp.toISOString()}');  (linha 41 original)
//   connection.query(`
//     INSERT INTO logschatbot (user, chatBot, timestamp)
//     VALUES ('${data.user}', '${data.chatBot}', NOW());
    
//   `, (err, result) => {
//     if (err) throw err;
//     console.log('Dados inseridos na tabela logschatbot com sucesso!');
//   });
// });


// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log('Servidor rodando na porta:', PORT);
// });




// script original

// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');

// const app = express();

// // Conectar ao banco de dados Planetscale
// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Connected to PlanetScale!')

// // Criar tabela de logs-chatbot
// connection.query(`
//   CREATE TABLE IF NOT EXISTS logschatbot (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user TEXT,
//     chatBot TEXT,
//     timestamp TIMESTAMP
//   );
// `, (err, result) => {
//   if (err) throw err;
//   console.log('Tabela logschatbot criada com sucesso!');
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.post('/', async (req, res) => {
//   const { queryResult } = req.body;
//   const now = new Date();

//   const data = {
//     user: queryResult.queryText,
//     chatBot: queryResult.fulfillmentText,
//     timestamp: now,
//   };

//   // Inserir dados na tabela logs-chatbot
//   connection.query(`
//     INSERT INTO logs-chatbot (user, chatBot, timestamp)
//     VALUES ('${data.user}', '${data.chatBot}', '${data.timestamp.toISOString()}');
//   `, (err, result) => {
//     if (err) throw err;
//     console.log('Dados inseridos na tabela logs-chatbot com sucesso!');
//   });
// });

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log('Servidor rodando na porta:', PORT);
// });







// SALVAR EM UM ARQ CSV 

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');
// const stringify = require('csv-stringify');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.post('/', (req, res) => {
//   const queryText = req.body.queryResult.queryText;
//   const fulfillmentText = req.body.queryResult.fulfillmentText;
  
//   console.log(`User: ${queryText}`);
//   console.log(`ChatBot: ${fulfillmentText}`);

//   // Salva dados no arquivo CSV
//   const data = [[queryText, fulfillmentText]];
//   const csvFilePath = path.join(__dirname, 'data.csv');
//   const header = ['User', 'ChatBot'];
//   const csvOptions = { header };
//   stringify(data, csvOptions, (err, csvString) => {
//     if (err) {
//       console.error(err);
//     } else {
//       fs.appendFile(csvFilePath, csvString, (err) => {
//         if (err) {
//           console.error(err);
//         }
//       });
//     }
//   });
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log('Server up!');
// });






//PRIMEIRO SCRIPT PARA CONECTAR COM O PLANETSCALE


// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');

// const app = express();

// //   ***código adicional***
// // Conectar ao banco de dados Planetscale

// const connection = mysql.createConnection('mysql://(...)):(...)TNWLfa3@aws.connect.psdb.cloud/pablo-versatil?ssl={"rejectUnauthorized":true}')
// console.log('Connected to PlanetScale!')

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Conectado ao MySQL!');
// });



// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.post('/', async (req, res) => {
//   const { queryResult } = req.body;
//   const now = new Date();

//   const data = {
//     user: queryResult.queryText,
//     chatBot: queryResult.fulfillmentText,
//     timestamp: now,
//   };

// });

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log('Servidor rodando na porta:', PORT);
// });

// connection.end()











// SCRIPT ORIGINAL, MOSTRA NO CONSOLE OS LOGS RECEBIDOS DO DIALOGFLOW

// const express = require('express')
// const bodyParser = require('body-parser')

// const app = express()

// app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json())

// app.post('/', (req, res) => {
//     // // \x1b...\x1b deixa fundo VERMELHO
//     console.log(`\x1b[32mUsuário:\x1b[0m \x1b[41m${req.body.queryResult.parameters.nome}\x1b[0m`)
//     console.log(`\x1b[33mPergunta:\x1b[0m ${req.body.queryResult.queryText}`)  
//     console.log(`\x1b[33mresposta:\x1b[0m ${req.body.queryResult.fulfillmentText}`)
//     console.log(`\x1b[32mSession:\x1b[0m ${req.body.session}`)
    

    
    // console.log(`\x1b[33mResponseId:\x1b[0m ${req.body.responseId}`)
    // console.log(req.body)    // corpo da requisição
    // console.log(req.rawHeaders) // headers da requisição
    // console.log(req)         // requisição completa
    // console.log(`\x1b[33mName:\x1b[0m ${req.body.queryResult.intent.name}`)
    
    

    
    // console.log(req.client)
// })


// const PORT = 3000

// app.listen(PORT, () => {
//     console.log('server up!')
// })
