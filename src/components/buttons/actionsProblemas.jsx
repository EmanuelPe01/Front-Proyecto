import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { endpoint } from '../../utils/endpoint'
import { Button, Modal } from "react-bootstrap";

function ErrorAlert(title) {
    Swal.fire({
        title: title,
        text: 'Error en el servidor, intente más tarde',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}

function OkAlert(title) {
    Swal.fire({
        title: title,
        icon: 'success',
        timer: 1600
    }).then(() => window.location.reload())
}

export function EditarProblema({ problema }) {
    const [problemaToUpdate, setProblemaToUpdate] = useState()
    const [description, setDescription] = useState('');
    const [recurso, setRecurso] = useState(null);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(Cookies.get('jwt'))
        setProblemaToUpdate(problema)
        setDescription(problema.descripcion)
    }, [problema]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInBytes = 10 * 1024 * 1024;;
            if (file.size > maxSizeInBytes) {
                alert('El recurso debe ser menor o igual a 10 MB.');
            } else {
                setRecurso(file);
            }
        }
    };

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!description) {
            alert('Por favor especifique una descripción');
            return;
        }

        const formData = new FormData();
        formData.append('descripcion', description);
        if(recurso) formData.append('recurso', recurso);

        try {
            await axios.put(`${endpoint}/problemas/update/${problemaToUpdate.id}`, formData, config)
                .then(function () {
                    OkAlert('Reporte actualizado correctmante')
                    handleClose()
                }).catch(
                    function (error) {
                        ErrorAlert('Error al actualizar')
                        console.log(error.response())
                    })
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            ErrorAlert('Error al enviar reporte')
        }
    };

    return (
        <>
            <Button variant="outline-warning" onClick={handleShow}>
                Editar problema
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar reporte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Descripcion</label>
                            <textarea
                                id="description"
                                className="form-control"
                                value={description}
                                onChange={handleDescriptionChange}
                                required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="recurso" className="form-label">Subir evidencia (Foto, vídeo o audio)</label>
                            <input
                                type="file"
                                id="file"
                                className="form-control"
                                accept=".mp3, .mp4, .jpg, .png"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div>
                            <p className="fs-6 text-danger"> *No se permite modificar la ubicación del problema</p>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export function DeleteProblema({ idProblema }) {
    useEffect(() => {
    }, [idProblema]);

    const DeleteProblemService = async () => {
        await axios.delete(`${endpoint}/problemas/delete/${idProblema}`)
            .then(
                OkAlert('Recurso eliminado correctamente')
            ).catch(
                function (error) {
                    ErrorAlert('Error al eliminar')
                    console.log(error.response())
                }
            )
    }

    const ConfirmDelete = () => {
        Swal.fire({
            title: "¿Seguro que quieres eliminar el reporte?",
            text: "No se puede revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteProblemService()
            }
        });
    }

    return (
        <>
            <button className="btn btn-outline-danger" onClick={ConfirmDelete}>Eliminar problema</button>
        </>
    )
}

export function AddSolucion({idProblema, accion, solucionActual}) {
    const [idProblemaSolucion, setIdProblema] = useState()
    const [solucion, setSolucion] = useState()
    const [show, setShow] = useState(false);
    const [token, setToken] = useState(null);
    const variateButton = accion === 'update' ? "outline-dark" : "outline-success"
    const titulo = accion === 'update' ? "Actualizar solución" : "Agregar solución"
    const banner = accion === 'update' ? "Actualizar solución" : "Agregar solución"

    useEffect(() => {
        setToken(Cookies.get('jwt'))
        setIdProblema(idProblema)
        setSolucion(solucionActual)
    }, [idProblema, solucionActual]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSolutionChange = (event) => {
        setSolucion(event.target.value);
    };
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const agregarSolucion = async () => {
        //Recibe id del problema
        try {
            await axios.post(`${endpoint}/soluciones/add/${idProblemaSolucion}`, {solucion: solucion}, config)
                .then(function () {
                    OkAlert('Solución agregada correctamente')
                    handleClose()
                }).catch(
                    function (error) {
                        ErrorAlert('Error al agregar solución')
                        console.log(error)
                    })
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            ErrorAlert('Error al enviar reporte')
        }
    }

    const actualizarSolucion = async () => {
        //Recibe id de la solución
        try {
            await axios.put(`${endpoint}/soluciones/update/${idProblemaSolucion}`, {solucion: solucion}, config)
                .then(function () {
                    OkAlert('Solución actualizada correctamente')
                    handleClose()
                }).catch(
                    function (error) {
                        ErrorAlert('Error al actualizar solución')
                        console.log(error)
                    })
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            ErrorAlert('Error al enviar reporte')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!solucion) {
            alert('Por favor especifique una descripción y suba una evidencia');
            return;
        }
        accion === 'update' ? actualizarSolucion() : agregarSolucion()        
    };

    return(
        <>
            <Button variant={variateButton} onClick={handleShow}>
                {titulo}
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{banner}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Solución detallada</label>
                            <textarea
                                id="description"
                                className="form-control"
                                value={solucion}
                                onChange={handleSolutionChange}
                                required />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}