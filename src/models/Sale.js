import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  saleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  seller: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      details: {
        type: {
          patientName: { type: String }, 
          doctorNumber: { type: Number }, 
          doctorName: { type: String }, 
          medicalLicense: { type: String }, 
        },
        required: false,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Sale', SaleSchema);
