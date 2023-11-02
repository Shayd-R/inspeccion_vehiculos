import multer from 'multer';
import path from 'path'

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Especifica la carpeta donde se guardarán los archivos subidos
        cb(null, 'C:\Users\shayd\Desktop\suratrans\src\public\img\firmas');
    },
    filename: (req, file, cb) => {
        // Define el nombre del archivo en función de la fecha y hora actual
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export default {upload, path};