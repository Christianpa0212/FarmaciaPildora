import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Esquema de usuarios
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  paternal: { type: String, required: true },
  maternal: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  role: { type: String, enum: ['admin', 'supervisor', 'employee'], required: true },
  picture: { type: String, default: "/img/default-profile.png" },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: function () { return this.role === 'employee' || this.role === 'supervisor'; }
  },
});

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
