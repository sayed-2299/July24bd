import mongoose from "mongoose"

const GalleryItemSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    photographer: {
      type: String,
    },
    source: {
      type: String,
    },
    uploaderName: {
      type: String,
    },
    uploaderEmail: {
      type: String,
    },
    uploaderPhone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema)
