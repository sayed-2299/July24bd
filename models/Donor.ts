import mongoose from "mongoose"

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorType: {
      type: String,
      enum: ["individual", "organization"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    nid: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    subDistrict: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    organizationName: {
      type: String,
      required: false,
    },
    registrationNo: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema)

export default Donor 