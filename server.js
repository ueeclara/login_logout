const express = require('express');
const router = express.Router();
const { Pool } = require ('pg');


const app = express();
app.use(express.json());


// conexão com o PostgreSQL
const pool = new Pool({
    user: 'aluno_20201214010022',
    host: '177.136.201.182',
    database: 'temp',
    password: '706384',
    port: 5439,
});


// Tratamento de erros na conexão
pool.on('error', (err, client) => {
    console.error('Erro inesperado na conexão com o PostgreSQL:', err);
    process.exit(-1);
});


// rota para consulta no banco de dados
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Erro na consulta:', error);
    res.status(500).json({ error: 'Erro na consulta do banco de dados' });
  }
});
// Rota para inserir um novo usuário
router.post('/users', async (req, res) => {
    try {
      const { name, email } = req.body;
 
      if (!name || !email) {
        return res.status(400).json({ error: 'Nome e email são campos obrigatórios' });
      }
 
      const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
      const { rows } = await pool.query(query, [name, email]);
 
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      res.status(500).json({ error: 'Erro ao inserir usuário no banco de dados' });
    }
  });
 
  // Rota para atualizar um usuário por ID
  router.put('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;
 
      if (!name || !email) {
        return res.status(400).json({ error: 'Nome e email são campos obrigatórios' });
      }
 
      const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
      const { rows } = await pool.query(query, [name, email, userId]);
 
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
 
      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário no banco de dados' });
    }
  });
 
  // Rota para excluir um usuário por ID
  router.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
 
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [userId]);
 
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
 
      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ error: 'Erro ao excluir usuário no banco de dados' });
    }
  });
 
  module.exports = router;
