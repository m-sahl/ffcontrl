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
        <div style={{ padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ color: "#f14d4d", marginBottom: 8 }}>FestFlow Control</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
            Something went wrong while rendering. Please tap below to reload.
          </p>
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
