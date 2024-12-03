import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from '../../controllers/admin/userController.js';
import { isAdmin } from '../../middlewares/login/authMiddleware.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
const router = express.Router();

// Modularización de configuración de Multer
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/img/${folder}`); // Directorio dinámico según entidad
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

const uploadEmployees = multer({ storage: storage('employees') });

// Validación global de IDs en rutas dinámicas
router.param('id', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }
  next();
});

// Rutas de productos
router.use('/dashboard/products', productRoutes);
router.use('/dashboard/orders', orderRoutes);

// Ruta para renderizar la vista de inventario
router.get('/dashboard/inventory', (req, res) => {
  res.render('admin/inventory', { layout: false }); // Renderiza la vista "inventory.hbs"
});

// Ruta para renderizar el dashboard principal
router.get('/', isAdmin, (req, res) => {
  res.render('admin/dashboard', { layout: false });
});

// CRUD para usuarios
router.get('/dashboard/users', isAdmin, getAllUsers); // Obtener todos los usuarios
router.get('/dashboard/users/:id', isAdmin, getUserById); // Obtener un usuario por ID
router.post('/dashboard/users', isAdmin, uploadEmployees.single('picture'), createUser); // Crear un usuario
router.patch('/dashboard/users/update/:id', isAdmin, uploadEmployees.single('picture'), updateUser); // Actualizar un usuario
router.delete('/dashboard/users/delete/:id', isAdmin, deleteUser); // Eliminar un usuario

// Manejo global de errores
router.use((err, req, res, next) => {
  console.error('Error detectado:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error interno. Por favor, inténtelo de nuevo más tarde.' });
});

export default router;
