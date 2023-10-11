const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const addUserButton = document.getElementById('add-user');
const userList = document.getElementById('user-list');

// Carregar dados do Local Storage, se disponível
const storedUsers = JSON.parse(localStorage.getItem('users'));
if (storedUsers) {
    users = storedUsers;
}

// Função para carregar e exibir a lista de usuários da API
async function loadUsers() {
    try {
        const response = await fetch('https://6526a720917d673fd76cb7d2.mockapi.io/users/id/${userId}');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários da API');
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Função para exibir a lista de usuários
function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="edit" onclick="editUser(${user.id})">Editar</button>
                <button class="delete" onclick="deleteUser(${user.id})">Excluir</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Função para adicionar um novo usuário na API
async function addUser() {
    const name = nameInput.value;
    const email = emailInput.value;
    if (name && email) {
        try {
            const response = await fetch('https://6526a720917d673fd76cb7d2.mockapi.io/users/id/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });
            if (!response.ok) {
                throw new Error('Erro ao adicionar usuário à API');
            }
            loadUsers(); // Recarregar a lista de usuários após a adição
            nameInput.value = '';
            emailInput.value = '';
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
        }
    }
}

// Função para editar um usuário na API
async function editUser(userId) {
    const name = nameInput.value;
    const email = emailInput.value;
    if (!name || !email) {
        return;
    }
    try {
        const response = await fetch(`https://6526a720917d673fd76cb7d2.mockapi.io/users/id/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });
        if (!response.ok) {
            throw new Error('Erro ao editar usuário na API');
        }
        loadUsers(); // Recarregar a lista de usuários após a edição
        nameInput.value = '';
        emailInput.value = '';
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
    }
}

// Função para excluir um usuário na API
async function deleteUser(userId) {
    try {
        const response = await fetch(`https://6526a720917d673fd76cb7d2.mockapi.io/users/id/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao excluir usuário na API');
        }
        loadUsers(); // Recarregar a lista de usuários após a exclusão
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
}

// Adicione manipuladores de eventos
addUserButton.onclick = addUser;

// Carregar a lista de usuários inicialmente
loadUsers();
