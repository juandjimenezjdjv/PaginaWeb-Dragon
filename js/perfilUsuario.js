document.addEventListener('DOMContentLoaded', function() {
    const correo = sessionStorage.getItem('correo');

    if (!correo) {
        alert('No ha iniciado sesión. Por favor, inicie sesión para ver su historial de pagos.');
        window.location.href = 'inicioSesion.html';
        return;
    }

    // Realizar una solicitud para obtener los pagos del cliente
    fetch(`http://localhost:5005/getPagosPorCliente/${correo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(pagos => {
        renderPagos(pagos);
    })
    .catch(error => {
        console.error('Error al obtener los pagos:', error);
        alert('Hubo un problema al obtener su historial de pagos. Intente más tarde.');
    });

    // Evento para generar el informe en PDF
    document.getElementById('generar-informe-btn').addEventListener('click', function() {
        window.location.href = `http://localhost:5005/generarInformePagos/${correo}`;
    });
});

// Función para renderizar los pagos en la tabla
function renderPagos(pagos) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    pagos.forEach(pago => {
        const row = `
            <tr>
                <td>${pago['Nombre de actividad']}</td>
                <td>${pago['Código de actividad']}</td>
                <td>${pago['Fecha']}</td>
                <td>${pago['Día de compra']}</td>
                <td>₡${pago['Precio']}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}
