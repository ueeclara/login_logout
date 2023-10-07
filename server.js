const express = require('express');
const { Pool } = require('pg');

const app = express();

// Configurações da conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'seu_host',
    database: 'seu_banco_de_dados',
    password: 'sua_senha',
    port: 5432, // Porta padrão do PostgreSQL
});

// Tratamento de erros na conexão com o PostgreSQL
pool.on('error', (err, client) => {
    console.error('Erro inesperado na conexão com o PostgreSQL:', err);
    process.exit(-1);
});

// Exemplo de rota para consulta no banco de dados
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

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
