import mongoose from 'mongoose';

const classificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Para evitar clasificaciones duplicadas
  }
});

export default mongoose.model('Classification', classificationSchema);
