import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    // Clear the connection to force schema recompilation
    cached.conn = null
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    }).catch((error) => {
      console.error("MongoDB connection error:", error)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("Failed to establish MongoDB connection:", e)
    throw e
  }

  return cached.conn
}

export default dbConnect
