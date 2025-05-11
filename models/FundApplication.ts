import mongoose from "mongoose"

const fundApplicationSchema = new mongoose.Schema({
  fundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fund",
    required: true
  },
  nomineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  victimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Victim",
    required: true
  },
  requestedAmount: {
    type: Number,
    required: true
  },
  note: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "received", "reported"],
    default: "pending"
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FundTransaction",
    required: false
  },
  nomineeSnapshot: {
    name: String,
    nid: String,
    phone: String,
    email: String,
    district: String,
    subDistrict: String,
    relationship: String,
    address: String,
  },
  victimSnapshot: {
    victimId: String,
    fullName: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.FundApplication || mongoose.model("FundApplication", fundApplicationSchema) 