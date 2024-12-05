import express from 'express';
import {
  generateSalePDF,
  renderSalesPageE,
  renderCreateSalePageE,
  createSaleE,
  renderSaleDetailsE,
} from '../../../controllers/admin/salesControllers.js';
import { isEmployee } from '../../../middlewares/login/authMiddleware.js';

const router = express.Router();

// Renderizar la página de ventas (tabla de ventas)
router.get('/', isEmployee, renderSalesPageE);

// Renderizar la página de creación de una venta
router.get('/create', isEmployee, renderCreateSalePageE);

// Renderizar los detalles de una venta específica
router.get('/:id', isEmployee, renderSaleDetailsE);

// Procesar la creación de una venta
router.post('/create', isEmployee, createSaleE);

// Generar un PDF con los detalles de una venta
router.get('/generate-pdf/:id', isEmployee, generateSalePDF);

export default router;
