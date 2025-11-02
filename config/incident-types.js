export const INCIDENT_TYPES_CONFIG = {
  Phishing: {
    icon: "🎣",
    fields: [
      { name: "sender_email", label: "Sender Email", type: "email", placeholder: "attacker@suspicious.com", icon: "📧" },
      { name: "subject", label: "Email Subject", type: "text", placeholder: "e.g., Urgent: Verify your account", icon: "📝" }
    ]
  },
  Malware: {
    icon: "🦠",
    fields: [
      { name: "file_hash", label: "File Hash", type: "text", placeholder: "SHA256 hash", icon: "🔗" },
      { name: "infected_host", label: "Infected Host", type: "text", placeholder: "e.g., DESKTOP-ABC123", icon: "🖥️" }
    ]
  },
  DDoS: {
    icon: "🌊",
    fields: [
      { name: "source_ip", label: "Source IP(s)", type: "text", placeholder: "e.g., 192.168.1.100, 10.0.0.0/24", icon: "🌐" },
      { name: "traffic_volume", label: "Traffic Volume", type: "text", placeholder: "e.g., 10 Gbps", icon: "📊" }
    ]
  },
  "Data Breach": {
    icon: "🔓",
    fields: [
      { name: "data_type_exposed", label: "Data Type Exposed", type: "text", placeholder: "e.g., PII, User Credentials", icon: "👤" },
      { name: "records_affected", label: "Records Affected (Est.)", type: "number", placeholder: "e.g., 1000", icon: "🔢" }
    ]
  }
};
