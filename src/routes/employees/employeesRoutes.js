import express from 'express';
import { isEmployee } from '../../middlewares/login/authMiddleware.js';
import inventoryRoutes from './inventory/inventoryRoutes.js';
import saleRoutes from './sales/saleRoutes.js';

const router = express.Router();

router.use(isEmployee);

// Ruta para renderizar el dashboard principal
router.get('/', isEmployee, (req, res) => {
    res.render('employees/dashboard', { layout: false });
});

router.use('/dashboard/inventory' , inventoryRoutes);
router.use('/dashboard/sales' , saleRoutes);

export default router;
