import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import passport from './config/passport.js';
import authRoutes from './routes/login/authRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import employeesRoutes from './routes/employees/employeesRoutes.js';
import supervisorRoutes from './routes/supervisor/supervisorRoutes.js';
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



// Middleware para manejar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
    // Formatear fechas
    formatDate: (date) => moment(date).format('DD-MM-YYYY'), 

    // Compara dos valores (igualdad estricta)
    eq: (a, b) => a === b, 

    // Operador lógico OR
    or: (a, b) => a || b, 

    // Calcular el total de un producto
    calcTotal: (quantity, price) => (quantity * price).toFixed(2), 

    // Evaluar condiciones con operadores personalizados
    ifCond: function (v1, v2, options) {
      if (typeof v1 === 'undefined' || typeof v2 === 'undefined') {
        return options.inverse(this); // Si alguna variable es undefined, ejecuta el bloque else
      }
      if (v1 === v2) {
        return options.fn(this); // Si los valores coinciden, ejecuta el bloque if
      }
      return options.inverse(this); // De lo contrario, ejecuta el bloque else
    },

    // Comparación con operadores personalizados
    compare: function (v1, operator, v2, options) {
      switch (operator) {
        case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    },
  },
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

// Usar las rutas de empleados
app.use('/employees', employeesRoutes);

// Usar las rutas de supervisor
app.use('/supervisor', supervisorRoutes);

// Configuración del puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
