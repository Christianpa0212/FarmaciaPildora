// Abrir modal de "Ver Producto"
document.querySelectorAll('.btn-view').forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.dataset.id;

        const response = await fetch(`/admin/dashboard/products/${productId}`);
        const product = await response.json();

        document.getElementById('viewProductName').textContent = product.name;
        // Otros campos...
    });
});

// Manejar el formulario para añadir producto
document.getElementById('formAddProduct').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const response = await fetch('/admin/dashboard/products', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Producto añadido correctamente');
        location.reload();
    } else {
        alert('Error al añadir el producto');
    }
});
