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
    // Función para renderizar los tours en el DOM
    function renderTours(tours) {
        const toursContainer = document.querySelector('.row.tours'); // Contenedor donde se insertarán los tours
        toursContainer.innerHTML = ''; // Limpiar el contenedor
        tours.forEach(tour => {
            const tourHTML = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <a href="detalles.html?codigoServicio=${tour.codigoservicio}">
                        <img src="${tour.enlaceimagen || 'https://via.placeholder.com/400x200'}" loading="lazy" class="card-img-top" alt="${tour.textoalternativo}"width="400" height="300" >
                    
                        <div class="card-body">
                            <h3 class="card-title">${tour.nombre}</h3>
                            <p>hola</p>
                            <p class="card-text">Fecha salida: ${new Date(tour.horafechasalida).toLocaleString('es-ES', options)}</p>
                            <p class="card-text">Fecha llegada: ${new Date(tour.horafechallegada).toLocaleString('es-ES', options)}</p>
                            <p class="card-text"><strong>Precio en colones: ${tour.precio}</strong></p>
                        </div>
                    </a>
                </div>
            </div>
            `;
            toursContainer.insertAdjacentHTML('beforeend', tourHTML);
        });
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
