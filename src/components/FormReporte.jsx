import React, { useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const ReportForm = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

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
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description || !image || !coords) {
      alert('Por favor llene todos los campos y permita la geolocalizacion.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    formData.append('latitude', coords.latitude);
    formData.append('longitude', coords.longitude);

    console.log('Description:', description);
    console.log('Image:', image);
    console.log('Coordinates:', coords);

    try {
        const response = await axios.post('http://localhost:8080/api/reporte', formData);
        if (response.status === 200) {
          console.log('Reporte enviado exitosamente!');
          setDescription('');
          setImage(null);
        } else {
          alert('Reporte se fallo en enviar.');
        }
      } catch (error) {
        console.error('Error al enviar reporte:', error);
        alert('Error al enviar reporte: Por favor intentar.');
      }
    };
  
  

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reportar desperfecto tecnico</h1>
      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripcion</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Subir fotografia</label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            required
          />
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
  );
};

export default ReportForm;
