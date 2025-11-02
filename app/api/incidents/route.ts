import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

const DB_URI = process.env.DB_URI

// --- [FIXED] ---
// This schema now matches your frontend form
const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Incident type is required."]
  },
  severity: {
    type: String,
    required: [true, "Severity level is required."]
  },
  status: {
    type: String,
    required: true,
    default: 'Open'
  },
  // This is the key part for your project
  details: {
    type: Object, // This allows for flexible, nested JSON
    required: [true, "Incident details are required."]
  },
  reportedAt: { // Changed from 'reported_at' to match your original schema
    type: Date,
    default: Date.now
  }
})

let Incident: mongoose.Model<any>

// Initialize MongoDB connection and model
async function initializeDB() {
  if (!DB_URI) {
    throw new Error("DB_URI environment variable is not set")
  }

  // Use mongoose.connection.readyState to check connection state
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(DB_URI)
      console.log("Database connected successfully.")
    } catch (e) {
      console.error("Database connection error:", e)
      throw new Error("Failed to connect to database")
    }
  }

  // Define the model if it's not already defined
  // This avoids "OverwriteModelError" in Next.js hot-reload
  Incident = mongoose.models.Incident || mongoose.model("Incident", incidentSchema, "incidents")
}

// GET handler (No change needed)
export async function GET(request: NextRequest) {
  try {
    await initializeDB()
    const incidents = await Incident.find({}).sort({ reportedAt: -1 }) // Sort by newest
    return NextResponse.json(incidents, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ message: "Error fetching incidents", error: error.message }, { status: 500 })
  }
}

// POST handler (No change needed, but the 'data' will now pass validation)
export async function POST(request: NextRequest) {
  try {
    await initializeDB()
    const data = await request.json()
    
    // The 'data' object { type, severity, details } will now pass validation
    const newIncident = await Incident.create(data)
    
    return NextResponse.json(newIncident, { status: 201 })
  } catch (error: any) {
    console.error("Error creating incident:", error)
    // This will no longer be a validation error
    return NextResponse.json({ message: "Error creating incident", error: error.message }, { status: 400 })
  }
}