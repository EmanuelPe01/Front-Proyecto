import React, { useEffect, useState } from "react";
import NavBarProject from "./navBar"; // Importar componente de barra de navegación
import axios from "axios"; // Importar axios para manejar peticiones HTTP
import Cookies from 'js-cookie'; // Importar Cookies de js-cookie para manejar cookies en el navegador
import { endpoint, validateFileType } from "../utils/endpoint"; // Importar endpoint y validateFileType desde utils/endpoint
import { useNavigate } from 'react-router-dom'; // Importar useNavigate de react-router-dom para navegación
import { DeleteProblema, EditarProblema, AddSolucion } from "./buttons/actionsProblemas"; // Importar componentes de botones para acciones en problemas

// Función asíncrona para obtener todos los problemas desde el servidor
const getAllProblems = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Configurar encabezado de autorización con token JWT
        },
    };

    try {
        // Realizar solicitud GET al endpoint del servidor para obtener problemas
        const response = await axios.get(`${endpoint}/problemas/getAll`, config);
        return response.data; // Devolver datos recibidos del servidor
    } catch (error) {
        // Manejar errores de respuesta del servidor
        if (error.response) {
            if (error.response.status === 401) {
                // Manejar error de no autorizado (token inválido)
            } else {
                console.error("Backend error:", error.response.data); // Registrar error específico del backend en consola
            }
        }
        throw error; // Relanzar el error para manejo externo
    }
};

// Componente funcional para mostrar una imagen en una tarjeta
const ImgCard = ({ urlResource }) => {
    return (
        <img src={urlResource} className="img-fluid rounded-start" alt="..." />
    )
}

// Componente funcional para mostrar un video en una tarjeta
const VideoCard = ({ urlResource }) => {
    return (
        <video src={urlResource} className="object-fit-contain" controls ></video>
    )
}

// Componente funcional para reproducir audio en una tarjeta
const AudioCard = ({ urlResource }) => {
    return (
        <div className="d-flex justify-content-center mt-5">
            <audio src={urlResource} controls ></audio>
        </div>
    )
}

// Componente funcional para renderizar la información de un problema en una tarjeta
const CardProblem = ({ problema }) => {
    const fileExtension = validateFileType(problema.recurso); // Validar extensión del archivo del recurso
    const urlResource = `${endpoint}/problemas/getResource/${problema.recurso}`; // Construir URL para obtener el recurso

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    {/* Mostrar tarjeta específica según la extensión del archivo */}
                    {
                        fileExtension === 'mp3' ?
                            <AudioCard urlResource={urlResource} /> :
                            fileExtension === 'mp4' ?
                                <VideoCard urlResource={urlResource} /> :
                                <ImgCard urlResource={urlResource} />
                    }
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <div className="row">
                            <div className="col col-12">
                                <h5 className="card-title">{problema.ubicacion}</h5>
                            </div>
                            <div className="col col-12">
                                <p className="card-text"><strong>Descripción: </strong>{problema.descripcion}</p>
                            </div>
                            <div className="col col-12">
                                <p className="card-text"><strong>Solución: </strong>{problema.solucion ? problema.solucion.solucion : 'Sin registro'}</p>
                            </div>
                            <div className="col col-12">
                                <div className="row align-items-end mt-5">
                                    <div className="col col-4">
                                        <EditarProblema problema={problema} /> {/* Botón para editar el problema */}
                                    </div>
                                    <div className="col col-4">
                                        <DeleteProblema idProblema={problema.id} /> {/* Botón para eliminar el problema */}
                                    </div>
                                    <div className="col col-4">
                                        {
                                            problema.solucion ?
                                                <AddSolucion idProblema={problema.solucion.id} accion="update" solucionActual={problema.solucion.solucion} /> :
                                                <AddSolucion idProblema={problema.id} /> // Botón para agregar solución al problema
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente principal para la página de reportes
function Reportes() {
    const [problemas, setProblemas] = useState([]); // Estado para almacenar problemas obtenidos del servidor
    const [token, setToken] = useState(''); // Estado para almacenar el token de autenticación
    const navigate = useNavigate(); // Hook de react-router-dom para navegación

    useEffect(() => {
        const loggedUser = Cookies.get('jwt'); // Obtener token JWT almacenado en las cookies del navegador
        if (loggedUser) {
            setToken(loggedUser); // Almacenar el token en el estado
            // Llamar a la función asíncrona para obtener todos los problemas
            getAllProblems(token).then((data) => {
                setProblemas(data); // Actualizar el estado con los problemas obtenidos
            }).catch((error) => {
                console.error("Error fetching problems:", error); // Manejar errores al obtener problemas
            });
        }
    }, [token]); // Ejecutar efecto cuando cambia el token

    // Función para renderizar la pantalla de reportes
    const renderScreen = () => {
        return (
            <>
                <NavBarProject /> {/* Componente de barra de navegación */}
                <div className="container container-body">
                    <div className="row">
                        {/* Mapear y renderizar cada problema en la lista de problemas */}
                        {problemas.map((problema) => (
                            <div className="col col-12" key={problema.id}>
                                <CardProblem problema={problema} /> {/* Componente de tarjeta para cada problema */}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    // Retornar componente condicionalmente basado en la existencia del token
    return (
        <>{token ? renderScreen() : navigate('../')}</> // Redireccionar si no hay token válido
    );
}

export default Reportes; // Exportar componente Reportes para su uso en otros archivos
