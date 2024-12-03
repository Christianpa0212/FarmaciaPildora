import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classification: { type: String, required: true }, // Guardar el nombre de la clasificación
  supplier: { type: String, required: true }, // Guardar el nombre del proveedor
  purchasePrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
});

export default mongoose.model('Product', productSchema);
