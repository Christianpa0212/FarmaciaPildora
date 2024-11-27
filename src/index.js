import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';               
import connectDB from './config/db.js';     
import passport from './config/passport.js'; 
import authRoutes from './routes/authRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js'; 
import path from 'path';                  
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import moment from 'moment';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear instancia de Express
const app = express();

// Configuración de Handlebars como motor de plantillas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('hbs', engine({
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
},
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: false,
  helpers: {
    formatDate: (date) => {
      return moment(date).format('DD-MM-YYYY'); 
    }
  }
}));
app.set('view engine', 'hbs');                
app.set('views', path.join(__dirname, 'views')); 

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
  secret: process.env.JWT_SECRET,              
  resave: false,                               
  saveUninitialized: false,                    
}));

// Inicialización de Passport para autenticación
app.use(passport.initialize());          
app.use(passport.session());                  

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Configuración de las rutas
app.use('/auth', authRoutes);                  

// Redirigir la ruta raíz a /auth/login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Usar las rutas de administración
app.use('/admin', adminRoutes);

// Configuración del puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
