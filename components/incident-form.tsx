"use client"

import { useState } from "react"
import "../styles/incident-form.css"
import { INCIDENT_TYPES_CONFIG } from "../config/incident-types"

const incidentTypeNames = Object.keys(INCIDENT_TYPES_CONFIG);

function IncidentForm({ onCreate }) {
  const [type, setType] = useState("")
  const [severity, setSeverity] = useState("Low")
  const [dynamicFields, setDynamicFields] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const currentTypeConfig = INCIDENT_TYPES_CONFIG[type];

  const handleDynamicFieldChange = (e) => {
    const { name, value } = e.target;
    setDynamicFields(prevFields => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setDynamicFields({}); // Clear old data
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanDetails = Object.fromEntries(
      Object.entries(dynamicFields).filter(([_, value]) => value !== '')
    );

    onCreate({ type, severity, details: cleanDetails })

    // Reset form and show success message
    setType("")
    setSeverity("Low")
    setDynamicFields({})
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="incident-form-container">
      <div className="form-header">
        <h2>Report Incident</h2>
        <p className="form-subtitle">File a new security incident</p>
      </div>

      {submitted && <div className="success-message">✓ Incident reported successfully</div>}

      <form onSubmit={handleSubmit} className="incident-form">
        {/* Incident Type (Now dynamically generated) */}
        <div className="form-group">
          <label htmlFor="incident-type">
            <span className="label-icon">⚠️</span> Incident Type
          </label>
          <select
            id="incident-type"
            value={type}
            onChange={handleTypeChange} // Use the new handler
            required
            className="form-select"
          >
            <option value="">Select incident type...</option>
            {/* 9. Generate options from the config */}
            {incidentTypeNames.map(typeName => (
              <option key={typeName} value={typeName}>{typeName}</option>
            ))}
          </select>
        </div>

        {/* Severity Level (No change needed) */}
        <div className="form-group">
          <label htmlFor="incident-severity">
            <span className="label-icon">🔴</span> Severity Level
          </label>
          <select
            id="incident-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
            className="form-select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* 10. DYNAMIC FIELDS RENDERER */}
        {/* This one block replaces all your old "Phishing Fields" and "Malware Fields" blocks */}
        {currentTypeConfig && (
          <div className="dynamic-fields">
            {currentTypeConfig.fields.map(field => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>
                  <span className="label-icon">{field.icon}</span> {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name} // 'name' is crucial for the handler
                  value={dynamicFields[field.name] || ""} // Controlled input
                  onChange={handleDynamicFieldChange} // The one handler for all
                  placeholder={field.placeholder}
                  className="form-input"
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={!type}>
          <span>{currentTypeConfig ? currentTypeConfig.icon : "🚨"}</span> Submit Report
        </button>
      </form>
    </div>
  )
}

export default IncidentForm
