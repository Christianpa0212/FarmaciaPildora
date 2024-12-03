import express from "express";
import { isSupervisor } from "../../middlewares/login/authMiddleware.js";


const router = express.Router();

// Ruta para renderizar el dashboard principal
router.get('/', isSupervisor, (req, res) => {
    res.render('supervisor/dashboard', { layout: false });
});


export default router;
