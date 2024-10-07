document.addEventListener('DOMContentLoaded', function () {
    // Obtener los elementos del formulario
    const numTarjetaInput = document.getElementById('numTarjeta');
    const codigoSeguridadInput = document.getElementById('codigoSeguridad');
    const correoTarjetaCompraInput = document.getElementById('correoTarjetaCompra');
    const mensajeInput = document.getElementById('msjTarje');
    const pagarBtn = document.querySelector('.btn-success');

    // Obtener el código del servicio desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const codigoServicio = urlParams.get('codigoServicio');
    
    // Obtener el correo del usuario desde el sessionStorage
    const correoUsuario = sessionStorage.getItem('correo');

    // Obtener los detalles del tour y el precio total del sessionStorage
    const alianzasSeleccionadas = JSON.parse(sessionStorage.getItem('alianzasSeleccionadas')) || [];
    const precioTotal = sessionStorage.getItem('totalPrice') || 0;

    if (!correoUsuario) {
        alert('Debe iniciar sesión para realizar el pago.');
        window.location.href = 'inicioSesion.html';
        return;
    }

    async function fetchServiceDetails(codigoServicio) {
        try {
            const response = await fetch(`https://api-dragon.onrender.com/getService/${codigoServicio}`, {
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

    // Mostrar las alianzas seleccionadas
    function mostrarAlianzasSeleccionadas() {
        // Mostrar el precio total
        document.getElementById('precio-total').textContent = `Precio total: ₡${precioTotal}`;
    }

    // Llamar a la función para obtener los detalles del servicio
    if (codigoServicio) {
        fetchServiceDetails(codigoServicio);
    } else {
        document.getElementById('tour-descripcion').textContent = 'No se encontró el servicio.';
    }

    // Mostrar las alianzas seleccionadas
    mostrarAlianzasSeleccionadas();

    // Manejar el clic en el botón de pagar
    pagarBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        // Validar los campos del formulario
        const numTarjeta = numTarjetaInput.value.trim();
        const codigoSeguridad = codigoSeguridadInput.value.trim();
        const correoTarjetaCompra = correoTarjetaCompraInput.value.trim();
        const mensaje = mensajeInput.value.trim();

        if (!numTarjeta || !codigoSeguridad || !correoTarjetaCompra) {
            alert('Debe completar todos los campos obligatorios.');
            return;
        }

        // Datos del pago que se van a enviar al backend
        const pagoData = {
            codigoServicio: codigoServicio,
            correoUsuario: correoUsuario,
            fechaPago: new Date().toISOString(), // Fecha actual en formato ISO
            metodoPago: 1, // 1 representa pago con tarjeta
            monto: parseFloat(precioTotal), // Usar el precio total almacenado en sessionStorage
            numTarjeta: numTarjeta,
            codigoSeguridad: codigoSeguridad,
            correoCompra: correoTarjetaCompra,
            mensaje: mensaje
        };

        try {
            // Realizar la solicitud al backend para registrar el pago
            const response = await fetch('https://api-dragon.onrender.com/registrarPago', {
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
