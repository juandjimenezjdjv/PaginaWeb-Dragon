document.addEventListener('DOMContentLoaded', function() {
  const codigoServicio = new URLSearchParams(window.location.search).get('codigoServicio');
  
  // Verificar si hay un código de servicio en la URL
  if (!codigoServicio) {
    alert('No se encontró un código de servicio válido.');
    return;
  }

  let selectedAlianzas = []; // Para almacenar las alianzas seleccionadas
  let totalPrice = 0; // Precio total de las alianzas seleccionadas y el servicio
  let servicePrice = 0; // Precio del servicio principal
  let numPersonas = 1; // Número de personas inicial (mínimo 1)

  // Función para actualizar el texto del precio total y almacenarlo en sessionStorage
  function updateTotalPriceText() {
    const totalConPersonas = totalPrice * numPersonas;
    document.getElementById('total-price-text').textContent = `Precio total: ₡${totalConPersonas.toFixed(2)}`;
    sessionStorage.setItem('totalPrice', totalConPersonas); // Guardar el precio total en sessionStorage
  }

  // Función para calcular el precio basado en el número de personas
  function calcularPrecioPorPersonas() {
    const inputNumPersonas = document.getElementById('numPersonas');
    const cantidadPersonas = parseInt(inputNumPersonas.value);

    if (cantidadPersonas > 15) {
      alert('El número de personas no puede exceder de 15.');
      inputNumPersonas.value = 15; // Limitar a 15
      numPersonas = 15;
    } else {
      numPersonas = cantidadPersonas;
    }

    updateTotalPriceText(); // Mostrar el precio total basado en el número de personas
  }

  // Añadir evento al botón de calcular precio por personas
  document.getElementById('calcularPrecio').addEventListener('click', calcularPrecioPorPersonas);

  // Función para obtener los detalles del servicio principal
  async function fetchServiceDetails(codigoServicio) {
    try {
      const response = await fetch(`https://api-dragon.onrender.com/getService/${codigoServicio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles del servicio');
      }

      const service = await response.json();
      servicePrice = parseFloat(service.precio); // Asegurar que el precio del servicio es un número
      totalPrice = servicePrice; // Inicialmente, el precio total es solo el del servicio
      updateTotalPriceText(); // Mostrar el precio inicial y almacenarlo en sessionStorage
      renderServiceDetails(service); // Mostrar los detalles del servicio
    } catch (error) {
      document.getElementById('service-details').innerHTML = `<p class="error">No se pudo obtener los detalles del servicio. Intenta más tarde.</p>`;
      console.error('Error al obtener los detalles del servicio:', error);
    }
  }

  // Función para obtener las alianzas
  async function fetchAlianzas() {
    try {
      const response = await fetch('https://api-dragon.onrender.com/getServicesByType/5', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las alianzas');
      }

      const alianzas = await response.json();
      renderAlianzas(alianzas.slice(0, 3)); // Solo muestra 3 alianzas (cualesquiera)
    } catch (error) {
      console.error('Error al obtener las alianzas:', error);
      document.querySelector('.alianzas').innerHTML = '<p class="error">No se pudieron cargar las alianzas. Intenta más tarde.</p>';
    }
  }

  // Función para renderizar las alianzas
  function renderAlianzas(alianzas) {
    const alianzasContainer = document.querySelector('.alianzas');
    alianzasContainer.innerHTML = ''; // Limpiar cualquier contenido previo

    alianzas.forEach(alianza => {
      const alianzaHTML = `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${alianza.enlaceimagen || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${alianza.textoalternativo}">
            <div class="card-body">
              <h3 class="card-title">${alianza.nombre}</h3>
              <p class="card-text">${alianza.descripcion}</p>
              <p class="card-text"><strong>Precio:</strong> ₡${alianza.precio}</p>
              <button class="btn btn-success agregar-alianza" data-precio="${alianza.precio}" data-id="${alianza.id}">Agregar alianza</button>
              <button class="btn btn-danger remover-alianza" data-precio="${alianza.precio}" data-id="${alianza.id}" disabled>Remover alianza</button>
            </div>
          </div>
        </div>
      `;
      alianzasContainer.insertAdjacentHTML('beforeend', alianzaHTML);
    });

    // Añadir eventos a los botones de "Agregar" y "Remover"
    const botonesAgregar = document.querySelectorAll('.agregar-alianza');
    const botonesRemover = document.querySelectorAll('.remover-alianza');

    botonesAgregar.forEach(boton => {
      boton.addEventListener('click', function() {
        const precio = parseFloat(this.getAttribute('data-precio'));
        const id = this.getAttribute('data-id');
        const removerBtn = this.nextElementSibling; // Obtener el botón de remover asociado

        if (selectedAlianzas.length >= 3) {
          alert('Solo puedes agregar hasta 3 alianzas.');
          return;
        }

        if (!selectedAlianzas.includes(id)) {
          selectedAlianzas.push(id);
          totalPrice += precio; // Sumar el precio de la alianza seleccionada
          updateTotalPriceText(); // Actualizar el texto del precio total y almacenarlo en sessionStorage
          this.disabled = true; // Desactivar el botón de agregar
          removerBtn.disabled = false; // Activar el botón de remover
        }
      });
    });

    botonesRemover.forEach(boton => {
      boton.addEventListener('click', function() {
        const precio = parseFloat(this.getAttribute('data-precio'));
        const id = this.getAttribute('data-id');
        const agregarBtn = this.previousElementSibling; // Obtener el botón de agregar asociado

        const index = selectedAlianzas.indexOf(id);
        if (index !== -1) {
          selectedAlianzas.splice(index, 1);
          totalPrice -= precio; // Restar el precio de la alianza eliminada
          updateTotalPriceText(); // Actualizar el texto del precio total y almacenarlo en sessionStorage
          this.disabled = true; // Desactivar el botón de remover
          agregarBtn.disabled = false; // Activar el botón de agregar
        }
      });
    });
  }

  // Función para renderizar los detalles del servicio
  function renderServiceDetails(service) {
    const serviceDetailsContainer = document.getElementById('service-details');
    const serviceHTML = `
      <h1>${service.nombre}</h2>
      <img src="${service.enlaceimagen || 'https://via.placeholder.com/400x200'}" alt="${service.textoalternativo}" width="400" height="400">
      <p><strong>Descripción:</strong> ${service.descripcion}</p>
      <p><strong>Dificultad:</strong> ${service.dificultad}</p>
      <p><strong>Fecha de salida:</strong> ${new Date(service.horafechasalida).toLocaleString()}</p>
      <p><strong>Fecha de llegada:</strong> ${new Date(service.horafechallegada).toLocaleString()}</p>
      <p><strong>Precio:</strong> ₡${service.precio}</p>
      <p><strong>Incluye:</strong> ${service.incluyeactividad}</p>
    `;
    serviceDetailsContainer.innerHTML = serviceHTML;
  }

  // Llamar a las funciones para obtener y renderizar los detalles del servicio y las alianzas
  fetchServiceDetails(codigoServicio);
  fetchAlianzas();

  // Asignar eventos de clic a los botones de pago
  const btnPagoSINPE = document.getElementById('pagoSINPE');
  const btnPagoTarjeta = document.getElementById('pagoTarjeta');

  btnPagoSINPE.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = `pagoSINPE.html?codigoServicio=${codigoServicio}`;
  });

  btnPagoTarjeta.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = `pagoTarjeta.html?codigoServicio=${codigoServicio}`;
  });
});
