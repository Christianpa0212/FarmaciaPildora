// Controlador de cierre de sesión
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err); // Maneja errores al cerrar sesión
    res.redirect('/auth/login'); // Redirige al login después de cerrar sesión
  });
};
