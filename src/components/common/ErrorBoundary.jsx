import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FestFlow ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, textAlign: "center", fontFamily: "sans-serif", maxWidth: 500, margin: "40px auto" }}>
          <h2 style={{ color: "#f14d4d", marginBottom: 8 }}>FestFlow Control</h2>
          <div style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 14,
            borderRadius: 12,
            fontSize: 12,
            textAlign: "left",
            fontFamily: "monospace",
            marginBottom: 16,
            wordBreak: "break-word"
          }}>
            {this.state.error?.toString() || "Unknown rendering error"}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              background: "#f14d4d",
              color: "#fff",
              border: "none",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
