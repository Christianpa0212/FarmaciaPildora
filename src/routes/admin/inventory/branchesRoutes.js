import express from 'express';
import { isAdmin } from '../../../middlewares/login/authMiddleware.js';
import { renderBranchInventory } from '../../../controllers/admin/inventoryController.js';

const router = express.Router();

router.get('/norte', isAdmin, (req, res) => renderBranchInventory(req, res, 'Norte'));
router.get('/sur', isAdmin, (req, res) => renderBranchInventory(req, res, 'Sur'));
router.get('/centro', isAdmin, (req, res) => renderBranchInventory(req, res, 'Centro'));



export default router;
