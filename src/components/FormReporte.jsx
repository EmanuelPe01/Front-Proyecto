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

const ReportForm = ({token}) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSizeInBytes = 1048576;
      if (file.size > maxSizeInBytes) {
        alert('La imagen debe ser menor o igual a 1 MB.');
      } else {
        setImage(file);
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
    if (!description || !image || !coords) {
      alert('Por favor llene todos los campos y permita la geolocalizacion.');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', description);
    formData.append('foto', image);
    formData.append('ubicacion', `${coords.latitude}, ${coords.longitude}`);

    console.log('Description:', description);
    console.log('Image:', image);
    console.log('Coordinates:', coords);

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
        <h1 className="mb-4">Reportar desperfecto tecnico</h1>
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
            <label htmlFor="image" className="form-label">Subir fotografia</label>
            <input
              type="file"
              id="image"
              className="form-control"
              accept="image/png"
              capture="environment"
              onChange={handleImageChange}
              required />
          </div>

          <div className="mb-3">
            <label className="form-label">Datos de geolocalizacion </label>
            {!isGeolocationAvailable ? (
              <div>Tu navegador no soporta geolocalizacion</div>
            ) : !isGeolocationEnabled ? (
              <div>La geolocalizacion no esta permitida</div>
            ) : coords ? (
              <div>
                <p>Latitud: {coords.latitude}</p>
                <p>Longitud: {coords.longitude}</p>
              </div>
            ) : (
              <div>Obteniendo datos de locacalizacion&hellip; </div>
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
  return(
    <>
    {token? <ReportForm token={token} /> : navigate('../..')}
    </>
  )
}

export default FormReporteScreen;
