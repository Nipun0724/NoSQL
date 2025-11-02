import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

// --- Database Setup ---
// (This is the same setup from your other route file to ensure consistency)

const DB_URI = process.env.DB_URI

const incidentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, required: true, default: 'Open' },
  details: { type: Object, required: true },
  reportedAt: { type: Date, default: Date.now }
})

const Incident = mongoose.models.Incident || mongoose.model("Incident", incidentSchema, "incidents")

async function connectDB() {
  if (!DB_URI) {
    throw new Error("DB_URI environment variable is not set")
  }
  
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(DB_URI)
      console.log("Database connected successfully.")
    } catch (e) {
      console.error("Database connection error:", e)
      throw new Error("Failed to connect to database")
    }
  }
}

// --- [NEW] PUT (Update) Handler ---
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = await params // Get the ID from the URL
    const body = await request.json() // Get the update data (e.g., { "status": "Resolved" })

    // Find the incident by its ID and update it
    // { new: true } makes it return the *updated* document
    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      body, 
      { new: true, runValidators: true }
    )

    if (!updatedIncident) {
      return NextResponse.json({ message: "Incident not found" }, { status: 404 })
    }
    
    return NextResponse.json(updatedIncident, { status: 200 })
  } catch (error: any) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ message: "Error updating incident", error: error.message }, { status: 400 })
  }
}

// --- [NEW] DELETE Handler ---
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = await params // Get the ID from the URL

    const deletedIncident = await Incident.findByIdAndDelete(id)

    if (!deletedIncident) {
      return NextResponse.json({ message: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Incident deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting incident:", error)
    return NextResponse.json({ message: "Error deleting incident", error: error.message }, { status: 500 })
  }
}