import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    // --- NEW FIELDS ADDED ---
    bio: {
      type: String,
      default: '', // Default to an empty string
    },
    github: {
      type: String,
      default: '',
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// pre-save hook for password hashing (no change)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// matchPassword method (no change)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;    