import connectDB from './config/db.js';

// Conectar a la base de datos
connectDB();

// Configuración del puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));