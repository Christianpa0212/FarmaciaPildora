import express from 'express';
import { createOrder, getOrdersByBranch, getAllOrders, updateOrderStatus } from '../../controllers/admin/orderControllers.js';
import { isAdmin, isSupervisor } from '../../middlewares/login/authMiddleware.js';

const router = express.Router();

// Ruta para que el supervisor cree un nuevo pedido
router.post('/create', isSupervisor, createOrder);

// Ruta para que el supervisor vea los pedidos filtrados por su sucursal
router.get('/branch', isSupervisor, getOrdersByBranch);

// Ruta para que el admin vea todos los pedidos
router.get('/all', isAdmin, getAllOrders);

// Ruta para actualizar el estatus de un pedido
router.patch('/status/:id', isAdmin, updateOrderStatus);

export default router;
