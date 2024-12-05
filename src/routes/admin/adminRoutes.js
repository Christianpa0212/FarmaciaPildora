import express from 'express';
import { isAdmin } from '../../middlewares/login/authMiddleware.js'; 
import inventoryRoutes from './inventory/inventoryRoutes.js';
import orderRoutes from './orders/orderRoutes.js';
import userRoutes from './users/userRoutes.js';
import saleRoutes from './sales/saleRoutes.js';

const router = express.Router(); // Crea una instancia del enrutador de Express.

router.use(isAdmin);

// *** Validación Global de IDs ***
// Middleware que valida si el ID en las rutas es válido antes de procesarlo.
router.param('id', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Verifica si el ID tiene el formato correcto de MongoDB.
    return res.status(400).json({ error: 'ID inválido.' }); // Devuelve un error si no es válido.
  }
  next(); // Si es válido, continúa al siguiente middleware o controlador.
});

// Ruta para renderizar el dashboard principal del admin.
router.get('/', isAdmin, (req, res) => {
  res.render('admin/dashboard', { layout: false }); // Renderiza la vista "dashboard.hbs".
});

// *** Rutas Delegadas ***
router.use('/dashboard/inventory', inventoryRoutes);
router.use('/dashboard/orders', orderRoutes);
router.use('/dashboard/users' , userRoutes);
router.use('/dashboard/sales' , saleRoutes);

// Middleware para capturar errores globalmente.
router.use((err, req, res, next) => {
  console.error('Error detectado:', err.stack); // Muestra el error en consola para depuración.
  res.status(500).json({ error: 'Ocurrió un error interno. Por favor, inténtelo de nuevo más tarde.' }); // Devuelve un error genérico al cliente.
});

export default router;
