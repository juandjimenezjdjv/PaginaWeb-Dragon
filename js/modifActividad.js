document.addEventListener('DOMContentLoaded', async () => {
    // Verificar el rol del usuario antes de cargar la página
    const role = getRoleFromToken();

    if (role !== 'admin') {
        // Si no es administrador, redirigir al inicio de sesión o a una página de acceso denegado
        alert('Acceso denegado: Solo los administradores pueden acceder a esta página.');
        window.location.href = 'inicioSesion.html';  // Redirige a la página de inicio de sesión
        return; // Detiene la carga de la página
    }

    const urlParams = new URLSearchParams(window.location.search);
    const codigoServicio = urlParams.get('codigoServicio'); // Obtener el parámetro de la URL

    if (codigoServicio) {
        // Si existe código de servicio, estamos modificando, cargar los datos
        await cargarDatosServicio(codigoServicio);
    }

    // Manejar el envío del formulario
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el envío normal del formulario
    
        const form = event.target;  // Usar event.target para obtener el formulario correctamente
        const formData = new FormData(form);  // Crear el FormData del formulario
    
        const imageFile = formData.get('formFileA'); // Obtener el archivo de imagen correctamente
        let imageUrl = '';
    
        if (imageFile && imageFile.size > 0) {
            // Si hay una imagen seleccionada, subirla a Cloudinary
            imageUrl = await uploadImage(imageFile);
        }
    
        // Convertir el FormData a un objeto para enviar al backend
        const data = Object.fromEntries(formData.entries());
    
        // Si no hay imagen nueva y estamos actualizando, obtenemos el enlace de la imagen actual
        if (!imageUrl && codigoServicio) {
            const existingService = await fetch(`http://localhost:5005/getService/${codigoServicio}`);
            const servicio = await existingService.json();
    
            // Preservar el enlace de la imagen actual si no se ha seleccionado una nueva imagen
            if (servicio.enlaceimagen) { // Cambié el campo a minúsculas
                data['enlaceImagen'] = servicio.enlaceimagen; // Mantener el enlace de la imagen anterior
            }
        } else if (imageUrl) {
            // Si hay una nueva imagen, usar su URL
            data['enlaceImagen'] = imageUrl;
        }
    
        // Verificar si es creación o modificación
        if (codigoServicio) {
            await actualizarServicio(codigoServicio, data); // Modificar servicio
        } else {
            await crearServicio(data); // Crear nuevo servicio
        }
    });
});

// Función para cargar los datos de la actividad existente
async function cargarDatosServicio(codigoServicio) {
    try {
        const response = await fetch(`http://localhost:5005/getService/${codigoServicio}`);
        const servicio = await response.json();
        
        // Llenar el formulario con los datos del servicio para editar
        document.getElementById('nomActividad').value = servicio.nombre;
        document.getElementById('msjActividad').value = servicio.descripcion;
        document.getElementById('NPrecio').value = servicio.precio;
        document.getElementById('inclutec').value = servicio.incluyeactividad;
        document.getElementById('dificultad').value = servicio.dificultad;
        document.getElementById('fechaHoraI').value = servicio.horafechasalida;
        document.getElementById('fechaHoraF').value = servicio.horafechallegada;
        document.getElementById('msjAlterna').value = servicio.textoalternativo;
        // Marcar el radio button correspondiente al tipo de actividad
        if (servicio.tipo !== undefined) {
            document.querySelector(`input[name="tipo"][value="${servicio.tipo}"]`).checked = true;
        }
    } catch (error) {
        console.error('Error al cargar el servicio:', error);
    }
}

// Función para crear un nuevo servicio
async function crearServicio(data) {
    try {
        const response = await fetch('http://localhost:5005/createService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Servicio creado exitosamente');
            window.location.href = 'http://127.0.0.1:5500'; // Redirigir a la página principal o donde prefieras
        } else {
            alert('Error al crear el servicio: ' + result.message);
        }
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        alert('Error al crear el servicio.');
    }
}

// Función para actualizar un servicio existente
async function actualizarServicio(codigoServicio, data) {
    try {
        const response = await fetch(`http://localhost:5005/updateService/${codigoServicio}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Servicio actualizado exitosamente');
            window.location.href = 'http://127.0.0.1:5500'; // Redirigir a la página principal o donde prefieras
        } else {
            alert('Error al actualizar el servicio: ' + result.message);
        }
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        alert('Error al actualizar el servicio.');
    }
}

// Función para subir la imagen a Cloudinary
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zpfdzxlu");  // Tu preset de Cloudinary

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dhaynevdl/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error al subir la imagen: ${response.statusText}`);
        }

        const image = await response.json();

        if (!image.url) {
            throw new Error('No se recibió la URL de la imagen');
        }

        return image.url;  // Retornar el URL de la imagen subida
    } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return ''; // Retornar vacío si ocurre un error
    }
}
