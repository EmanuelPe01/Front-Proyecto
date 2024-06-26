import React from "react";
import Cookies from 'js-cookie';
import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";

const LinkDesign = ({ label, url }) => {
    return (
        <NavLink
            to={url}
            className="fs-6"
            style={({ isActive }) => {
                return {
                    color: isActive ? "#000" : "#979797",
                    textDecoration: "none"
                };
            }}
        >
            {label}
        </NavLink>
    );
};

function NavBarProject() {
    const navigate = useNavigate();
    const logOut = () => {
        Cookies.remove('jwt')
        navigate('/')
    }
    return (
        <>
            <Navbar fixed="top" bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand>Proyecto WCDBF</Navbar.Brand>
                    <Row className="justify-content-around">
                        <Nav className="me-auto">
                            <Nav.Link><LinkDesign label="Reportes" url="/reportes" /></Nav.Link>
                            <Nav.Link><LinkDesign label="Nuevo reporte" url="/reportes/nuevo" /></Nav.Link>
                            <Nav.Link><button type="button" className="btn btn-danger" onClick={logOut}>Cerrar sesión</button></Nav.Link>
                        </Nav>
                    </Row>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBarProject