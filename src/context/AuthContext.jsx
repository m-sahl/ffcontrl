import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

// Cryptographic SHA-256 hash (Never stores plain PIN in source code)
// Pre-computed SHA-256 hash for secure desk authentication
const DEFAULT_PIN_HASH = "158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab";
const TARGET_PIN_HASH = import.meta.env.VITE_DESK_PIN_HASH || DEFAULT_PIN_HASH;

// 30 Minutes inactivity timeout
const AUTO_LOCK_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_STORAGE_KEY = "ff_desk_session";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Compute SHA-256 using standard Web Cryptography API
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (session && session.authenticated) {
        const elapsed = Date.now() - (session.lastActive || 0);
        if (elapsed < AUTO_LOCK_TIMEOUT_MS) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  });

  const lastActiveRef = useRef(Date.now());
  const lockTimerRef = useRef(null);

  // Lock the desk terminal
  const lock = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setIsAuthenticated(false);
  }, []);

  // Update activity timestamp
  const recordActivity = useCallback(() => {
    if (!isAuthenticated) return;
    const now = Date.now();
    // Throttle writes to localStorage to once every 20 seconds
    if (now - lastActiveRef.current > 20000) {
      lastActiveRef.current = now;
      try {
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ authenticated: true, lastActive: now })
        );
      } catch {
        // ignore storage errors
      }
    }
  }, [isAuthenticated]);

  // Set up auto-lock timer based on 30 minutes of idle time
  useEffect(() => {
    if (!isAuthenticated) {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
      return;
    }

    // Check every 30 seconds if idle timeout exceeded
    lockTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActiveRef.current;
      if (elapsed >= AUTO_LOCK_TIMEOUT_MS) {
        lock();
      }
    }, 30000);

    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, [isAuthenticated, lock]);

  // Activity listeners to reset the idle timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleUserActivity = () => {
      lastActiveRef.current = Date.now();
      recordActivity();
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
    };
  }, [isAuthenticated, recordActivity]);

  // Validate the entered PIN against the SHA-256 hash
  const verifyAndUnlock = async (enteredPin) => {
    if (!enteredPin || typeof enteredPin !== "string") return false;
    try {
      const computedHash = await sha256(enteredPin.trim());
      if (computedHash.toLowerCase() === TARGET_PIN_HASH.toLowerCase()) {
        const now = Date.now();
        lastActiveRef.current = now;
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ authenticated: true, lastActive: now })
        );
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("PIN verification error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        verifyAndUnlock,
        lock
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
