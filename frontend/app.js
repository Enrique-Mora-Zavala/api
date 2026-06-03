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

// 2. CREAR (POST) / ACTUALIZAR (PUT) - Manejo del Formulario
personForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Esto sirve para evitar que la página se recargue
    
    const id = personIdInput.value;
    const name = personNameInput.value;
    
    const personData = { name: name };

    if (id) {
        // Si existe un Id, se usa el método de actualización (PUT)
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(personData),
                headers: { 'Content-type': 'application/json; charset=UTF-8' }
            });
            resetForm();
            getPeople();

        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    } else {
        // Si no hay un Id, se usa el método de creación (POST)
        try {
             // 1. Obtenemos la lista actual para ver las personas existentes
            const res = await fetch(API_URL);
            const currentPeople = await res.json();
            
            // 2. Buscamos el Id con el valor más alto (si no hay ninguno, empezamos con el 1)
            const maxId = currentPeople.reduce((max, p) => {
                const currentId = parseInt(p.id);
                return !isNaN(currentId) && currentId > max ? currentId : max;
            }, 0);
            
            // 3. Le asignamos el siguiente número al Id del nuevo registro
            const newPersonData = { 
                id: maxId + 1, 
                name: name 
            };

            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(newPersonData),
                headers: { 'Content-type': 'application/json; charset=UTF-8' }
            });

            resetForm();
            getPeople();
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    }
});