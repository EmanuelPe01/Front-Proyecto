import React from "react";
import Cookies from 'js-cookie'; // Importar Cookies de js-cookie para manejar cookies en el navegador
import { Container, Nav, Navbar, Row } from 'react-bootstrap'; // Importar componentes de React Bootstrap
import { NavLink, useNavigate } from "react-router-dom"; // Importar NavLink y useNavigate de react-router-dom para navegación

// Componente funcional para diseñar un enlace de navegación con estilo personalizado
const LinkDesign = ({ label, url }) => {
    return (
        <NavLink
            to={url} // Propiedad 'to' para definir la URL de destino del enlace
            className="fs-6" // Clase de tamaño de fuente para el enlace
            style={({ isActive }) => { // Estilo condicional basado en si el enlace está activo
                return {
                    color: isActive ? "#000" : "#979797", // Color del texto basado en si el enlace está activo o no
                    textDecoration: "none" // Quitar subrayado del texto del enlace
                };
            }}
        >
            {label} {/* Etiqueta del enlace */}
        </NavLink>
    );
};

// Componente funcional para la barra de navegación del proyecto
function NavBarProject() {
    const navigate = useNavigate(); // Hook de react-router-dom para navegación
    // Función para cerrar sesión
    const logOut = () => {
        Cookies.remove('jwt'); // Eliminar cookie 'jwt' que almacena el token de sesión
        navigate('/'); // Redireccionar al inicio después de cerrar sesión
    }
    return (
        <>
            {/* Barra de navegación de Bootstrap fija en la parte superior */}
            <Navbar fixed="top" bg="light" data-bs-theme="light">
                <Container> {/* Contenedor para alinear contenido de la barra de navegación */}
                    <Navbar.Brand>Proyecto WCDBF</Navbar.Brand> {/* Título de la barra de navegación */}
                    <Row className="justify-content-around"> {/* Fila para alinear elementos de navegación */}
                        <Nav className="me-auto"> {/* Navegación a la izquierda */}
                            {/* Enlaces de navegación usando el componente LinkDesign */}
                            <Nav.Link><LinkDesign label="Reportes" url="/reportes" /></Nav.Link>
                            <Nav.Link><LinkDesign label="Nuevo reporte" url="/reportes/nuevo" /></Nav.Link>
                            {/* Botón para cerrar sesión que llama a la función logOut */}
                            <Nav.Link><button type="button" className="btn btn-danger" onClick={logOut}>Cerrar sesión</button></Nav.Link>
                        </Nav>
                    </Row>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBarProject; // Exportar componente NavBarProject para su uso en otros archivos
