// Verifica si el usuario está autenticado
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // Si está autenticado, continúa
    }
    res.redirect('/login'); // Si no, redirige al login
  };
  
  // Autoriza el acceso basado en el rol del usuario
  export const authorizeRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        return next(); // Si el rol coincide, continúa
    }
    res.status(403).send('Acceso denegado'); // Si no, muestra un error de acceso
  };
  
  // Middleware específico para verificar si es administrador
  export const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next(); 
    }
    res.status(403).send('Acceso denegado: No tienes permisos de administrador.'); 
  };
  
  // Middleware específico para verificar si es empleado
  export const isEmployee = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'employee') {
        return next(); 
    }
    res.status(403).send('Acceso denegado: No tienes permisos de empleado.'); 
  };
  
  // Middleware específico para verificar si es supervisor
  export const isSupervisor = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'supervisor') {
        return next(); 
    }
    res.status(403).send('Acceso denegado: No tienes permisos de supervisor.'); 
  };