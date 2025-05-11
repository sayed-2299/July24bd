import mongoose from "mongoose"

const fundTransactionSchema = new mongoose.Schema({
  fundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fund",
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FundApplication",
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
  amount: {
    type: Number,
    required: true
  },
  note: {
    type: String
  },
  status: {
    type: String,
    enum: ["approved", "received", "reported"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.FundTransaction || mongoose.model("FundTransaction", fundTransactionSchema) 