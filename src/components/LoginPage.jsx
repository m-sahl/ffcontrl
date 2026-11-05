import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Ic from "./common/Ic";
import { triggerHaptic } from "../utils/haptics";
import {
  CORAL_PRIMARY,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT,
  RED_DANGER
} from "../styles/DesignTokens";
import AestheticRedLines from "./common/AestheticRedLines";

const PIN_LENGTH = 4;

const LoginPage = () => {
  const { verifyAndUnlock } = useAuth();
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDigit = useCallback((digit) => {
    if (isVerifying) return;
    triggerHaptic("light");
    setIsError(false);
    setErrorMessage("");

    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev;
      return prev + digit;
    });
  }, [isVerifying]);

  const handleBackspace = useCallback(() => {
    if (isVerifying) return;
    triggerHaptic("light");
    setIsError(false);
    setErrorMessage("");
    setPin((prev) => prev.slice(0, -1));
  }, [isVerifying]);

  const handleClear = useCallback(() => {
    if (isVerifying) return;
    triggerHaptic("light");
    setIsError(false);
    setErrorMessage("");
    setPin("");
  }, [isVerifying]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape" || e.key === "Delete") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleBackspace, handleClear]);

  // Trigger verification as soon as 4 digits are entered
  useEffect(() => {
    if (pin.length !== PIN_LENGTH || isVerifying) return;

    let isMounted = true;
    setIsVerifying(true);

    const check = async () => {
      const success = await verifyAndUnlock(pin);
      if (!isMounted) return;

      if (!success) {
        triggerHaptic("error");
        setIsError(true);
        setErrorMessage("Incorrect PIN. Please try again.");
        setIsVerifying(false);

        // Shake then auto-clear PIN after 500ms for swift re-entry
        setTimeout(() => {
          if (isMounted) {
            setPin("");
            setIsError(false);
          }
        }, 500);
      } else {
        triggerHaptic("success");
      }
    };

    check();

    return () => {
      isMounted = false;
    };
  }, [pin, isVerifying, verifyAndUnlock]);

  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "clear", "0", "backspace"
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        zIndex: 1
      }}
    >
      <AestheticRedLines />

      <div
        className={`anim-pop ${isError ? "anim-shake" : ""}`}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#ffffff",
          borderRadius: 28,
          padding: "36px 28px 32px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08), 0 2px 10px rgba(241, 77, 77, 0.04)",
          border: `1.2px solid ${CARD_BORDER_LIGHT}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        {/* Squircle Logo (Leader APK Brand Logo Container) */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background: "linear-gradient(135deg, #f14d4d 0%, #d63333 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 8px 24px rgba(241, 77, 77, 0.35)",
            marginBottom: 16
          }}
        >
          <Ic name="lock" size={26} color="#ffffff" />
        </div>

        {/* Title & Desk Subtitle */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: CORAL_PRIMARY,
            marginBottom: 4
          }}
        >
          FestFlow Digital Desk
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: TEXT_PRIMARY_LIGHT,
            letterSpacing: "-0.4px",
            marginBottom: 6
          }}
        >
          Operator Access
        </h1>
        <p
          style={{
            fontSize: 13,
            color: isError ? RED_DANGER : TEXT_MUTED_LIGHT,
            fontWeight: isError ? 600 : 400,
            minHeight: 20,
            transition: "color 0.2s ease"
          }}
        >
          {errorMessage || (isVerifying ? "Verifying..." : "Enter 4-digit security PIN")}
        </p>

        {/* 4-Digit PIN Indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            margin: "24px 0 28px"
          }}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: isError
                    ? `2px solid ${RED_DANGER}`
                    : isFilled
                    ? `2px solid ${CORAL_PRIMARY}`
                    : "2px solid #cbd5e1",
                  background: isError
                    ? RED_DANGER
                    : isFilled
                    ? "linear-gradient(135deg, #f14d4d 0%, #d63333 100%)"
                    : "#ffffff",
                  transform: isFilled ? "scale(1.15)" : "scale(1)",
                  boxShadow: isFilled
                    ? isError
                      ? "0 0 10px rgba(239, 68, 68, 0.5)"
                      : "0 0 10px rgba(241, 77, 77, 0.4)"
                    : "none",
                  transition: "all 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              />
            );
          })}
        </div>

        {/* Touch Keypad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            width: "100%",
            maxWidth: 290
          }}
        >
          {keys.map((k) => {
            if (k === "clear") {
              return (
                <button
                  key="clear"
                  onClick={handleClear}
                  className="pin-btn"
                  disabled={isVerifying || pin.length === 0}
                  style={{
                    height: 56,
                    borderRadius: 16,
                    border: "none",
                    background: "#f1f4f9",
                    color: TEXT_MUTED_LIGHT,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: pin.length > 0 ? "pointer" : "default",
                    opacity: pin.length > 0 ? 1 : 0.4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Clear PIN"
                >
                  CLEAR
                </button>
              );
            }

            if (k === "backspace") {
              return (
                <button
                  key="backspace"
                  onClick={handleBackspace}
                  className="pin-btn"
                  disabled={isVerifying || pin.length === 0}
                  style={{
                    height: 56,
                    borderRadius: 16,
                    border: "none",
                    background: "#f1f4f9",
                    color: TEXT_MUTED_LIGHT,
                    cursor: pin.length > 0 ? "pointer" : "default",
                    opacity: pin.length > 0 ? 1 : 0.4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Backspace"
                  aria-label="Backspace"
                >
                  <Ic name="backspace" size={20} color={TEXT_MUTED_LIGHT} />
                </button>
              );
            }

            return (
              <button
                key={k}
                onClick={() => handleDigit(k)}
                className="pin-btn"
                disabled={isVerifying || pin.length >= PIN_LENGTH}
                style={{
                  height: 56,
                  borderRadius: 16,
                  border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                  background: "#ffffff",
                  color: TEXT_PRIMARY_LIGHT,
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(15, 23, 42, 0.02)"
                }}
              >
                {k}
              </button>
            );
          })}
        </div>

        {/* Security badge note */}
        <div
          style={{
            marginTop: 22,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#94a3b8",
            fontSize: 11,
            fontWeight: 600
          }}
        >
          <Ic name="shield" size={13} color="#94a3b8" />
          <span>Protected terminal • Auto-locks in 30m idle</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
