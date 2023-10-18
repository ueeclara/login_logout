const pool = require('../config/database');

const getAllUsers = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    throw error;
  }
};
// para inserir 
const addUser = async (name, email) => {
  try {
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [name, email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// atualizar um usuário por ID
const updateUser = async (id, name, email) => {
  try {
    const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const { rows } = await pool.query(query, [name, email, id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// excluir um usuário por ID
const deleteUser = async (id) => {
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
