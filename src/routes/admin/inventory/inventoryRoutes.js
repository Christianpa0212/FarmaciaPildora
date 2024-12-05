import express from 'express';
import productRoutes from './productRoutes.js';
import branchesRoutes from './branchesRoutes.js';
import { isAdmin } from '../../../middlewares/login/authMiddleware.js';

const router = express.Router();

// Ruta para renderizar la vista principal de inventario
router.get('/', isAdmin, (req, res) => {
  res.render('admin/inventory', { layout: false });
});

// Subrutas de productos dentro del inventario
router.use('/products', productRoutes);
router.use('/branch', branchesRoutes);

export default router;