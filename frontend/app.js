const API_URL = 'http://localhost:3000/people';

// Elementos del DOM
const personForm = document.getElementById('personForm');
const personIdInput = document.getElementById('personId');
const personNameInput = document.getElementById('personName');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const peopleTableBody = document.getElementById('peopleTableBody');

// 1. LEER (GET) - Obtener y listar todas las personas
async function getPeople() {
    try {
        const response = await fetch(API_URL);
        const people = await response.json();
        
        peopleTableBody.innerHTML = ''; // Esto sirve para limpiar la tabla antes de renderizar,
        // evitando asi que se duplique
        
        people.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.id}</td>
                <td>${person.name}</td>
                <td>
                    <button onclick="editPersonSetup('${person.id}', '${person.name}')">Editar</button>
                    <button onclick="deletePerson('${person.id}')" class="btn-eliminar">Eliminar</button>
                </td>
            `;
            peopleTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}