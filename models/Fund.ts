import mongoose from "mongoose"

const fundSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Fund || mongoose.model("Fund", fundSchema) 