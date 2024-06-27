import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom'; // Importar useNavigate y Link de react-router-dom para navegación
import axios from "axios"; // Importar axios para realizar peticiones HTTP
import Cookies from 'js-cookie'; // Importar Cookies de js-cookie para manejar cookies en el navegador
import { Card, Form, Button } from "react-bootstrap"; // Importar componentes de React Bootstrap
import Swal from "sweetalert2"; // Importar SweetAlert2 para mostrar alertas visuales

// Función para mostrar una alerta de error
function ErrorAlert() {
    Swal.fire({
        title: '¡Error!',
        text: 'Credenciales inválidas',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}

// Función para mostrar una alerta de éxito
function OkAlert() {
    Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        icon: 'success',
        timer: 1600 // Tiempo en milisegundos para cerrar automáticamente la alerta
    });
}

// Componente funcional para la página de inicio de sesión
function Login() {
    const [validated, setValidated] = useState(false); // Estado para validar el formulario
    const [user, setUser] = useState(''); // Estado para el nombre de usuario
    const [pass, setPass] = useState(''); // Estado para la contraseña
    const [token, setToken] = useState(null); // Estado para el token de sesión
    const navigate = useNavigate(); // Hook de react-router-dom para navegación

    // Efecto para verificar si hay un usuario autenticado al cargar el componente
    useEffect(() => {
        const loggedUser = Cookies.get('jwt'); // Obtener el token de sesión almacenado en cookies
        if (loggedUser) {
            setToken(loggedUser); // Establecer el token en el estado si existe
        }
    }, []);

    // Estilo personalizado para el botón de inicio de sesión
    const buttonStyle = {
        '--bs-btn-hover-color': '#000', // Color de texto al pasar el cursor sobre el botón
        '--bs-btn-hover-bg': '#fff' // Color de fondo al pasar el cursor sobre el botón
    };

    // Función para manejar el envío del formulario de inicio de sesión
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // Evitar comportamiento por defecto del evento submit
        event.stopPropagation(); // Detener la propagación del evento

        setValidated(true); // Marcar el formulario como validado

        // Verificar si el formulario es válido
        if (form.checkValidity() === false) {
            return;
        }

        try {
            // Realizar petición POST al endpoint de autenticación con los datos de usuario y contraseña
            const response = await axios.post('http://localhost:8080/auth/login', {
                username: user,
                password: pass
            });

            OkAlert(); // Mostrar alerta de inicio de sesión exitoso
            Cookies.set('jwt', response.data.token); // Almacenar el token de sesión en cookies
            setToken(response.data.token); // Establecer el token en el estado
            navigate('/reportes'); // Redireccionar al usuario a la página de reportes después del inicio de sesión
        } catch (error) {
            console.error('Error:', error);
            // Verificar si se recibió una respuesta de error de autenticación (401 Unauthorized)
            if (error.response && error.response.status === 401) {
                ErrorAlert(); // Mostrar alerta de credenciales inválidas
            } else {
                console.error('Unknown error occurred.'); // Mostrar mensaje de error desconocido en la consola
            }
        }
    };

    // Función para renderizar el formulario de inicio de sesión
    const renderLogin = () => {
        return (
            <div className="container">
                <div className="row text-center mt-5 mb-5">
                    <h1>¡Bienvenido!</h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col col-6">
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                    <Form.Group controlId="validationCustom01">
                                        <Form.Label>Usuario</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            onChange={(e) => setUser(e.target.value)}
                                        />
                                        <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationCustom02">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            onChange={(e) => setPass(e.target.value)}
                                        />
                                        <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                    </Form.Group>
                                    <div className="row align-items-center text-center">
                                        <div className="col col-6">
                                            {/* Enlace para redirigir a la página de registro */}
                                            <Link to='/signIn' className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover">
                                                <p>¿No tienes cuenta?</p>
                                            </Link>
                                        </div>
                                        <div className="col col-6">
                                            {/* Botón de inicio de sesión con estilo personalizado */}
                                            <Button style={buttonStyle} className="mt-3" variant="success" type="submit">
                                                Iniciar sesión
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return (
        // Renderizar la página de reportes si hay un token válido, de lo contrario, renderizar el formulario de inicio de sesión
        <span>
            {token ? navigate('/reportes') : renderLogin()}
        </span>
    );
}

export default Login; // Exportar el componente Login para su uso en otras partes de la aplicación
