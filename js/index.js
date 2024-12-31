document.addEventListener('DOMContentLoaded', () => {
    // Llamada para obtener y renderizar los servicios aleatorios
    fetchRandomTours();
    // Llamada para obtener y renderizar los testimonios aleatorios
    fetchRandomTestimonies();
    const buscarBtn = document.querySelector('button[aria-label="Iniciar búsqueda"]');
    const buscarInput = document.querySelector('#buscar');

    buscarBtn.addEventListener('click', () => {
        const searchQuery = buscarInput.value;
        if (searchQuery.trim()) {
            // Guardar la búsqueda en sessionStorage
            sessionStorage.setItem('searchQuery', searchQuery);
            // Redirigir a la página de servicios.html
            window.location.href = 'servicios.html';
        }
    });

    // Función para obtener los tours aleatorios
    async function fetchRandomTours() {
        try {
            const response = await fetch('https://api-dragon.onrender.com/get3RandomServices', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los tours');
            }
            const tours = await response.json();
            renderTours(tours);
        } catch (error) {
            console.error('Error al obtener los tours:', error);
        }
    }
    // Función para obtener los testimonios aleatorios
    async function fetchRandomTestimonies() {
        try {
            const response = await fetch('https://api-dragon.onrender.com/get3RandomTestimonies', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los testimonios');
            }
            const testimonies = await response.json();
            renderTestimonies(testimonies);
        } catch (error) {
            console.error('Error al obtener los testimonios:', error);
        }
    }
    function formatCustomDateManually(dateString) {
        // Extraer los componentes manualmente desde la cadena
        const date = new Date(dateString);
        const hours = dateString.slice(11, 16); // Toma las horas y minutos directamente de la cadena
        const day = dateString.slice(8, 10); // Día
        const month = dateString.slice(5, 7); // Mes en formato numérico
        const year = dateString.slice(0, 4); // Año
    
        // Crear un array con los nombres de los meses
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
        // Convertir el mes numérico en el nombre del mes correspondiente
        const monthName = months[parseInt(month, 10) - 1]; // Convertir a índice del array
    
        // Devolver el formato deseado: "14:00, 17 de octubre del 2024"
        return `${hours}, ${day} de ${monthName} del ${year}`;
    }
    
    function renderTours(tours) {
        const toursContainer = document.querySelector('.row.tours');
        toursContainer.innerHTML = '';
        if (tours.length === 0) {
            toursContainer.innerHTML = '<p>No se encontraron servicios para esta categoría.</p>';
            return;
        }
        tours.forEach((tour, index) => {
            const tourHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <a href="#" class="service-link" data-codigo="${tour.codigoservicio}">
                            <img src="${tour.enlaceimagen || 'https://via.placeholder.com/400x200'}" loading="lazy" class="card-img-top" alt="${tour.textoalternativo}" width="400" height="300">
                            <div class="card-body">
                                <h3 class="card-title">${tour.nombre}</h3>
                                <p><strong>Fecha de salida:</strong> ${formatCustomDateManually(tour.horafechasalida)}</p>
                                <p><strong>Fecha de llegada:</strong> ${formatCustomDateManually(tour.horafechallegada)}</p>
                                <p class="card-text"><strong>Precio en colones: ${tour.precio}</strong></p>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            toursContainer.insertAdjacentHTML('beforeend', tourHTML);
        });
    
        // Agregar manejadores de eventos a los enlaces generados dinámicamente
        document.querySelectorAll('.service-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const codigoServicio = this.getAttribute('data-codigo');
                saveServiceCode(codigoServicio);
            });
        });
    }
    
    function saveServiceCode(codigoServicio) {
        if (codigoServicio) {
            sessionStorage.setItem('codigoServicio', codigoServicio);
            console.log('Código del servicio guardado:', codigoServicio);
            window.location.href = 'detalles.html'; // Redirige a la página de detalles
        } else {
            console.error('No se pudo guardar el código del servicio, es nulo o indefinido');
        }
    }
    // Función para renderizar los testimonios en el DOM
    function renderTestimonies(testimonies) {
        const testimoniesContainer = document.querySelector('.row.testimonies'); // Contenedor donde se insertarán los testimonios
        testimoniesContainer.innerHTML = ''; // Limpiar el contenedor
        testimonies.forEach(testimony => {
            const testimonyHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">${testimony.nombreusuario}</h3>
                        <p class="card-text">${testimony.comentario}</p>
                    </div>
                    </div>
                </div>
            `;
        testimoniesContainer.insertAdjacentHTML('beforeend', testimonyHTML);
        });
    }
});
