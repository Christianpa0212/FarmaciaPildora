import express from 'express';
import { isSupervisor } from '../../../middlewares/login/authMiddleware.js';
import {
  getOrdersByBranch,
  getOrderDetailsForSupervisor,
  createOrder,
  markOrderAsReceived,
  generateOrderPDF,
  renderCreateOrderPage,
} from '../../../controllers/admin/orderControllers.js';

const router = express.Router();

// Renderizar todos los pedidos para el supervisor
router.get('/', isSupervisor, async (req, res) => {
  const orders = await getOrdersByBranch(req); 
  res.render('supervisor/supervisorOrders', { orders });
});

// Renderizar la vista de creación de un nuevo pedido
router.get('/create', isSupervisor, renderCreateOrderPage);

// Ver detalles de un pedido específico
router.get('/:id', isSupervisor, getOrderDetailsForSupervisor);



// Crear un nuevo pedido
router.post('/create', isSupervisor, createOrder);

// Marcar pedido como recibido
router.post('/:id/receive', isSupervisor, markOrderAsReceived);

router.get('/generate-pdf/:id', isSupervisor, generateOrderPDF);

export default router;
