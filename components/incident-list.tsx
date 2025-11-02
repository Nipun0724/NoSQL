"use client"
import { useState } from "react"
import "../styles/incident-list.css"
import IncidentModal from "./incident-modal"
import IncidentDetails from "./incident-details"

function IncidentList({ incidents, onUpdate, onDelete, loading }) {
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getSeverityClass = (severity) => {
    return `severity-${severity.toLowerCase()}`
  }

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(/\s+/g, "-")}`
  }

  const getIncidentIcon = (type) => {
    return type === "Phishing" ? "🎣" : "🦠"
  }

  const handleEditClick = (incident) => {
    setSelectedIncident(incident)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIncident(null)
  }

  if (loading) {
    return (
      <div className="incidents-container">
        <div className="section-header">
          <h2>Active Incidents</h2>
        </div>
        <div className="loading">Loading incidents...</div>
      </div>
    )
  }

  return (
    <div className="incidents-container">
      <div className="section-header">
        <h2>Active Incidents</h2>
        <span className="incident-count">{incidents.length} total</span>
      </div>

      {incidents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <p>No incidents reported. Keep up the good security!</p>
        </div>
      ) : (
        <div className="incidents-grid">
          {incidents.map((incident) => (
            <div key={incident._id} className="incident-card">
              <div className="card-header">
                <div className="incident-type-badge">
                  <span className="type-icon">{getIncidentIcon(incident.category)}</span>
                  <span className="type-name">{incident.category}</span>
                </div>
                <span className={`severity-badge ${getSeverityClass(incident.severity)}`}>{incident.severity}</span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`status-badge ${getStatusClass(incident.status)}`}>{incident.status}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Reported:</span>
                  <span className="info-value">{new Date(incident.reportedAt).toLocaleString()}</span>
                </div>
                <IncidentDetails details={incident.details} />
              </div>

              <div className="card-footer">
                <button
                  className="action-btn status-btn"
                  onClick={() => handleEditClick(incident)}
                  title="Edit incident"
                >
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(incident._id)}
                  title="Delete this incident"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <IncidentModal
        isOpen={isModalOpen}
        incident={selectedIncident}
        onClose={handleCloseModal}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  )
}

export default IncidentList
