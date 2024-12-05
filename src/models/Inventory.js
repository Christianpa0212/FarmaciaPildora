import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  branch: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
});

// Índice compuesto para branch, name y expirationDate
inventorySchema.index({ branch: 1, name: 1, expirationDate: 1 }, { unique: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
