// Función para obtener el rol del token y manejar la redirección
function getRoleFromToken() {
    const token = sessionStorage.getItem("token"); // Cambiado a sessionStorage
    if (!token) return null; // Si no hay token, el usuario no está autenticado
    try {
        const decoded = jwt_decode(token);
        alert(JSON.stringify(decoded));
        return decoded.rol; // Retorna el rol (admin o cliente)
  
    } catch (error) {
        console.error("Error al decodificar el token", error);
        return null;
    }
  }
  
  // Función para manejar el clic en el ícono de inicio de sesión
  function handleLoginClick(event) {
    event.preventDefault();
    
    const role = getRoleFromToken();
    console.log("Role obtenido:", role); // Para ver el rol en la consola
  
    if (role === null) {
        window.location.href = 'inicioSesion.html';
    } else if (role === "cliente") {
        window.location.href = 'perfilUsuario.html';
    } else if (role === "admin") {
        window.location.href = 'perfilAdmin.html';
    } else {
        window.location.href = 'inicioSesion.html';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      // Código para cargar header y footer
      fetch('header.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('header-placeholder').innerHTML = data;
          // Aquí se agrega el evento para manejar el clic en el icono de inicio de sesión
          const loginIcon = document.querySelector('a[href="inicioSesion.html"]');
          loginIcon.addEventListener('click', handleLoginClick);
        });
    
      fetch('footer.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer-placeholder').innerHTML = data;
        });
        // Llamada para obtener y renderizar los servicios aleatorios
        fetchRandomTours();
        fetchAlianzas();
        fetchServicios();
        // Llamada para obtener y renderizar los testimonios aleatorios
        fetchRandomTestimonies();
      // Código para el formulario de registro
      const registroForm = document.getElementById('registroForm');
      if (registroForm) {
        registroForm.addEventListener('submit', async (event) => {
          event.preventDefault();
    
          const nombre = document.getElementById('nombrecuenta').value.trim();
          const correo = document.getElementById('correocuenta').value.trim();
          const contraseña = document.getElementById('contrasenacuenta').value.trim();
          const confirmarContrasena = document.getElementById('confirmarcontrasena').value.trim();
          
          if (!nombre || !correo || !contraseña || !confirmarContrasena) {
            alert('Todos los campos son obligatorios');
            return;
          }
    
          if (contraseña !== confirmarContrasena) {
            alert('Las contraseñas no coinciden');
            return;
          }
    
          const data = { nombre, correo, contraseña };
    
          try {
            const response = await fetch('http://localhost:5005/registerUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
    
            const result = await response.json();
            if (response.ok) {
              alert('Usuario registrado con éxito.');
              window.location.href = 'inicioSesion.html';
            } else {
              alert('Error al registrar usuario: ' + result.message);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con la API');
          }
        });
      }
    
      // Código para el formulario de login
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
    
          const correo = document.getElementById('correoinicio').value.trim();
          const contraseña = document.getElementById('contrasenainicio').value.trim();
          
          if (!correo || !contraseña) {
            alert('Por favor, complete ambos campos.');
            return;
          }
    
          const data = { correo, contrasena: contraseña };
    
          try {
            const response = await fetch('http://localhost:5005/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
    
            const result = await response.json();
            if (response.ok) {
              sessionStorage.setItem('token', result.token);
              window.location.href = 'index.html';
            } else {
              alert('Error al iniciar sesión: ' + result.message);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con la API');
          }
        });
      }
       // Función para obtener los tours aleatorios
       async function fetchRandomTours() {
        try {
          const response = await fetch('http://localhost:5005/get3RandomServices', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener los tours');
          }
          if(response.message){
            alert('No hay tours disponibles en este momento');
          }
          const tours = await response.json();
          renderTours(tours);
        } catch (error) {
          console.error('Error al obtener los tours:', error);
        }
      }
      async function fetchServicios() {
        try {
          const response = await fetch('http://localhost:5005/getServices', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener los tours');
          }
          if(response.message){
            alert('No hay tours disponibles en este momento');
          }
          const tours = await response.json();
          renderServicios(tours)
        } catch (error) {
          console.error('Error al obtener los tours:', error);
        }
      }
      async function fetchAlianzas() {
        try {
          const response = await fetch('http://localhost:5005/get3RandomServices', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener los tours');
          }
          if(response.message){
            alert('No hay tours disponibles en este momento');
          }
          const tours = await response.json();
          renderAlianzas(tours);
        } catch (error) {
          console.error('Error al obtener los tours:', error);
        }
      }
      // Función para obtener los testimonios aleatorios
      async function fetchRandomTestimonies() {
        try {
          const response = await fetch('http://localhost:5005/get3RandomTestimonies', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener los testimonios');
          }
          if(response.message === "No hay testimonios disponibles en este momento"){
            alert('No hay testimonios disponibles en este momento');
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
                  <img src="${tour.enlaceimagen || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${tour.enlaceimagen}"width="400" height="300">
                </a>
                <div class="card-body">
                  <h5 class="card-title">${tour.nombre}</h5>
                  <p class="card-text">Fecha salida: ${tour.horafechasalida}</p>
                  <p class="card-text">Fecha llegada: ${tour.horafechallegada}</p>
                  <p class="card-text"><strong>Precio: €${tour.precio}</strong></p>
                </div>
              </div>
            </div>
          `;
          toursContainer.insertAdjacentHTML('beforeend', tourHTML);
        });
      }
      function renderServicios(tours) {
        const toursContainer = document.querySelector('.row.servicios'); // Contenedor donde se insertarán los tours
        toursContainer.innerHTML = ''; // Limpiar el contenedor
      
        tours.forEach(tour => {
          const tourHTML = `
            <div class="col-md-4 mb-4">
              <div class="card">
                <a href="detalles.html?codigoServicio=${tour.codigoservicio}">
                  <img src="${tour.enlaceimagen || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${tour.enlaceimagen}"width="400" height="300">
                </a>
                <div class="card-body">
                  <h5 class="card-title">${tour.nombre}</h5>
                  <p class="card-text">Fecha salida: ${tour.horafechasalida}</p>
                  <p class="card-text">Fecha llegada: ${tour.horafechallegada}</p>
                  <p class="card-text"><strong>Precio: €${tour.precio}</strong></p>
                </div>
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
                  <h5 class="card-title">${testimony.nombreusuario}</h5>
                  <p class="card-text">${testimony.comentario}</p>
                </div>
              </div>
            </div>
          `;
          testimoniesContainer.insertAdjacentHTML('beforeend', testimonyHTML);
        });
      }
      
    });
    
  
    // Función para renderizar las alianzas en el DOM
    function renderAlianzas(tours) {
      const toursContainer = document.querySelector('.row.alianzas'); // Contenedor donde se insertarán los tours
      toursContainer.innerHTML = ''; // Limpiar el contenedor
    
      tours.forEach(tour => {
        const tourHTML = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <a href="detalles.html?codigoServicio=${tour.codigoservicio}" target="_blank">
                <img src="${tour.enlaceimagen || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${tour.enlaceimagen}"width="400" height="300">
              </a>
              <div class="card-body">
                <h5 class="card-title">${tour.nombre}</h5>
                <p class="card-text">${tour.date}</p>
                <p class="card-text"><strong>Precio: €${tour.precio}</strong></p>
                <p class="card-text"><i class="bi bi-calendar"></i> ${tour.duration}</p>
                <a href="#" class="btn btn-success d-inline-flex align-items-center mb-5 text-center text-white" aria-label="Botón para proceder al pago mediante Tarjeta">
                  <strong>+</strong>
                </a>
              </div>
            </div>
          </div>
        `;
        toursContainer.insertAdjacentHTML('beforeend', tourHTML);
      });
    }

    // Carga de múltiples archivos JavaScript:

    // Si separas tu código en varios archivos (como index.js y script.js), el navegador deberá hacer múltiples solicitudes HTTP para cargar cada archivo. Esto puede aumentar ligeramente el tiempo de carga inicial, pero es algo que se puede mitigar usando técnicas como minificación y concatenación de archivos en el entorno de producción.
    // Puedes usar herramientas como Webpack, Parcel, o Rollup para agrupar archivos en uno

//     Recomendaciones:
// Cargar solo lo necesario: Asegúrate de que index.js tenga únicamente la lógica específica de la página index.html y que script.js solo contenga funciones compartidas que realmente se utilicen.

// Bundle y minificación: Usa herramientas como Webpack o Parcel para agrupar tus archivos JavaScript en uno solo en producción, y minifícalos para reducir el tamaño.

// Lazy loading: Si ciertas funciones o scripts no son necesarios inmediatamente, puedes cargarlos de manera diferida o cuando el usuario los necesite.