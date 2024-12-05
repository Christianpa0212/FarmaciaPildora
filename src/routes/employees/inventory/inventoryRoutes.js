import express from 'express';
import { isEmployee } from '../../../middlewares/login/authMiddleware.js';
import { renderbyBranchInventory } from '../../../controllers/admin/inventoryController.js';

const router = express.Router();

router.get('/', isEmployee, (req, res) => renderbyBranchInventory(req, res, req.user.branch));

export default router;