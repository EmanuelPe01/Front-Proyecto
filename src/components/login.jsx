import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios";
import Cookies from 'js-cookie';
import { Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

function ErrorAlert() {
    Swal.fire({
        title: '¡Error!',
        text: 'Credenciales inválidas',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}

function OkAlert() {
    Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        icon: 'success',
        timer: 1600
    })
}

function Login() {
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = Cookies.get('jwt');
        if (loggedUser) {
            setToken(loggedUser);
        }
    }, []);

    const buttonStyle = {
        '--bs-btn-hover-color': '#000',
        '--bs-btn-hover-bg': '#fff'
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username: user,
                password: pass
            });

            OkAlert();
            Cookies.set('jwt', response.data.token);
            setToken(response.data.token);
            navigate('/reportes');
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 401) {
                ErrorAlert();
            } else {
                console.error('Unknown error occurred.');
            }
        }
    };

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
                                            <Link to='/signIn' className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover">
                                                <p>¿No tienes cuenta?</p>
                                            </Link>
                                        </div>
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
        );
    };

    return (
        <span>
            {token ? navigate('/reportes') : renderLogin()}
        </span>
    );
}

export default Login;