import React from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY } from "../styles/DesignTokens";

const ResultsPlaceholderPage = ({ onBack }) => {
  return (
    <div className="anim-fade" style={{ maxWidth: 520, margin: "0 auto", padding: "30px 14px 84px", textAlign: "center" }}>
      <div style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: "40px 20px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)"
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "rgba(241, 77, 77, 0.1)",
          border: "1px solid rgba(241, 77, 77, 0.2)",
          color: CORAL_PRIMARY,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16
        }}>
          <Ic name="trophy" size={28} color={CORAL_PRIMARY} />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          Result Session Portal
        </h1>
        
        <p style={{ color: "#64748b", fontSize: 13, maxWidth: 360, margin: "0 auto 20px", lineHeight: 1.5 }}>
          The Result Session & Tabulation module will handle live score aggregation, judge certificates, and winner announcements.
        </p>

        <span className="badge badge-coral" style={{ padding: "5px 12px", fontSize: 11 }}>
          CONNECTING IN NEXT STAGE
        </span>

        <div style={{ marginTop: 28 }}>
          <button
            onClick={onBack}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            <Ic name="back" size={14} /> Return to Control Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPlaceholderPage;
