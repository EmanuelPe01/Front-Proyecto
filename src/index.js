import React from 'react'; // Importar React para el uso de JSX y componentes
import ReactDOM from 'react-dom/client'; // Importar ReactDOM para renderizar en el DOM
import './index.css'; // Importar estilos CSS locales
import App from './App'; // Importar el componente principal de la aplicación
import reportWebVitals from './reportWebVitals'; // Importar función para reportar métricas web
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importar JS de Bootstrap (incluye Popper.js)

// Crear un punto de inicio de ReactDOM en el elemento con id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación dentro de <React.StrictMode> para comprobar problemas potenciales
root.render(
  <React.StrictMode>
    <App /> {/* Renderizar el componente principal de la aplicación */}
  </React.StrictMode>
);

// Reportar las métricas web para mejorar el rendimiento de la aplicación
reportWebVitals();
