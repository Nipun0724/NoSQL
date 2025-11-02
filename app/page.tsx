"use client"

import { useState, useEffect, useCallback } from "react"
import IncidentForm from "@/components/incident-form"
import IncidentList from "@/components/incident-list"
import "./page.css"

// Use NEXT_PUBLIC_ for client-side environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/incidents"

// --- [FIXED] ---
// This interface now matches your Mongoose schema and components
interface IncidentData {
  type: string
  severity: string
  status?: string
  details: Record<string, any> // This is your flexible details object
}

// This interface now matches your Mongoose schema
interface Incident extends IncidentData {
  _id: string
  reportedAt: string // Make sure this matches the 'reportedAt' in your schema
}
// --- [END OF FIX] ---

function App() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      setIncidents(data)
    } catch (error) {
      console.error("Error fetching incidents:", error)
      setError("Failed to load incidents. Make sure the backend server is running.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  const handleCreateIncident = async (incidentData: IncidentData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentData),
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      fetchIncidents()
    } catch (error) {
      console.error("Error creating incident:", error)
      alert("Failed to create incident. Check if backend is running.")
    }
  }

  // The type for updatedData is now correct
  const handleUpdateIncident = async (id: string, updatedData: Partial<IncidentData>) => {
    try {
      console.log(updatedData)
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      fetchIncidents()
    } catch (error) {
      console.error("Error updating incident:", error)
      alert("Failed to update incident.")
    }
  }

  const handleDeleteIncident = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      fetchIncidents()
    } catch (error) {
      console.error("Error deleting incident:", error)
      alert("Failed to delete incident.")
    }
  }

  // --- (Your JSX render is perfect, no changes needed) ---
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">🛡️</div>
          <div className="header-text">
            <h1>CyberSec Incident Tracker</h1>
            <p className="header-subtitle">Security incident reporting and management system</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}
        <div className="layout-grid">
          <aside className="form-section">
            <IncidentForm onCreate={handleCreateIncident} />
          </aside>
          <section className="incidents-section">
            <IncidentList
              incidents={incidents}
              onUpdate={handleUpdateIncident}
              onDelete={handleDeleteIncident}
              loading={loading}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App