// Importamos mongoose para conectarnos a la base de datos MongoDB
import mongoose from 'mongoose';

// Función para conectar con Mongo
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo Atlas conectado');
  } catch (error) {
    console.error('Error al conectar a Mongo Atlas:', error);
    process.exit(1); 
  }
};

// Exportamos la función para usarla en otros archivos
export default connectDB;
