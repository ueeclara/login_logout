// Array para armazenar os dados dos usuários
let users = [];

// Referências aos elementos do DOM
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const addUserButton = document.getElementById('add-user');
const userList = document.getElementById('user-list');

// Função para exibir a lista de usuários
function displayUsers() {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="edit" onclick="editUser(${index})">Editar</button>
                <button class="delete" onclick="deleteUser(${index})">Excluir</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Função para adicionar um novo usuário
function addUser() {
    const name = nameInput.value;
    const email = emailInput.value;
    if (name && email) {
        users.push({ name, email });
        displayUsers();
        nameInput.value = '';
        emailInput.value = '';
    }
}

// Função para editar um usuário
function editUser(index) {
    const user = users[index];
    nameInput.value = user.name;
    emailInput.value = user.email;

    addUserButton.innerHTML = 'Salvar Edição';

    addUserButton.onclick = function () {
        user.name = nameInput.value;
        user.email = emailInput.value;
        displayUsers();
        nameInput.value = '';
        emailInput.value = '';
        addUserButton.innerHTML = 'Adicionar Usuário';
        addUserButton.onclick = addUser;
    };
}

// Função para excluir um usuário
function deleteUser(index) {
    users.splice(index, 1);
    displayUsers();
}

// Manipulador de evento para adicionar usuário
addUserButton.onclick = addUser;

// Exibir a lista de usuários inicialmente
displayUsers();
