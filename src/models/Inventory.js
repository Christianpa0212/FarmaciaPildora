import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  branch: { type: String, required: true }, // Sucursal (norte, centro, sur)
  name: { type: String, required: true }, // Nombre del producto
  quantity: { type: Number, required: true }, // Cantidad total en inventario
  expirationDate: { type: Date, required: true }, // Fecha de caducidad más próxima
});

export default mongoose.model('Inventory', inventorySchema);
