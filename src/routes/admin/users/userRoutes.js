import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from '../../../controllers/admin/userController.js';
import { isAdmin } from '../../../middlewares/login/authMiddleware.js';

const router = express.Router();

// *** Configuración de Multer ***
// Función para configurar el almacenamiento dinámico de archivos.
const storage = (folder) =>
    multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `public/img/${folder}`); // Define la carpeta donde se guardarán los archivos.
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Crea un nombre único para cada archivo.
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Combina el nombre único con la extensión original.
      },
    });
  
  const uploadEmployees = multer({ storage: storage('employees') }); // Configura Multer específicamente para empleados.

  
// *** CRUD de Usuarios ***
// Ruta para obtener todos los usuarios.
router.get('/', isAdmin, getAllUsers);

// Ruta para obtener un usuario por ID.
router.get('/:id', isAdmin, getUserById);

// Ruta para crear un usuario (con carga de imagen opcional).
router.post('/', isAdmin, uploadEmployees.single('picture'), createUser);

// Ruta para actualizar un usuario .
router.patch('/update/:id', isAdmin, uploadEmployees.single('picture'), updateUser);

// Ruta para eliminar un usuario.
router.delete('/delete/:id', isAdmin, deleteUser);

export default router;