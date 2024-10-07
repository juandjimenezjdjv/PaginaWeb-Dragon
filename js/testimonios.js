document.addEventListener('DOMContentLoaded', () => {
    fetchTestimonies();
    async function fetchTestimonies() {
        try {
            const response = await fetch('http://localhost:5005/getTestimonies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error('Error al obtener los testimonios');
        }
        if(response.message){
            alert('No hay testimonios disponibles en este momento');
        }
        const testimonios = await response.json();
        renderTestimonies(testimonios)
        } catch (error) {
            console.error('Error al obtener los tours:', error);
        }
    }
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
