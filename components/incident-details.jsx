import "../styles/incident-details.css" // We will create this CSS file in step 3

// Helper function to format keys like "sender_email" into "Sender Email"
function formatKey(keyString) {
  if (!keyString) return ""
  return keyString
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function IncidentDetails({ details }) {
  // Get an array of [key, value] pairs from the object
  const entries = Object.entries(details || {})

  // If there are no details, don't render anything
  if (entries.length === 0) {
    return null
  }

  return (
    <div className="details-section">
      <span className="info-label">Details:</span>
      <ul className="details-list">
        {entries.map(([key, value]) => (
          <li key={key} className="detail-item">
            <span className="detail-key">{formatKey(key)}:</span>
            <span className="detail-value">{value.toString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IncidentDetails