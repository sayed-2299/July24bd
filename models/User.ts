import mongoose from "mongoose"

// Delete the existing model if it exists
if (mongoose.models.User) {
  delete mongoose.models.User
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["donor", "admin", "reporter", "uno", "nominee"],
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  profileImage: String,
  phone: String,
  address: String,
  district: String,
  subDistrict: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
})

// Add index for role only
userSchema.index({ role: 1 });

// Create and export the model
const User = mongoose.model("User", userSchema)
export default User
