const express = require('express');
const { Pool } = require ('pg');

const app = express();

// conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'seu_host',
    database: 'seu_banco_de_dados',
    password: 'sua_senha',
    port: 5432, // Porta padrão do PostgreSQL
});

// Tratamento de erros na conexão 
pool.on('error', (err, client) => {
    console.error('Erro inesperado na conexão com o PostgreSQL:', err);
    process.exit(-1);
});

// rota para consulta no banco de dados
app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao consultar dados no PostgreSQL:', error);
        res.status(500).json({ error: 'Erro ao consultar dados no PostgreSQL' });
    }
});
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Nome e email são campos obrigatórios' });
        }

        const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
        const { rows } = await pool.query(query, [name, email]);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao inserir dados no PostgreSQL:', error);
        res.status(500).json({ error: 'Erro ao inserir dados no PostgreSQL' });
    }
});
app.put('/users/:id', async (req, res) => {
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
        console.error('Erro ao atualizar usuário no PostgreSQL:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário no PostgreSQL' });
    }
});
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário no PostgreSQL:', error);
        res.status(500).json({ error: 'Erro ao excluir usuário no PostgreSQL' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
