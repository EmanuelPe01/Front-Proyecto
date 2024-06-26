import React, { useEffect, useState } from "react";
import NavBarProject from "./navBar";
import axios from "axios";
import Cookies from 'js-cookie';
import { endpoint, fromBase64 } from "../utils/endpoint";
import { useNavigate } from 'react-router-dom'

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

const CardProblem = ({ubicacion, descripcion, imagen, solucion}) => {
    const imgConv = fromBase64(imagen)
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={imgConv} className="img-fluid rounded-start" alt="..."/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{ubicacion}</h5>
                        <p className="card-text"><strong>Descripción: </strong>{descripcion}</p>
                        <p className="card-text"><small className="text-body-secondary"><strong>Solución: </strong>{solucion ? solucion.solucion : 'Sin registro'}</small></p>
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
                                <CardProblem ubicacion={problema.ubicacion} descripcion={problema.descripcion} imagen={problema.foto} solucion={problema.solucion}/>
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