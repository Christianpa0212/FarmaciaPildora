import express from 'express';
import { isAdmin } from '../../../middlewares/login/authMiddleware.js';
import { renderBranchSales } from '../../../controllers/admin/salesControllers.js';

const router = express.Router();

router.get('/norte', isAdmin, (req, res) => renderBranchSales(req, res, 'Norte'));
router.get('/sur', isAdmin, (req, res) => renderBranchSales(req, res, 'Sur'));
router.get('/centro', isAdmin, (req, res) => renderBranchSales(req, res, 'Centro'));



export default router;
