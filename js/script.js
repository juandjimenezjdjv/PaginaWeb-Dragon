// Función para obtener el rol del token y manejar la redirección
function getRoleFromToken() {
  const token = sessionStorage.getItem("token"); // Cambiado a sessionStorage
  if (!token) return null; // Si no hay token, el usuario no está autenticado
  try {
      const decoded = jwt_decode(token);
      return decoded.rol; // Retorna el rol (admin o cliente)

  } catch (error) {
      console.error("Error al decodificar el token", error);
      return null;
  }
}
async function solicitarCodigo() {
  const correo = document.getElementById('correorecuperacion').value;
  try {
    const response = await fetch('https://api-dragon.onrender.com/recuperarContrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo })
    });
    const result = await response.json();
    document.getElementById('resultMessage').textContent = result.message;
    document.getElementById('seccionCodigo').style.display = 'block'; // Mostrar la sección de código
  } catch (error) {
    console.error('Error al solicitar código:', error);
  }
}

async function cambiarContrasena() {
  const correo = document.getElementById('correorecuperacion').value;
  const codigo = parseInt(document.getElementById('codigoVerificacion').value, 10); // Asegura que el código sea un número
  const nuevaContrasena = document.getElementById('nuevaContrasena').value;

  if (!correo || !codigo || !nuevaContrasena) {
    document.getElementById('resultMessage').textContent = 'Por favor, completa todos los campos.';
    return;
  }

  try {
    const response = await fetch('https://api-dragon.onrender.com/cambiarContrasena', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo,
        codigo, // Asegúrate de que estás enviando el código como número
        nuevaContrasena
      })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error del servidor: ${errorMessage}`);
    }

    const result = await response.json();
    // Mostrar alerta de éxito
    alert(result.message);
    // También puedes actualizar el mensaje en el DOM si prefieres
    document.getElementById('resultMessage').textContent = result.message;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    // Mostrar alerta de error
    alert(`Error: ${error.message}`);
    // También puedes mostrar el mensaje en el DOM
    document.getElementById('resultMessage').textContent = `Error: ${error.message}`;
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
// Función para cerrar la sesión
function handleLogOut(event) {
  event.preventDefault(); // Evitar la redirección automática

  // Eliminar token y correo del sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('correo');

  // Redirigir a la página de inicio de sesión
  window.location.href = 'index.html';
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
        const logoutIcon = document.getElementById('logout-icon');
        if (logoutIcon) {
            logoutIcon.addEventListener('click', handleLogOut);
        }
      });

    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      });
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
          const response = await fetch('https://api-dragon.onrender.com/registerUser', {
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
          const response = await fetch('https://api-dragon.onrender.com/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
  
          const result = await response.json();
          if (response.ok) {
            sessionStorage.setItem('token', result.token);
            sessionStorage.setItem('correo', correo);
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
  });
  
