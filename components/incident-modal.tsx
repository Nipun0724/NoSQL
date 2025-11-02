"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "../styles/incident-modal.css"
// 1. Import your config file to render the dynamic fields
import { INCIDENT_TYPES_CONFIG } from "../config/incident-types"

interface IncidentModalProps {
  isOpen: boolean
  incident: any
  onClose: () => void
  onUpdate: (id: string, updatedData: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function IncidentModal({ isOpen, incident, onClose, onUpdate, onDelete }: IncidentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // 2. This state will hold all form data (status, severity, and all dynamic fields)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // 3. Get the config for the *current* incident
  // We use incident?.type so it's safe if 'incident' is null
  const currentTypeConfig = INCIDENT_TYPES_CONFIG[incident?.type];

  // 4. Use useEffect to load data into the form when the modal opens
  useEffect(() => {
    if (isOpen && incident) {
      // Set the form state based on the incident
      setFormData({
        status: incident.status,
        severity: incident.severity,
        ...incident.details // Spread all 'details' fields (e.g., sender_email)
      })
    }
  }, [isOpen, incident]) // Re-run this logic when the modal opens or the incident changes

  
  // 5. This single handler works for ALL fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 6. This function rebuilds the 'details' object before sending
  const handleUpdate = async () => {
    if (!currentTypeConfig) return; // Safety check

    setIsLoading(true)

    // Separate the common fields from the 'details' fields
    const updatedData: any = {
      status: formData.status,
      severity: formData.severity,
      details: {}
    };

    // Loop over the config and pull the dynamic fields back into the 'details' object
    for (const field of currentTypeConfig.fields) {
      if (formData[field.name] !== undefined) {
        updatedData.details[field.name] = formData[field.name]
      }
    }
    
    try {
      await onUpdate(incident._id, updatedData)
      onClose()
    } catch (error) {
      console.error("Error updating incident:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 7. This function is the same, no changes needed
  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(incident._id)
      onClose()
    } catch (error) {
      console.error("Error deleting incident:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !incident) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!showDeleteConfirm ? (
          <>
            <div className="modal-header">
              <h2>Edit Incident</h2>
              <button className="modal-close" onClick={onClose} disabled={isLoading}>
                ✕
              </button>
            </div>

            {/* --- [NEW] MODAL BODY --- */}
            <div className="modal-body">
              {/* Read-only Incident Type */}
              <div className="form-group">
                <label>Incident Type</label>
                <input
                  type="text"
                  value={incident.type}
                  disabled={true}
                  className="form-input read-only"
                />
              </div>

              {/* Editable Status and Severity */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="severity">Severity</label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="form-select"
                  >
                    <option value="Open">Open</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Details Fields */}
              <div className="dynamic-fields-modal">
                <label className="details-label">Details</label>
                {currentTypeConfig ? (
                  currentTypeConfig.fields.map(field => (
                    <div className="form-group" key={field.name}>
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="form-input"
                      />
                    </div>
                  ))
                ) : (
                  <p>No details configuration for this incident type.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose} disabled={isLoading}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)} disabled={isLoading}>
                Delete
              </button>
              <button className="btn-primary" onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Incident"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* --- [NEW] DELETE CONFIRMATION --- */}
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <p>Are you sure you want to delete this incident? This action cannot be undone.</p>
                <div className="incident-preview">
                  {/* Updated to show relevant info */}
                  <p>
                    <strong>Type: {incident.type}</strong>
                  </p>
                  <p className="text-muted">ID: {incident._id}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
                Cancel
              </button>
              <button className="btn-danger-confirm" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Yes, Delete Incident"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}