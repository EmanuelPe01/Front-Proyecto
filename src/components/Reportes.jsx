import React, { useEffect, useState } from "react";
import NavBarProject from "./navBar";
import axios from "axios";
import Cookies from 'js-cookie';
import { endpoint, validateFileType } from "../utils/endpoint";
import { useNavigate } from 'react-router-dom'
import { DeleteProblema, EditarProblema, AddSolucion } from "./buttons/actionsProblemas";

const getAllProblems = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(`${endpoint}/problemas/getAll`, config);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
            } else {
                console.error("Backend error:", error.response.data);
            }
        }
        throw error;
    }
};

const ImgCard = ({urlResource}) => {
    return(
        <img src={urlResource} className="img-fluid rounded-start" alt="..." />
    )
}

const VideoCard = ({urlResource}) => {
    return (
        <video src={urlResource} class="object-fit-contain" controls ></video>
    )
}

const AudioCard = ({urlResource}) => {
    return(
        <div className="d-flex justify-content-center mt-5">
            <audio src={urlResource} controls ></audio>
        </div>
    )
}

const CardProblem = ({ problema }) => {
    const fileExtension = validateFileType(problema.recurso)
    const urlResource = `${endpoint}/problemas/getResource/${problema.recurso}`
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    {
                        fileExtension === 'mp3' ? 
                            <AudioCard urlResource={urlResource}/>
                        : fileExtension === 'mp4' ? 
                            <VideoCard urlResource={urlResource}/>
                        :   <ImgCard urlResource={urlResource}/>
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
                                        <EditarProblema problema={problema}/>
                                    </div>                                    
                                    <div className="col col-4">
                                        <DeleteProblema idProblema={problema.id}/>
                                    </div>
                                    <div className="col col-4">
                                        {
                                            problema.solucion ? 
                                            <AddSolucion idProblema={problema.solucion.id} accion="update" solucionActual={problema.solucion.solucion}/> :
                                            <AddSolucion idProblema={problema.id}/>
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

function Reportes() {
    const [problemas, setProblemas] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = Cookies.get('jwt');
        if (loggedUser) {
            setToken(loggedUser);
            getAllProblems(token).then((data) => {
                setProblemas(data)
            })
        }
    }, [token]);

    const renderScreen = () => {
        return (
            <>
                <NavBarProject />
                <div className="container container-body">
                    <div className="row">
                        {problemas.map((problema) => (
                            <div className="col col-12" key={problema.id}>
                                <CardProblem problema={problema} />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>{token ? renderScreen() : navigate('../')}</>
    );
}

export default Reportes;