import express from 'express';
import passport from 'passport';
import { logout } from '../../controllers/login/authController.js';

const router = express.Router();

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login/login', { layout: false }); // Renderiza la vista del login sin un layout global
});

// Ruta para procesar el inicio de sesión
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login', // Redirige al login si la autenticación falla
}), (req, res) => {
    // Redirige según el rol del usuario
    if (req.user.role === 'admin') {
        res.redirect('/admin');
    } else if (req.user.role === 'supervisor') {
        res.redirect('/supervisor');
    } else {
        res.redirect('/employees');
    }
});

// Ruta para cerrar sesión
router.get('/logout', logout);

export default router;
