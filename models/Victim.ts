import mongoose from "mongoose"

const victimSchema = new mongoose.Schema({
  victimId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"]
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationalId: {
    type: String,
    required: true,
    unique: true
  },
  district: {
    type: String,
    required: true
  },
  subDistrict: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  familyMembers: {
    type: Number,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  economicCondition: {
    type: String,
    enum: ["below-poverty", "lower-income", "middle-income", "upper-middle", "high-income"],
    required: true
  },
  profession: {
    type: String,
    enum: ["student", "business", "service", "agriculture", "day-laborer", "housewife", "unemployed", "other"],
    required: true
  },
  institutionName: {
    type: String
  },
  status: {
    type: String,
    enum: ["deceased", "injured", "missing"],
    required: true
  },
  causeOfDeath: {
    type: String
  },
  causeOfInjury: {
    type: String
  },
  incidentPlace: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  supportingDocuments: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  verificationStatus: {
    type: String,
    enum: ["pending", "uno-verified", "admin-verified", "rejected"],
    default: "pending"
  },
  // UNO Verification Details
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
  // Admin Verification Details
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
  applicant: {
    fullName: {
      type: String,
      required: [true, "Applicant's full name is required"]
    },
    id: {
      type: String,
      required: [true, "Applicant's ID is required"]
    },
    email: {
      type: String,
      required: [true, "Applicant's email is required"]
    },
    phone: {
      type: String,
      required: [true, "Applicant's phone number is required"],
      validate: {
        validator: function(v: string) {
          return /^[0-9+\-\s()]{10,15}$/.test(v)
        },
        message: (props: { value: string }) => `${props.value} is not a valid phone number!`
      }
    },
    relationship: {
      type: String,
      required: [true, "Applicant's relationship is required"]
    }
  }
}, { 
  timestamps: true,
  strict: true // Ensure only defined fields are saved
})

// Add indexes for better query performance
victimSchema.index({ verificationStatus: 1 })
victimSchema.index({ "unoVerification.status": 1 })
victimSchema.index({ "adminVerification.status": 1 })
victimSchema.index({ district: 1, subDistrict: 1 })

export default mongoose.models.Victim || mongoose.model("Victim", victimSchema)
