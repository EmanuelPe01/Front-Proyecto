import React, { useState } from "react";
import axios from "axios"; // Importar axios para manejar peticiones HTTP
import { Card, Form, Button } from "react-bootstrap"; // Importar componentes de Bootstrap para React
import Swal from "sweetalert2"; // Importar SweetAlert2 para mostrar alertas visuales
import { Link, useNavigate } from "react-router-dom"; // Importar Link y useNavigate de react-router-dom para navegación

// Función para mostrar una alerta de error
function ErrorAlert() {
    Swal.fire({
        title: '¡Error!',
        text: 'Credenciales inválidas',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}

// Función para mostrar una alerta de registro exitoso
function OkAlert() {
    Swal.fire({
        title: '¡Registro exitoso!',
        icon: 'success',
        timer: 1600
    })
}

// Componente principal del formulario de registro
function SignIn() {
    const [validated, setValidated] = useState(false); // Estado para el estado de validación del formulario
    const [user, setUser] = useState(''); // Estado para el nombre de usuario
    const [pass, setPass] = useState(''); // Estado para la contraseña
    const [firstName, setFirstName] = useState(''); // Estado para el nombre
    const [lastName, setLastName] = useState(''); // Estado para los apellidos
    const navigate = useNavigate(); // Hook de react-router-dom para navegación

    // Estilo personalizado para el botón
    const buttonStyle = {
        '--bs-btn-hover-color': '#000',
        '--bs-btn-hover-bg': '#fff'
    }

    // Función que maneja el envío del formulario
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        if (validated) register(event); // Llama a la función de registro si el formulario está validado
    };

    // Función asíncrona para registrar un nuevo usuario
    const register = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Objeto con la información del usuario a registrar
        const userInfo = {
            username: user,
            password: pass,
            firstname: firstName,
            lastname: lastName
        }

        try {
            // Enviar la solicitud POST al servidor para registrar al usuario
            await axios.post('http://localhost:8080/auth/register', userInfo);

            // Mostrar una alerta de registro exitoso
            OkAlert();

            // Navegar al inicio después de registrar exitosamente
            navigate('/');
        } catch (error) {
            // Manejar errores de respuesta del servidor
            if (error.response && error.response.status) {
                // Mostrar una alerta de error en caso de credenciales inválidas u otro error
                ErrorAlert();
            } else {
                console.log(error); // Registrar cualquier otro tipo de error en la consola
            }
        }
    }

    // Estructura del componente que muestra el formulario de registro
    return (
        <div className="container">
            <div className="row text-center mt-5 mb-5">
                <h1>¡Registrate!</h1>
            </div>
            <div className="row justify-content-center">
                <div className="col col-6">
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                {/* Campo de entrada para el nombre de usuario */}
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => { setUser(e.target.value) }} // Actualizar estado del usuario al cambiar el valor
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                {/* Campo de entrada para la contraseña */}
                                <Form.Group controlId="validationCustom02">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        onChange={(e) => { setPass(e.target.value) }} // Actualizar estado de la contraseña al cambiar el valor
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                {/* Campo de entrada para el nombre */}
                                <Form.Group controlId="validationCustom03">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => { setFirstName(e.target.value) }} // Actualizar estado del nombre al cambiar el valor
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                {/* Campo de entrada para los apellidos */}
                                <Form.Group controlId="validationCustom04">
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => { setLastName(e.target.value) }} // Actualizar estado de los apellidos al cambiar el valor
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                <div className="row align-items-center text-center">
                                    {/* Enlace para redirigir al usuario a la página de inicio de sesión si ya tiene cuenta */}
                                    <div className="col col-6">
                                        <Link to='/' className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover">
                                            <p>¿Ya tienes cuenta?</p>
                                        </Link>
                                    </div>
                                    {/* Botón para enviar el formulario de registro */}
                                    <div className="col col-6">
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
    )
}

export default SignIn; // Exportar el componente SignIn para su uso en otros archivos
