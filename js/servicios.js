document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una búsqueda almacenada en sessionStorage
    const searchQuery = sessionStorage.getItem('searchQuery');
    
    if (searchQuery) {
        // Si hay un término de búsqueda, realizar la búsqueda
        searchTours(searchQuery);
    } else {
        // Si no hay búsqueda, cargar todos los servicios
        fetchServicios();
    }
    // Función para buscar tours por nombre
    async function searchTours(query) {
        try {
            const response = await fetch(`https://api-dragon.onrender.com/searchTours?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al buscar los servicios');
            }
            const tours = await response.json();
            renderServicios(tours); // Renderizar los resultados de la búsqueda
        } catch (error) {
            console.error('Error al buscar los servicios:', error);
        }
    }


    async function fetchServicios() {
        try {
            const response = await fetch('https://api-dragon.onrender.com/getServices', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los tours');
            }
            const tours = await response.json();
            renderServicios(tours);
        } catch (error) {
            console.error('Error al obtener los tours:', error);
        }
    }

    async function filtrarServicios(tipo) {
        try {
            const response = await fetch(`https://api-dragon.onrender.com/getServicesByType/${tipo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los tours filtrados');
            }
            const tours = await response.json();
            renderServicios(tours);
        } catch (error) {
            console.error('Error al obtener los tours filtrados:', error);
        }
    }

    function renderServicios(tours) {
        const toursContainer = document.querySelector('.row.servicios');
        toursContainer.innerHTML = '';
        if (tours.length === 0) {
            toursContainer.innerHTML = '<p>No se encontraron servicios para esta categoría.</p>';
            return;
        }
        tours.forEach(tour => {
            const tourHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <a href="detalles.html?codigoServicio=${tour.codigoservicio}">
                            <img src="${tour.enlaceimagen || 'https://via.placeholder.com/400x200'}" loading="lazy" class="card-img-top" alt="${tour.textoalternativo}" width="400" height="300">
                        
                            <div class="card-body">
                                <h3 class="card-title">${tour.nombre}</h3>
                                <p class="card-text">Fecha salida: ${new Date(tour.horafechasalida).toLocaleDateString()}</p>
                                <p class="card-text">Fecha llegada: ${new Date(tour.horafechallegada).toLocaleDateString()}</p>
                                <p class="card-text"><strong>Precio en colones: ${tour.precio}</strong></p>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            toursContainer.insertAdjacentHTML('beforeend', tourHTML);
        });
    }

    // Hacer las funciones disponibles globalmente
    window.filtrarServicios = filtrarServicios;
    window.fetchServicios = fetchServicios;
});
