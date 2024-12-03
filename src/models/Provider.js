import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // El nombre debe ser único para evitar duplicados
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validación para 10 dígitos
      },
      message: "El teléfono debe tener 10 dígitos."
    }
  }
});

export default mongoose.model('Supplier', supplierSchema);
