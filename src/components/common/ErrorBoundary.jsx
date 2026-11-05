import React from "react";
import {
  CORAL_PRIMARY,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../../styles/DesignTokens";

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
        <div
          style={{
            padding: 24,
            textAlign: "center",
            maxWidth: 440,
            margin: "60px auto",
            background: "#ffffff",
            borderRadius: 22,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)"
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(241, 77, 77, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CORAL_PRIMARY,
              margin: "0 auto 14px",
              fontSize: 26
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              color: TEXT_PRIMARY_LIGHT,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.3px",
              marginBottom: 6
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: 13,
              color: TEXT_MUTED_LIGHT,
              marginBottom: 16,
              lineHeight: 1.4
            }}
          >
            The system safely recovered from an unexpected view error.
          </p>
          <div
            style={{
              background: "#f8fafc",
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              color: "#991b1b",
              padding: 12,
              borderRadius: 12,
              fontSize: 11,
              textAlign: "left",
              fontFamily: "monospace",
              marginBottom: 18,
              wordBreak: "break-word"
            }}
          >
            {this.state.error?.toString() || "Unknown error"}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              background: CORAL_PRIMARY,
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(241, 77, 77, 0.25)"
            }}
          >
            Reload Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
