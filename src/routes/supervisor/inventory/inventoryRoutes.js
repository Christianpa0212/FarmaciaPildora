import express from 'express';
import { isSupervisor } from '../../../middlewares/login/authMiddleware.js';
import { renderbyBranchInventory } from '../../../controllers/admin/inventoryController.js';

const router = express.Router();

router.get('/', isSupervisor, (req, res) => renderbyBranchInventory(req, res, req.user.branch));

export default router;