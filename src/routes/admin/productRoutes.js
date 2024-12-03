import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderProductsPage,
  renderEditProductPage
} from '../../controllers/admin/productController.js';
import { isAdmin } from '../../middlewares/login/authMiddleware.js';

const router = express.Router();

// Ruta para renderizar la vista de productos
router.get('/', isAdmin, renderProductsPage);

// Ruta para obtener todos los productos en formato JSON
router.get('/all', isAdmin, getAllProducts);

// Ruta para obtener un producto por ID
router.get('/:id', isAdmin, getProductById);

// Ruta para crear un nuevo producto
router.post('/create', isAdmin, createProduct);

router.get('/edit/:id', isAdmin, renderEditProductPage);

// Ruta para actualizar un producto existente
router.post('/update/:id', isAdmin, updateProduct);

// Ruta para eliminar un producto
router.post('/delete/:id', isAdmin, deleteProduct);

export default router;
