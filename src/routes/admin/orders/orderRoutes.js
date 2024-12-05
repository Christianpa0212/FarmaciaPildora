import express from 'express';
import { isAdmin } from '../../../middlewares/login/authMiddleware.js';
import {
  getAllOrders,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  renderAdminOrdersPage,
  generateOrderPDF,
} from '../../../controllers/admin/orderControllers.js';


const router = express.Router();

router.get('/', isAdmin, renderAdminOrdersPage);
// Obtener todos los pedidos (Admin)
router.get('/all', isAdmin, getAllOrders);

// Ver detalles de un pedido específico (Admin)
router.get('/:id', isAdmin, getOrderDetailsForAdmin);

// Actualizar el estado del pedido (Aceptar/Rechazar)
router.post('/:id/status', isAdmin, updateOrderStatus);

router.get('/generate-pdf/:id', isAdmin, generateOrderPDF);

export default router;
