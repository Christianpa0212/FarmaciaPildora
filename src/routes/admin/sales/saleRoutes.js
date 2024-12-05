import express from 'express';
import branchesRoutes from './branchesRoutes.js';
import { isAdmin } from '../../../middlewares/login/authMiddleware.js';

const router = express.Router();

router.get('/', isAdmin, (req, res) => {
  res.render('admin/sales', { layout: false });
});

router.use('/branch', branchesRoutes);

export default router;