import React, { useState, useEffect } from 'react';
import { useGeolocated } from 'react-geolocated';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Cookies from 'js-cookie';
import NavBarProject from './navBar';
import { endpoint } from '../utils/endpoint';
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";

function ErrorAlert(title) {
  Swal.fire({
    title: title,
    text: 'Credenciales inválidas',
    icon: 'error',
    confirmButtonText: 'Aceptar'
  })
}

function OkAlert(title) {
  Swal.fire({
    title: title,
    icon: 'success',
    timer: 1600
  })
}

const ReportForm = ({ token }) => {
  const [description, setDescription] = useState('');
  const [recurso, setRecurso] = useState(null);
  const navigate = useNavigate();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSizeInBytes = 10 * 1024 * 1024;;
      if (file.size > maxSizeInBytes) {
        alert('El recurso debe ser menor o igual a 10 MB.');
      } else {
        setRecurso(file);
      }
    }
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description || !recurso || !coords) {
      alert('Por favor llene todos los campos y permita la geolocalizacion.');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', description);
    formData.append('recurso', recurso);
    formData.append('ubicacion', `${coords.latitude}, ${coords.longitude}`);

    try {
      const response = await axios.post(`${endpoint}/problemas/add`, formData, config);
      if (response.status === 200) {
        OkAlert('Reporte registrado correctmante')
        navigate('..')
      } else {
        ErrorAlert('Error al enviar reporte')
      }
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      ErrorAlert('Error al enviar reporte')
    }
  };



  return (
    <>
      <NavBarProject />
      <div className="container container-body">
        <h1 className="mb-4">Reportar desperfecto técnico</h1>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripcion</label>
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
            <label className="form-label">Datos de geolocalización </label>
            {!isGeolocationAvailable ? (
              <div>Tu navegador no soporta geolocalización</div>
            ) : !isGeolocationEnabled ? (
              <div>La geolocalización no esta permitida</div>
            ) : coords ? (
              <div>
                <p>Latitud: {coords.latitude}</p>
                <p>Longitud: {coords.longitude}</p>
              </div>
            ) : (
              <div>Obteniendo datos de locacalización&hellip; </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Enviar reporte</button>
        </form>
      </div>
    </>
  );
};

function FormReporteScreen() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = Cookies.get('jwt');
    if (loggedUser) {
      setToken(loggedUser);
    }
  }, [token]);
  return (
    <>
      {token ? <ReportForm token={token} /> : navigate('../..')}
    </>
  )
}

export default FormReporteScreen;
