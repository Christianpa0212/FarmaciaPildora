import express from "express";
import { isSupervisor } from "../../middlewares/login/authMiddleware.js";
import orderRoutes from './orders/orderRoutes.js';
import inventoryRoutes from './inventory/inventoryRoutes.js';
import saleRoutes from './sales/saleRoutes.js';

const router = express.Router();

router.use(isSupervisor);

// *** Validación Global de IDs ***
// Middleware que valida si el ID en las rutas es válido antes de procesarlo.
router.param('id', (req, res, next, id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Verifica si el ID tiene el formato correcto de MongoDB.
      return res.status(400).json({ error: 'ID inválido.' }); // Devuelve un error si no es válido.
    }
    next(); // Si es válido, continúa al siguiente middleware o controlador.
  });

// Ruta para renderizar el dashboard principal
router.get('/', isSupervisor, (req, res) => {
    res.render('supervisor/dashboard', { layout: false });
});

router.use('/dashboard/orders' , orderRoutes);
router.use('/dashboard/inventory' , inventoryRoutes);
router.use('/dashboard/sales' , saleRoutes);

// Middleware para capturar errores globalmente.
router.use((err, req, res, next) => {
  console.error('Error detectado:', err.stack); // Muestra el error en consola para depuración.
  res.status(500).json({ error: 'Ocurrió un error interno. Por favor, inténtelo de nuevo más tarde.' }); // Devuelve un error genérico al cliente.
});

export default router;
