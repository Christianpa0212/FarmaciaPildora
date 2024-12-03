// Botones y modales
const newMemberAddBtn = document.querySelector('.addMemberBtn'); // Botón "New Member"
const darkBg = document.querySelector('.dark_bg'); // Fondo oscuro del modal
const popupForm = document.querySelector('.popup'); // Contenedor del modal
const crossBtn = document.querySelector('.closeBtn'); // Botón para cerrar el modal
const submitBtn = document.querySelector('.submitBtn'); // Botón "Submit" o "Update"
const modalTitle = document.querySelector('.modalTitle'); // Título del modal
const form = document.querySelector('#userForm'); // Formulario principal del modal

// Campos del formulario
const formInputFields = document.querySelectorAll('form input'); // Todos los campos del formulario
const uploadimg = document.querySelector('#uploadimg'); // Campo para subir imagen
const picturePreview = document.querySelector('.img'); // Vista previa de la imagen cargada

// Tabla y filtro
const userInfo = document.querySelector('tbody'); // Cuerpo de la tabla

const tabSize = document.getElementById('table_size'); // Selector para ajustar el tamaño de la tabla




// Variables de control
let isEdit = false; // Bandera para determinar si el modal está en modo edición
let editId = null; // ID del usuario que se está editando


async function loadUsers() {
        // Realizar una solicitud al backend para obtener los usuarios
        const response = await fetch(`/users?page=${currentIndex}&size=${tableSize}`);
        const { users, totalEntries } = await response.json();

        // Actualizar el total de entradas
        window.totalEntries = totalEntries;

        // Limpiar el contenido actual de la tabla
        userInfo.innerHTML = "";

        // Verificar si hay usuarios
        if (users.length > 0) {
            users.forEach(user => {
                console.log("Renderizando usuario:", user); // Depuración
                const row = `
                    <tr>
                        <td><img src="${user.picture || '/img/admin/users/pic1.png'}" alt="Profile Picture" width="40" height="40"></td>
                        <td>${user.name}</td>
                        <td>${user.paternal}</td>
                        <td>${user.maternal}</td>
                        <td>${user.birthDate}</td>
                        <td>${user.phone}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.branch || 'N/A'}</td>
                        <td>${user.CLABE || 'N/A'}</td>
                        <td>$${user.acumulatedBalance || 0}</td>
                        <td>
                            <button class="view-btn" data-id="${user._id}">View</button>
                            <button class="edit-btn" data-id="${user._id}">Edit</button>
                            <button class="delete-btn" data-id="${user._id}">Delete</button>
                        </td>
                    </tr>`;
                userInfo.innerHTML += row;
            });
        } else {
            userInfo.innerHTML = `
                <tr>
                    <td colspan="12" align="center">No data available</td>
                </tr>`;
        }

        // Actualizar la paginación
        highlightIndexBtn();

}



function renderTable(users) {
    userInfo.innerHTML = ""; // Limpiar la tabla

    if (users.length > 0) {
        users.forEach(user => {
            const row = `
                <tr>
                    <td><img src="${user.picture || '/img/admin/users/pic1.png'}" alt="Profile Picture" width="40" height="40"></td>
                    <td>${user.name}</td>
                    <td>${user.paternal}</td>
                    <td>${user.maternal}</td>
                    <td>${user.birthDate}</td>
                    <td>${user.phone}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.branch || 'N/A'}</td>
                    <td>${user.CLABE || 'N/A'}</td>
                    <td>$${user.acumulatedBalance || 0}</td>
                    <td>
                        <button class="view-btn" data-id="${user._id}">View</button>
                        <button class="edit-btn" data-id="${user._id}">Edit</button>
                        <button class="delete-btn" data-id="${user._id}">Delete</button>
                    </td>
                </tr>`;
            userInfo.innerHTML += row;
        });
    } else {
        userInfo.innerHTML = `
            <tr>
                <td colspan="12" align="center">No data available</td>
            </tr>`;
    }
}


newMemberAddBtn.addEventListener('click', () => {
    isEdit = false; // Indicamos que el modal está en modo "crear nuevo usuario".
    editId = null; // No hay ID de usuario en edición.
    submitBtn.innerHTML = "Guardar"; // Cambiamos el texto del botón para indicar "Guardar".
    modalTitle.innerHTML = "Nuevo Usuario"; // Cambiamos el título del modal.
    darkBg.classList.add('active'); // Mostramos el fondo oscuro que bloquea el resto de la pantalla.
    popupForm.classList.add('active'); // Mostramos el modal.
    form.reset(); // Limpiamos todos los campos del formulario para evitar datos previos.
    picturePreview.src = "/img/admin/users/pic1.png"; // Establecemos la imagen por defecto en la vista previa.
});


crossBtn.addEventListener('click', () => {
    if (modalTitle.textContent === "Ver Usuario") {
        window.location.reload(); // Recargar la página si está en modo View User
    } else {
        // Ocultar modal y limpiar datos para otros modos (crear o editar)
        darkBg.classList.remove('active'); // Ocultar fondo oscuro
        popupForm.classList.remove('active'); // Ocultar modal
        form.reset(); // Restablecer los valores del formulario

        // Restaurar HTML original de Rol y Sucursal
        form.role.parentElement.innerHTML = `
            <label for="role">Rol:</label>
            <select name="role" id="role" required>
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="employee">Employee</option>
            </select>
        `;
        form.branch.parentElement.innerHTML = `
            <label for="branch">Sucursal:</label>
            <select name="branch" id="branch" required>
                <option value="Norte">Norte</option>
                <option value="Centro">Centro</option>
                <option value="Sur">Sur</option>
            </select>
        `;
    }
});







uploadimg.onchange = function () {
    const file = uploadimg.files[0]; // Obtenemos el archivo seleccionado por el usuario.

    if (file && file.size < 1000000) { // Verificamos que el archivo exista y su tamaño sea menor a 1 MB.
        const fileReader = new FileReader(); // Creamos un lector de archivos.

        fileReader.onload = function (e) {
            picturePreview.src = e.target.result; // Actualizamos la vista previa de la imagen con la imagen cargada.
        };

        fileReader.readAsDataURL(file); // Leemos el archivo como una URL para mostrarlo en la vista previa.
    } else {
        alert("The file is too large! Please upload an image smaller than 1MB."); // Mostramos un mensaje de error si el archivo es demasiado grande.
    }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Construir el FormData directamente desde el formulario
    const formData = new FormData(form);

    // Elegir el método y la URL según si es una creación o edición
    const method = isEdit ? 'PATCH' : 'POST';
    const url = isEdit ? `/admin/dashboard/users/update/${editId}` : '/admin/dashboard/users';
    // Realizar la solicitud al backend
    const response = await fetch(url, {
        method,
        body: formData, // Enviar FormData directamente
    });
    window.location.reload();
    
});


async function readInfo(userId) {
        // Restaurar el HTML original antes de cargar nuevos datos
        form.role.parentElement.innerHTML = `
            <label for="role">Rol:</label>
            <select name="role" id="role" required>
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="employee">Employee</option>
            </select>
        `;
        form.branch.parentElement.innerHTML = `
            <label for="branch">Sucursal:</label>
            <select name="branch" id="branch" required>
                <option value="Norte">Norte</option>
                <option value="Centro">Centro</option>
                <option value="Sur">Sur</option>
            </select>
        `;

        const response = await fetch(`/admin/dashboard/users/${userId}`);
        const user = await response.json();

        picturePreview.src = user.picture || '/img/admin/users/pic1.png';
        form.name.value = user.name;
        form.paternal.value = user.paternal;
        form.maternal.value = user.maternal;
        form.birthDate.value = user.birthDate
            ? new Date(user.birthDate).toISOString().slice(0, 10)
            : '';
        form.phone.value = user.phone;
        form.email.value = user.email;
        form.CLABE.value = user.CLABE || '';
        form.password.value = user.password;
        // Ocultar campos dinámicos y reemplazarlos con texto estático
        form.role.parentElement.innerHTML = `
            <label>Rol:</label>
            <div class="informative-field">${user.role}</div>
        `;
        form.branch.parentElement.innerHTML = `
            <label>Sucursal:</label>
            <div class="informative-field">${user.branch || 'N/A'}</div>
        `;

        // Configurar el modal como "solo lectura"
        modalTitle.textContent = "Ver Usuario";
        form.password.parentElement.style.display = 'none'; // Ocultar el campo de contraseña
        submitBtn.style.display = 'none'; // Ocultar el botón de guardar
        formInputFields.forEach((input) => {
            input.disabled = true; // Deshabilitar todos los campos
        });
        uploadimg.disabled = true; // Deshabilitar el input de la imagen
        darkBg.classList.add('active');
        popupForm.classList.add('active');

}


async function editInfo(userId) {

        isEdit = true;
        editId = userId;

        const response = await fetch(`/admin/dashboard/users/${userId}`);
        const user = await response.json();

        // Rellenar los datos en el formulario
        picturePreview.src = user.picture || '/img/admin/users/pic1.png';
        form.name.value = user.name;
        form.paternal.value = user.paternal;
        form.maternal.value = user.maternal;
        form.birthDate.value = user.birthDate
            ? new Date(user.birthDate).toISOString().slice(0, 10)
            : '';
        form.phone.value = user.phone;
        form.email.value = user.email;
        form.role.value = user.role;
        form.branch.value = user.branch || 'N/A';
        form.CLABE.value = user.CLABE || '';
        form.password.value = user.password;

        form.password.parentElement.style.display = 'none';


        // Configurar el modal como editable
        modalTitle.textContent = "Editar Usuario";
        submitBtn.style.display = 'block'; // Mostrar el botón de guardar
        submitBtn.textContent = "Actualizar"; // Cambiar el texto del botón
        darkBg.classList.add('active');
        popupForm.classList.add('active');

}





async function deleteInfo(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
            const response = await fetch(`/admin/dashboard/users/delete/${userId}`, {
                method: 'DELETE',
            });
            window.location.reload();
    }
}


userInfo.addEventListener('click', async (e) => {
    const target = e.target;

    // Botón "View"
    if (target.classList.contains('view-btn')) {
        const userId = target.dataset.id;
        await readInfo(userId); // Mostrar el modal en modo "ver"
    }

    // Botón "Edit"
    if (target.classList.contains('edit-btn')) {
        const userId = target.dataset.id;
        await editInfo(userId); // Mostrar el modal en modo "editar"
    }

    // Botón "Delete"
    if (target.classList.contains('delete-btn')) {
        const userId = target.dataset.id;
        await deleteInfo(userId); // Eliminar usuario
    }
});





filterData.addEventListener('input', async () => {
    const searchTerm = filterData.value.toLowerCase().trim(); // Capturar el término de búsqueda

    try {
        // Solicitar datos filtrados al backend
        const response = await fetch(`/users?page=${currentIndex}&size=${tableSize}&search=${searchTerm}`);
        const { users, totalEntries } = await response.json();

        // Actualizar la tabla con los datos filtrados
        window.totalEntries = totalEntries; // Actualizar el total de entradas globalmente
        renderTable(users); // Renderizar los usuarios filtrados
    } catch (error) {
        console.error("Error filtering users:", error);
        alert("Failed to filter users. Please try again.");
    }
});

loadUsers(); // Llamar a la función para cargar los datos iniciales

