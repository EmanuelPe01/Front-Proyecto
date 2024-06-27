import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importar SweetAlert2 para mostrar alertas visuales
import Cookies from 'js-cookie'; // Importar Cookies de js-cookie para manejar cookies en el navegador
import { endpoint } from '../../utils/endpoint'; // Importar endpoint desde archivo utils/endpoint
import { Button, Modal } from "react-bootstrap"; // Importar componentes de Modal y Button de react-bootstrap

// Función para mostrar una alerta de error
function ErrorAlert(title) {
    Swal.fire({
        title: title,
        text: 'Error en el servidor, intente más tarde',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}

// Función para mostrar una alerta de éxito y recargar la página
function OkAlert(title) {
    Swal.fire({
        title: title,
        icon: 'success',
        timer: 1600 // Tiempo en milisegundos para cerrar automáticamente la alerta
    }).then(() => window.location.reload()); // Recargar la página después de cerrar la alerta
}

// Componente funcional para editar un problema
export function EditarProblema({ problema }) {
    const [problemaToUpdate, setProblemaToUpdate] = useState(); // Estado para almacenar el problema a actualizar
    const [description, setDescription] = useState(''); // Estado para la descripción del problema
    const [recurso, setRecurso] = useState(null); // Estado para el recurso (archivo multimedia)
    const [show, setShow] = useState(false); // Estado para controlar la visibilidad del modal
    const [token, setToken] = useState(null); // Estado para almacenar el token de autenticación

    useEffect(() => {
        setToken(Cookies.get('jwt')); // Obtener el token de autenticación almacenado en cookies
        setProblemaToUpdate(problema); // Establecer el problema a actualizar en el estado
        setDescription(problema.descripcion); // Establecer la descripción del problema en el estado
    }, [problema]);

    // Función para cerrar el modal
    const handleClose = () => setShow(false);

    // Función para abrir el modal
    const handleShow = () => setShow(true);

    // Función para manejar el cambio en la descripción del problema
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    // Función para manejar el cambio en el archivo seleccionado
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInBytes = 10 * 1024 * 1024; // Tamaño máximo permitido del archivo (10 MB)
            if (file.size > maxSizeInBytes) {
                alert('El recurso debe ser menor o igual a 10 MB.');
            } else {
                setRecurso(file); // Establecer el archivo seleccionado en el estado
            }
        }
    };

    // Configuración de headers para las peticiones HTTP con el token de autenticación
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Función para manejar el envío del formulario de actualización de problema
    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar comportamiento por defecto del evento submit
        if (!description) {
            alert('Por favor especifique una descripción'); // Alerta si falta la descripción
            return;
        }

        const formData = new FormData();
        formData.append('descripcion', description); // Agregar descripción al FormData
        if (recurso) formData.append('recurso', recurso); // Agregar recurso al FormData si existe

        try {
            await axios.put(`${endpoint}/problemas/update/${problemaToUpdate.id}`, formData, config)
                .then(function () {
                    OkAlert('Reporte actualizado correctamente'); // Alerta de éxito si el reporte se actualizó correctamente
                    handleClose(); // Cerrar el modal después de actualizar
                }).catch(
                    function (error) {
                        ErrorAlert('Error al actualizar'); // Alerta de error si hay algún problema con la petición
                        console.log(error.response()); // Mostrar error en la consola
                    })
        } catch (error) {
            console.error('Error al enviar reporte:', error); // Mostrar error en la consola
            ErrorAlert('Error al enviar reporte'); // Alerta de error al usuario
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
                            <label htmlFor="description" className="form-label">Descripción</label>
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
                            <p className="fs-6 text-danger">* No se permite modificar la ubicación del problema</p>
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

// Componente funcional para eliminar un problema
export function DeleteProblema({ idProblema }) {
    // Efecto para manejar el cambio en el id del problema
    useEffect(() => {
    }, [idProblema]);

    // Función para realizar la eliminación del problema
    const DeleteProblemService = async () => {
        await axios.delete(`${endpoint}/problemas/delete/${idProblema}`)
            .then(
                OkAlert('Recurso eliminado correctamente') // Alerta de éxito si el problema se eliminó correctamente
            ).catch(
                function (error) {
                    ErrorAlert('Error al eliminar'); // Alerta de error si hay algún problema con la eliminación
                    console.log(error.response()); // Mostrar error en la consola
                }
            )
    }

    // Función para confirmar la eliminación del problema
    const ConfirmDelete = () => {
        Swal.fire({
            title: "¿Seguro que quieres eliminar el reporte?", // Título de la confirmación
            text: "No se puede revertir esta acción", // Texto informativo
            icon: "warning", // Icono de advertencia
            showCancelButton: true, // Mostrar botón de cancelar
            confirmButtonColor: "#3085d6", // Color del botón de confirmación
            cancelButtonColor: "#d33", // Color del botón de cancelar
            confirmButtonText: "Confirmar", // Texto del botón de confirmación
            cancelButtonText: 'Cancelar' // Texto del botón de cancelar
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteProblemService(); // Llamar a la función para eliminar el problema si se confirma
            }
        });
    }

    return (
        <>
            <button className="btn btn-outline-danger" onClick={ConfirmDelete}>Eliminar problema</button> {/* Botón para eliminar el problema */}
        </>
    )
}


// Componente funcional para agregar o actualizar una solución al problema
export function AddSolucion({ idProblema, accion, solucionActual }) {
    const [idProblemaSolucion, setIdProblema] = useState(); // Estado para almacenar el id del problema para la solución
    const [solucion, setSolucion] = useState(); // Estado para almacenar la solución
    const [show, setShow] = useState(false); // Estado para controlar la visibilidad del modal
    const [token, setToken] = useState(null); // Estado para almacenar el token de autenticación
    const variateButton = accion === 'update' ? "outline-dark" : "outline-success"; // Determinar variante del botón según la acción
    const titulo = accion === 'update' ? "Actualizar solución" : "Agregar solución"; // Determinar título del modal según la acción
    const banner = accion === 'update' ? "Actualizar solución" : "Agregar solución"; // Determinar título del banner según la acción

    // Efecto para actualizar el token, el id del problema y la solución actual
    useEffect(() => {
        setToken(Cookies.get('jwt')); // Obtener el token de autenticación almacenado en cookies
        setIdProblema(idProblema); // Establecer el id del problema en el estado
        setSolucion(solucionActual); // Establecer la solución actual en el estado
    }, [idProblema, solucionActual]);

    // Función para cerrar el modal
    const handleClose = () => setShow(false);

    // Función para abrir el modal
    const handleShow = () => setShow(true);

    // Función para manejar el cambio en la solución
    const handleSolutionChange = (event) => {
        setSolucion(event.target.value);
    };

    // Configuración de headers para las peticiones HTTP con el token de autenticación
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Función para agregar una solución al problema
    const agregarSolucion = async () => {
        try {
            await axios.post(`${endpoint}/soluciones/add/${idProblemaSolucion}`, { solucion: solucion }, config)
                .then(function () {
                    OkAlert('Solución agregada correctamente'); // Alerta de éxito si la solución se agregó correctamente
                    handleClose(); // Cerrar el modal después de agregar la solución
                }).catch(
                    function (error) {
                        ErrorAlert('Error al agregar solución'); // Alerta de error si hay algún problema con la petición
                        console.log(error); // Mostrar error en la consola
                    });
        } catch (error) {
            console.error('Error al enviar reporte:', error); // Mostrar error en la consola
            ErrorAlert('Error al enviar reporte'); // Alerta de error al usuario
        }
    };

    // Función para actualizar una solución existente
    const actualizarSolucion = async () => {
        try {
            await axios.put(`${endpoint}/soluciones/update/${idProblemaSolucion}`, { solucion: solucion }, config)
                .then(function () {
                    OkAlert('Solución actualizada correctamente'); // Alerta de éxito si la solución se actualizó correctamente
                    handleClose(); // Cerrar el modal después de actualizar la solución
                }).catch(
                    function (error) {
                        ErrorAlert('Error al actualizar solución'); // Alerta de error si hay algún problema con la petición
                        console.log(error); // Mostrar error en la consola
                    });
        } catch (error) {
            console.error('Error al enviar reporte:', error); // Mostrar error en la consola
            ErrorAlert('Error al enviar reporte'); // Alerta de error al usuario
        }
    };

    // Función para manejar el envío del formulario de agregar o actualizar solución
    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar comportamiento por defecto del evento submit
        if (!solucion) {
            alert('Por favor especifique una descripción y suba una evidencia'); // Alerta si falta la solución
            return;
        }
        accion === 'update' ? actualizarSolucion() : agregarSolucion(); // Llamar función correspondiente según la acción
    };

    return (
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