import express from 'express';
import { isEmployee } from '../../middlewares/login/authMiddleware.js';


const router = express.Router();

// Ruta para renderizar el dashboard principal
router.get('/', isEmployee, (req, res) => {
    res.render('employees/dashboard', { layout: false });
});


export default router;
