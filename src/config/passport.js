import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

// Configuración de la estrategia local
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Usamos "email" como nombre de usuario
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }); // Buscamos el usuario por email
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      const isMatch = await user.comparePassword(password); // Verificamos la contraseña
      if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user); // Usuario autenticado
    } catch (error) {
      return done(error);
    }
  }
));

// Serialización del usuario (almacenamos el ID en la sesión)
passport.serializeUser((user, done) => done(null, user.id));

// Deserialización del usuario (recuperamos los datos desde el ID)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Recuperamos al usuario por su ID
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
