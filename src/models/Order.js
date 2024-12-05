import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }, // Número único del pedido
  supervisorName: { type: String, required: true }, // Nombre + Apellido Paterno del supervisor
  branch: { type: String, required: true }, // Sucursal del supervisor
  products: [
    {
      name: { type: String, required: true }, // Nombre del producto
      quantity: { type: Number, required: true }, // Cantidad ingresada manualmente
      price: { type: Number, required: true }, // Precio de venta jalado de Product.js
    }
  ], // Productos seleccionados para el pedido
  total: { type: Number, required: true }, // Total del pedido (cálculo dinámico)
  status: { 
    type: String, 
    enum: ['pendiente', 'rechazado', 'aceptado', 'recibido'], 
    default: 'pendiente' 
  }, // Estado del pedido
  creationDate: { type: Date, default: Date.now }, // Fecha de creación automática
  receptionDate: { type: Date }, // Fecha de recepción, si aplica
});

export default mongoose.model('Order', orderSchema);
