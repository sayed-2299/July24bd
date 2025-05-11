import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    organization: { type: String }
  },
  category: {
    type: String,
    required: true,
    enum: ["news", "story", "report", "other"]
  },
  tags: [String],
  images: [{
    url: String,
    caption: String
  }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Article || mongoose.model("Article", articleSchema)
