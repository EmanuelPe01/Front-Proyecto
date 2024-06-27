// URL base para la comunicación con el servidor
export const endpoint = 'http://localhost:8080';

// Función para validar la extensión del archivo
export const validateFileType = (fileName) => {
    // Extensiones permitidas para los archivos
    const allowedExtensions = ['mp3', 'mp4', 'jpg', 'png'];

    // Obtener la extensión del archivo proporcionado
    const fileExtension = fileName.split('.').pop().toLowerCase();

    // Verificar si la extensión está en la lista de extensiones permitidas
    // Devolver la extensión si es válida, de lo contrario devolver una cadena vacía
    return allowedExtensions.includes(fileExtension) ? fileExtension : '';
};
