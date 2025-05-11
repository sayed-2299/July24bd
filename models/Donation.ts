import mongoose from "mongoose"

const DonationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    donorName: {
      type: String,
    },
    donorType: {
      type: String,
      enum: ["individual", "organization", "anonymous"],
      required: true,
    },
    recipientType: {
      type: String,
      enum: ["victim", "nominee", "fund"],
      required: true,
    },
    recipientId: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "declined"],
      default: "pending",
    },
    receivedStatus: {
      type: String,
      enum: ["pending", "received", "reported"],
      default: "pending",
    },
    district: {
      type: String,
    },
    subDistrict: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema)
