import express from 'express';
import {
  createSale,
  renderSalesPage,
  renderCreateSalePage,
  renderSaleDetails,
  generateSalePDF,
} from '../../../controllers/admin/salesControllers.js';
import { isSupervisor } from '../../../middlewares/login/authMiddleware.js';

const router = express.Router();

// Renderizar la página de ventas (tabla de ventas)
router.get('/', isSupervisor, renderSalesPage);

// Renderizar la página de creación de una venta
router.get('/create', isSupervisor, renderCreateSalePage);

// Renderizar los detalles de una venta específica
router.get('/:id', isSupervisor, renderSaleDetails);

// Procesar la creación de una venta
router.post('/create', isSupervisor, createSale);

// Generar un PDF con los detalles de una venta
router.get('/generate-pdf/:id', isSupervisor, generateSalePDF);

export default router;
