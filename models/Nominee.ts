import mongoose from "mongoose"

// Delete the existing model if it exists
if (mongoose.models.Nominee) {
  delete mongoose.models.Nominee
}

const nomineeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  victimId: {
    type: mongoose.Schema.Types.Mixed, // Allow both String and ObjectId
    required: true,
    ref: "Victim"
  },
  name: {
    type: String,
    required: true
  },
  nid: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  bankDetails: {
    fullName: {
      type: String,
      required: true
    },
    accountNo: {
      type: String,
      required: true
    },
    branchName: {
      type: String,
      required: true
    },
    mobileProvider: String,
    mobileAccountNo: String
  },
  documents: [{
    name: String,
    type: String,
    url: String
  }],
  district: {
    type: String,
    required: true
  },
  subDistrict: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "uno-verified", "admin-verified", "rejected"],
    default: "pending"
  },
  unoVerification: {
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verifiedAt: Date,
    rejectionReason: String
  },
  adminVerification: {
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verifiedAt: Date,
    rejectionReason: String
  },
  assignedUno: {
    unoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    district: String,
    subDistrict: String
  }
}, { timestamps: true })

// Add indexes for faster queries
nomineeSchema.index({ victimId: 1 })
nomineeSchema.index({ userId: 1 })

const Nominee = mongoose.model("Nominee", nomineeSchema)
export default Nominee
