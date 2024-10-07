document.addEventListener('DOMContentLoaded', function () {
    // Obtener los elementos del formulario
    const numComprobanteInput = document.getElementById('numCompro');
    const correoCompraInput = document.getElementById('correoCompra');
    const mensajeInput = document.getElementById('msj');
    const pagarBtn = document.querySelector('.btn-success');

    // Obtener el código del servicio desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const codigoServicio = urlParams.get('codigoServicio');
    
    // Obtener el correo del usuario desde el sessionStorage
    const correoUsuario = sessionStorage.getItem('correo');

    if (!correoUsuario) {
        alert('Debe iniciar sesión para realizar el pago.');
        window.location.href = 'inicioSesion.html';
        return;
    }

    // Obtener el precio total desde el sessionStorage
    const totalPrice = sessionStorage.getItem('totalPrice');

    if (!totalPrice) {
        alert('No se pudo obtener el precio total. Intente más tarde.');
        return;
    }

    // Mostrar el precio total en la página
    const totalPriceDisplay = document.getElementById('total-price-display');
    totalPriceDisplay.textContent = `Precio total: ₡${parseFloat(totalPrice).toFixed(2)}`;

    // Función para obtener los detalles del servicio
    async function fetchServiceDetails(codigoServicio) {
        try {
            const response = await fetch(`http://localhost:5005/getService/${codigoServicio}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los detalles del servicio.');
            }

            const service = await response.json();
            renderServiceDetails(service); // Llamar la función para mostrar los detalles
        } catch (error) {
            console.error('Error al obtener los detalles del servicio:', error);
            alert('Error al cargar los detalles del servicio. Intente más tarde.');
        }
    }

    // Función para mostrar los detalles del servicio
    function renderServiceDetails(service) {
        const formFieldset = document.querySelector('fieldset');
        const legend = formFieldset.querySelector('legend');
        const descriptionParagraph = formFieldset.querySelector('p');

        legend.textContent = service.nombre; // Mostrar el nombre de la actividad en el legend
        descriptionParagraph.innerHTML = `
            <strong>Descripción:</strong> ${service.descripcion}<br>
            <strong>Dificultad:</strong> ${service.dificultad}<br>
            <strong>Fecha de salida:</strong> ${new Date(service.horafechasalida).toLocaleString()}<br>
            <strong>Fecha de llegada:</strong> ${new Date(service.horafechallegada).toLocaleString()}<br>
        `;
    }

    // Llamar a la función para cargar los detalles del servicio
    fetchServiceDetails(codigoServicio);

    // Manejar el clic en el botón de pagar
    pagarBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        // Validar los campos del formulario
        const numComprobante = numComprobanteInput.value.trim();
        const correoCompra = correoCompraInput.value.trim();
        const mensaje = mensajeInput.value.trim();

        if (!numComprobante || !correoCompra) {
            alert('Debe completar todos los campos obligatorios.');
            return;
        }

        // Datos del pago que se van a enviar al backend
        const pagoData = {
            codigoServicio: codigoServicio,
            correoUsuario: correoUsuario,
            fechaPago: new Date().toISOString(), // Fecha actual en formato ISO
            metodoPago: 0, // 0 representa SINPE
            monto: parseFloat(totalPrice), // Utilizar el precio total almacenado en sessionStorage
            numComprobante: numComprobante,
            mensaje: mensaje
        };

        try {
            // Realizar la solicitud al backend para registrar el pago
            const response = await fetch('http://localhost:5005/registrarPagoSinpe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pagoData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Pago realizado exitosamente. ¡Gracias por su compra!');
                window.location.href = 'perfilUsuario.html'; // Redirigir a perfil del usuario
            } else {
                alert('Hubo un error al procesar su pago: ' + result.message);
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Ocurrió un error al procesar su pago. Intente más tarde.');
        }
    });
});
