import mongoose from 'mongoose';

// Definición del esquema de Branch (Sucursal)
const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true }
  }
});

// Exportar el modelo
export default mongoose.model('Branch', branchSchema);
