import React, { useState, useEffect } from 'react';
import { useGeolocated } from 'react-geolocated'; // Importar hook para geolocalización
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import axios from "axios"; // Importar axios para peticiones HTTP
import Cookies from 'js-cookie'; // Importar Cookies de js-cookie para manejar cookies en el navegador
import NavBarProject from './navBar'; // Importar componente de barra de navegación
import { endpoint } from '../utils/endpoint'; // Importar endpoint desde archivo utils/endpoint
import { useNavigate } from 'react-router-dom'; // Importar hook de react-router-dom para navegación
import Swal from "sweetalert2"; // Importar SweetAlert2 para mostrar alertas visuales

// Función para mostrar una alerta de error
function ErrorAlert(title) {
  Swal.fire({
    title: title,
    text: 'Credenciales inválidas',
    icon: 'error',
    confirmButtonText: 'Aceptar'
  });
}

// Función para mostrar una alerta de éxito
function OkAlert(title) {
  Swal.fire({
    title: title,
    icon: 'success',
    timer: 1600 // Tiempo en milisegundos para cerrar automáticamente la alerta
  });
}

// Componente funcional para el formulario de reporte de problemas
const ReportForm = ({ token }) => {
  const [description, setDescription] = useState(''); // Estado para la descripción del problema
  const [recurso, setRecurso] = useState(null); // Estado para el recurso (archivo multimedia)
  const navigate = useNavigate(); // Hook de react-router-dom para navegación

  // Obtener datos de geolocalización usando el hook useGeolocated
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true, // Precisión alta para la geolocalización
    },
    userDecisionTimeout: 5000, // Tiempo límite para la decisión del usuario
  });

  // Función para manejar el cambio en la descripción del problema
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Función para manejar el cambio en el archivo seleccionado
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSizeInBytes = 10 * 1024 * 1024; // Tamaño máximo permitido del archivo (10 MB)
      if (file.size > maxSizeInBytes) {
        alert('El recurso debe ser menor o igual a 10 MB.');
      } else {
        setRecurso(file); // Establecer el archivo seleccionado en el estado
      }
    }
  };

  // Configuración de headers para las peticiones HTTP con el token de autenticación
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Token de autenticación
    },
  };

  // Función para manejar el envío del formulario de reporte
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar comportamiento por defecto del evento submit
    if (!description || !recurso || !coords) {
      alert('Por favor llene todos los campos y permita la geolocalización.'); // Alerta si faltan campos
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', description); // Agregar descripción al FormData
    formData.append('recurso', recurso); // Agregar recurso al FormData
    formData.append('ubicacion', `${coords.latitude}, ${coords.longitude}`); // Agregar ubicación al FormData

    try {
      const response = await axios.post(`${endpoint}/problemas/add`, formData, config); // Enviar datos al servidor
      if (response.status === 200) {
        OkAlert('Reporte registrado correctamente'); // Alerta de éxito si el reporte se envió correctamente
        navigate('..'); // Redirigir a la página anterior
      } else {
        ErrorAlert('Error al enviar reporte'); // Alerta de error si hay algún problema con la petición
      }
    } catch (error) {
      console.error('Error al enviar reporte:', error); // Mostrar error en la consola
      ErrorAlert('Error al enviar reporte'); // Alerta de error al usuario
    }
  };

  return (
    <>
      <NavBarProject /> {/* Renderizar la barra de navegación */}
      <div className="container container-body">
        <h1 className="mb-4">Reportar desperfecto técnico</h1>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={handleDescriptionChange}
              required />
          </div>

          <div className="mb-3">
            <label htmlFor="recurso" className="form-label">Subir evidencia (Foto, vídeo o audio)</label>
            <input
              type="file"
              id="file"
              className="form-control"
              accept=".mp3, .mp4, .jpg, .png"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Datos de geolocalización</label>
            {!isGeolocationAvailable ? (
              <div>Tu navegador no soporta geolocalización</div>
            ) : !isGeolocationEnabled ? (
              <div>La geolocalización no está permitida</div>
            ) : coords ? (
              <div>
                <p>Latitud: {coords.latitude}</p>
                <p>Longitud: {coords.longitude}</p>
              </div>
            ) : (
              <div>Obteniendo datos de localización...</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Enviar reporte</button> {/* Botón para enviar el formulario */}
        </form>
      </div>
    </>
  );
};

// Componente para la pantalla de formulario de reporte
function FormReporteScreen() {
  const [token, setToken] = useState(''); // Estado para almacenar el token de sesión
  const navigate = useNavigate(); // Hook de react-router-dom para navegación

  // Efecto para verificar si hay un usuario autenticado al cargar el componente
  useEffect(() => {
    const loggedUser = Cookies.get('jwt'); // Obtener el token de sesión almacenado en cookies
    if (loggedUser) {
      setToken(loggedUser); // Establecer el token en el estado si existe
    }
  }, [token]);

  return (
    <>
      {/* Renderizar el formulario de reporte si hay un token válido, de lo contrario, redirigir a la página anterior */}
      {token ? <ReportForm token={token} /> : navigate('../..')}
    </>
  );
}

export default FormReporteScreen; // Exportar el componente FormReporteScreen para su uso en otras partes de la aplicación
