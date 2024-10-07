document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar el botón de agregar testimonio
    const btnAgregarTestimonio = document.querySelector('a[aria-label="Botón de agregar un testimonio"]');

    // Agregar evento click al botón
    btnAgregarTestimonio.addEventListener('click', async function (event) {
        event.preventDefault();

        // Obtener los valores de los inputs del formulario
        const nombreCliente = document.getElementById('clientetestimonio').value;
        const testimonio = document.getElementById('testimonio').value;

        // Validar que los campos no estén vacíos
        if (nombreCliente.trim() === '' || testimonio.trim() === '') {
            alert('Por favor, complete todos los campos antes de agregar el testimonio.');
            return;
        }

        // Preparar los datos para enviar
        const data = {
            nombreUsuario: nombreCliente,
            comentario: testimonio
        };

        try {
            // Realizar la petición POST a la API
            const response = await fetch('https://api-dragon.onrender.com/createTestimonie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Verificar si la petición fue exitosa
            if (response.ok) {
                const result = await response.json();
                alert(result.message);  // Mostrar mensaje de éxito
                // Limpiar el formulario
                document.getElementById('clientetestimonio').value = '';
                document.getElementById('testimonio').value = '';
            } else {
                alert('Error al agregar el testimonio.');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            alert('Hubo un error al conectarse con el servidor.');
        }
    });
});
