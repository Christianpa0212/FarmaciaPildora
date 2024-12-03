import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Esquema del modelo de usuario
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    paternal: { 
        type: String, 
        required: true 
    },
    maternal: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true, 
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
        }
    },
    birthDate: { 
        type: Date, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'supervisor', 'employee'],
        required: true 
    },
    picture: { 
        type: String, 
        default: "/img/default-profile.png" 
    },
    branch: { 
        type: String, 
        required: function () {
            return this.role === 'supervisor' || this.role === 'employee';
        }
    },
    CLABE: { 
        type: String, 
        required: function () {
            return this.role === 'supervisor' || this.role === 'employee';
        },
        validate: {
            validator: function (v) {
                if (v) {
                    return /^\d{18}$/.test(v);
                }
                return true;
            },
        }
    },
    acumulatedBalance: {
        type: Number,
        required: function () {
            return this.role === 'supervisor' || this.role === 'employee';
        },
        default: 0,
        validate: {
            validator: function (v) {
                return v >= 0; 
            },
        }
    }
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
