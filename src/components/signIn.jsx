import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

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
        title: '¡Registro exitoso!',
        icon: 'success',
        timer: 1600
    })
}

function SignIn() {
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate()

    const buttonStyle = {
        '--bs-btn-hover-color': '#000',
        '--bs-btn-hover-bg': '#fff'
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        if(validated) register(event)
    };

    const register = async (e) => {
        console.log('entre')
        e.preventDefault()

        if (handleSubmit) {
            const userInfo = {
                username: user,
                password: pass,
                firstname: firstName,
                lastname: lastName
            }
            await axios.post('http://localhost:8080/auth/register', userInfo).then(function (response) {
                OkAlert();
                navigate('/')
            }).catch(function (error) {
                if (error.response.status) {
                    ErrorAlert()
                } else {
                    console.log(error)
                }
            })
        }
    }

    return (
        <div className="container">
            <div className="row text-center mt-5 mb-5">
                <h1>¡Registrate!</h1>
            </div>
            <div className="row justify-content-center">
                <div className="col col-6">
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}
                                noValidate validated={validated}>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => { setUser(e.target.value) }}
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validationCustom02">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        onChange={(e) => { setPass(e.target.value) }}
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validationCustom03">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => { setFirstName(e.target.value) }}
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validationCustom04">
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => { setLastName(e.target.value) }}
                                    />
                                    <Form.Control.Feedback>Este es correcto</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Campo necesario</Form.Control.Feedback>
                                </Form.Group>
                                <div className="row align-items-center text-center">
                                    <div className="col col-6">
                                        <Link to='/' className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover">
                                            <p>¿Ya tienes cuenta?</p>
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
    )
}

export default SignIn;
