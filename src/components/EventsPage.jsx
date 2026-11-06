import React, { useState, useEffect } from "react";
import Ic from "./common/Ic";
import StreamModal from "./StreamModal";
import EndProgramModal from "./EndProgramModal";
import ProgramDetailsModal from "./ProgramDetailsModal";
import { useDesk } from "../context/DeskContext";
import { triggerHaptic } from "../utils/haptics";
import {
  CORAL_PRIMARY,
  EMERALD_SUCCESS,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT,
  CATEGORIES,
  SESSIONS,
  getCategoryColor,
  normalizeCategory
} from "../styles/DesignTokens";

const EventsPage = ({
  programs = [],
  activeStreamId,
  activeStreams,
  selectedSession: propSelectedSession,
  onSelectSession,
  activeTab: propActiveTab,
  onSelectTab,
  initialTab = null,
  getParticipantsForProgram,
  onStreamProgram,
  onOpenCallList,
  onOpenAttendance,
  onOpenCodeLetter,
  onMarkCompleted
}) => {
  const {
    updateAttendance,
    batchAttendance,
    assignCodeLetter,
    resetCodeLetters,
    saveProgramRoster,
    reopenProgram
  } = useDesk();

  const [internalSession, setInternalSession] = useState("Stage");
  const selectedSession = propSelectedSession !== undefined ? propSelectedSession : internalSession;
  const setSelectedSession = (sess) => {
    if (onSelectSession) onSelectSession(sess);
    setInternalSession(sess);
  };

  const [internalActiveTab, setInternalActiveTab] = useState(initialTab);
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;
  const setActiveTab = (tab) => {
    if (onSelectTab) onSelectTab(tab);
    setInternalActiveTab(tab);
  };
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [streamModalProg, setStreamModalProg] = useState(null);
  const [confirmEndProg, setConfirmEndProg] = useState(null);
  const [selectedDetailsProg, setSelectedDetailsProg] = useState(null);

  const handleOpenStreamModal = (prog) => {
    triggerHaptic("medium");
    setStreamModalProg(prog);
    try {
      window.history.pushState({ modal: "stream-modal" }, "");
    } catch {}
  };
  const handleCloseStreamModal = () => {
    triggerHaptic("light");
    if (window.history.state?.modal === "stream-modal") {
      window.history.back();
    } else {
      setStreamModalProg(null);
    }
  };

  const handleOpenConfirmEnd = (prog) => {
    triggerHaptic("medium");
    setConfirmEndProg(prog);
    try {
      window.history.pushState({ modal: "confirm-end" }, "");
    } catch {}
  };
  const handleCloseConfirmEnd = () => {
    triggerHaptic("light");
    if (window.history.state?.modal === "confirm-end") {
      window.history.back();
    } else {
      setConfirmEndProg(null);
    }
  };

  const handleOpenDetails = (prog) => {
    triggerHaptic("medium");
    setSelectedDetailsProg(prog);
    try {
      window.history.pushState({ modal: "program-details" }, "");
    } catch {}
  };
  const handleCloseDetails = () => {
    triggerHaptic("light");
    if (window.history.state?.modal === "program-details") {
      window.history.back();
    } else {
      setSelectedDetailsProg(null);
    }
  };

  useEffect(() => {
    const onPop = () => {
      if (streamModalProg) setStreamModalProg(null);
      if (confirmEndProg) setConfirmEndProg(null);
      if (selectedDetailsProg) setSelectedDetailsProg(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [streamModalProg, confirmEndProg, selectedDetailsProg]);

  // Status sort priority: Upcoming (top) -> Running (middle/first) -> Finished/Completed (down)
  const getProgramStatusOrder = (p) => {
    const s = (p.status || "").toLowerCase();
    const isCompleted = s === "completed" || s === "published" || s === "finished";
    const isRunning = s === "running";
    if (isCompleted) return 2; // Finished down of list
    if (isRunning) return 1;   // Running in the middle
    return 0;                  // Upcoming in the top
  };

  // All programs in the selected session (Stage / Off-Stage), ordered by status priority
  const sessionPrograms = programs
    .filter(p => p.session === selectedSession)
    .sort((a, b) => getProgramStatusOrder(a) - getProgramStatusOrder(b));

  // Status-specific lists
  const upcomingPrograms = sessionPrograms.filter(p => p.status === "Upcoming" || !p.status);
  const runningPrograms = sessionPrograms.filter(p => p.status === "Running");
  const completedPrograms = sessionPrograms.filter(p => p.status === "Completed" || p.status === "published");
  const completedAndRunning = sessionPrograms.filter(p => p.status === "Running" || p.status === "Completed" || p.status === "published");

  // Determine current active list based on activeTab
  const currentTabBaseList = activeTab === "all"
    ? sessionPrograms
    : activeTab === "completed"
    ? completedAndRunning
    : upcomingPrograms;

  // Category counts for the current tab
  const getCategoryCount = (list, cat) => {
    if (cat === "All") return list.length;
    return list.filter(p => (normalizeCategory(p.category) || "General") === cat).length;
  };

  // Filter helper for any list
  const filterList = (list) => {
    return list.filter(p => {
      // 1. Category Filter
      if (selectedCategory !== "All") {
        const pCat = normalizeCategory(p.category) || "General";
        if (pCat !== selectedCategory) {
          return false;
        }
      }
      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchCat = (normalizeCategory(p.category) || p.category || "").toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      return true;
    });
  };

  const filteredAllPrograms = filterList(sessionPrograms);
  const filteredUpcomingPrograms = filterList(upcomingPrograms);
  const filteredCompletedPrograms = filterList(completedAndRunning);

  // Only genuine running programs from the database/API in the current session are shown in the active banner
  const activeBannerPrograms = sessionPrograms.filter(
    p => (p.status || "").toLowerCase() === "running"
  );

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // 3-second carousel rotation when more than 1 program is running in the current session
  useEffect(() => {
    if (activeTab === "completed" || activeBannerPrograms.length <= 1) {
      setCurrentBannerIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % activeBannerPrograms.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedSession, activeTab, activeBannerPrograms.length]);

  const safeIndex = currentBannerIndex < activeBannerPrograms.length ? currentBannerIndex : 0;
  const currentBannerProg = activeBannerPrograms[safeIndex];
  const isCallingUp = false;

  const handleSelectUpcoming = (prog) => {
    triggerHaptic("medium");
    handleOpenStreamModal(prog);
  };

  // Distinct main categories matching updated base URL (Low, Mid, High, General)
  const categoryOrder = ["Low", "Mid", "High", "General"];

  const offStageRunningCount = programs.filter(
    p => p.session === "Off-Stage" && (p.status || "").toLowerCase() === "running"
  ).length;

  return (
    <div
      className="anim-fade"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "16px 16px 140px"
      }}
    >
      {/* Stage Session Opening Soon View vs Off-Stage Active Session */}
      {selectedSession === "Stage" ? (
        /* Stage Session Opening Soon View — Stage is not started yet, shows Opening Soon message + Navigator into Off-Stage */
        <div
          className="anim-fade"
          style={{
            margin: "20px 0 32px",
            padding: "48px 24px 40px",
            background: "#ffffff",
            borderRadius: 24,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Theater Clock Squircle Icon */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "linear-gradient(135deg, rgba(241, 77, 77, 0.12) 0%, rgba(241, 77, 77, 0.04) 100%)",
              border: "1.5px solid rgba(241, 77, 77, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CORAL_PRIMARY,
              marginBottom: 20,
              boxShadow: "0 8px 22px rgba(241, 77, 77, 0.15)"
            }}
          >
            <Ic name="clock" size={36} color={CORAL_PRIMARY} />
          </div>

          {/* Pill Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(241, 77, 77, 0.08)",
              border: "1px solid rgba(241, 77, 77, 0.2)",
              padding: "4px 14px",
              borderRadius: 999,
              color: CORAL_PRIMARY,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: 14
            }}
          >
            STAGE SESSION
          </div>

          {/* Main Title */}
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: TEXT_PRIMARY_LIGHT,
              letterSpacing: "-0.6px",
              margin: "0 0 10px",
              lineHeight: 1.2
            }}
          >
            Opening Soon
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 14,
              color: TEXT_MUTED_LIGHT,
              lineHeight: 1.55,
              maxWidth: 360,
              margin: "0 auto 24px"
            }}
          >
            Stage programs have not started yet. The off-stage competitions are actively live right now.
          </p>

          {/* Live indicator if off-stage competitions are running */}
          {offStageRunningCount > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                padding: "8px 16px",
                borderRadius: 14,
                color: "#065f46",
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 24
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <span><strong>{offStageRunningCount} Off-Stage Competitions</strong> currently running live</span>
            </div>
          )}

          {/* Dedicated Navigator Button into Off-Stage Page */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              setSelectedSession("Off-Stage");
            }}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "14px 22px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #f14d4d 0%, #dc2626 100%)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "-0.2px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 6px 20px rgba(241, 77, 77, 0.35)",
              transition: "transform 0.15s ease"
            }}
          >
            <Ic name="palette" size={18} color="#ffffff" />
            <span>Go to Off-Stage Desk</span>
            <Ic name="chevronRight" size={16} color="#ffffff" />
          </button>
        </div>
      ) : (
        <>
          {/* Animated Session Switch Wrapper */}
          <div key={selectedSession} className="anim-session-switch">
        
        {/* Active Running Banner — Hidden on Completed & Running page where active events are already listed */}
        {activeTab !== "completed" && currentBannerProg && (
          <div
            onClick={() => {
              triggerHaptic("medium");
              setActiveTab("completed");
            }}
            style={{
              background: "#ffffff",
              borderRadius: 18,
              border: `1.2px solid ${CARD_BORDER_LIGHT}`,
              borderLeft: `4px solid ${CORAL_PRIMARY}`,
              padding: "16px 18px",
              marginBottom: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 16px rgba(241, 77, 77, 0.08)",
              transition: "transform 0.15s ease",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              key={`${currentBannerProg.id}-${safeIndex}`}
              className="banner-carousel-slide"
              style={{ flex: 1, minWidth: 0, paddingRight: 10 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  className="badge badge-coral"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.5px",
                    display: "inline-flex",
                    alignItems: "center"
                  }}
                >
                  <span className="blink-indicator" style={{ background: "#ffffff", marginRight: 4, width: 6, height: 6 }} />
                  {`LIVE ON ${currentBannerProg.session.toUpperCase()}`}
                </span>

                {activeBannerPrograms.length > 1 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: TEXT_MUTED_LIGHT,
                      background: "#f1f5f9",
                      padding: "2px 7px",
                      borderRadius: 10
                    }}
                  >
                    {safeIndex + 1} of {activeBannerPrograms.length}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: TEXT_PRIMARY_LIGHT,
                  letterSpacing: "-0.2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {currentBannerProg.name}
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED_LIGHT, marginTop: 2 }}>
                {currentBannerProg.category} • Tap to view completed & running
              </div>
            </div>

            {/* Carousel progress dots on the right (arrow mark removed) */}
            {activeBannerPrograms.length > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 10px",
                  borderRadius: 20,
                  background: "#f8fafc",
                  border: `1px solid ${CARD_BORDER_LIGHT}`,
                  flexShrink: 0
                }}
              >
                {activeBannerPrograms.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === safeIndex ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === safeIndex ? CORAL_PRIMARY : "#cbd5e1",
                      transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MAIN EVENTS HUB VIEW */}
        {!activeTab && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Card 1: All Programs */}
            <button className="mobile-nav-btn" onClick={() => {
              triggerHaptic("medium");
              setActiveTab("all");
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    background: "#f1f4f9",
                    border: `1px solid ${CARD_BORDER_LIGHT}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#334155"
                  }}
                >
                  <Ic name="layers" size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY_LIGHT, letterSpacing: "-0.2px" }}>
                    All Programs
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED_LIGHT, fontWeight: 500, marginTop: 2 }}>
                    {sessionPrograms.length} programs in {selectedSession} (All Categories)
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="badge badge-slate" style={{ fontSize: 11 }}>
                  {sessionPrograms.length}
                </span>
                <Ic name="chevronRight" size={18} color="#94a3b8" />
              </div>
            </button>

            {/* Card 2: Upcoming Programs */}
            <button className="mobile-nav-btn" onClick={() => {
              triggerHaptic("medium");
              setActiveTab("upcoming");
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    background: "rgba(241, 77, 77, 0.08)",
                    border: "1px solid rgba(241, 77, 77, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: CORAL_PRIMARY
                  }}
                >
                  <Ic name="clock" size={20} color={CORAL_PRIMARY} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY_LIGHT, letterSpacing: "-0.2px" }}>
                    Upcoming Programs
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED_LIGHT, fontWeight: 500, marginTop: 2 }}>
                    {upcomingPrograms.length} pending to call up across all categories
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="badge badge-coral" style={{ fontSize: 11 }}>
                  {upcomingPrograms.length}
                </span>
                <Ic name="chevronRight" size={18} color="#94a3b8" />
              </div>
            </button>

            {/* Card 3: Completed & Running Programs */}
            <button className="mobile-nav-btn" onClick={() => {
              triggerHaptic("medium");
              setActiveTab("completed");
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: EMERALD_SUCCESS
                  }}
                >
                  <Ic name="checkCircle" size={20} color={EMERALD_SUCCESS} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY_LIGHT, letterSpacing: "-0.2px" }}>
                    Completed & Running
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED_LIGHT, fontWeight: 500, marginTop: 2 }}>
                    {runningPrograms.length} running • {completedPrograms.length} finished
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="badge badge-emerald" style={{ fontSize: 11 }}>
                  {runningPrograms.length + completedPrograms.length}
                </span>
                <Ic name="chevronRight" size={18} color="#94a3b8" />
              </div>
            </button>
          </div>
        )}

        {/* SUB-PAGES (All, Upcoming, Completed) */}
        {activeTab && (
          <div>
            {/* Sub-page top navigation bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14
              }}
            >
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setActiveTab(null);
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${CARD_BORDER_LIGHT}`,
                  color: TEXT_PRIMARY_LIGHT,
                  borderRadius: 10,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)"
                }}
              >
                <Ic name="back" size={14} /> Back
              </button>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: TEXT_PRIMARY_LIGHT,
                  letterSpacing: "-0.2px"
                }}
              >
                {activeTab === "all"
                  ? "All Programs"
                  : activeTab === "completed"
                  ? "Completed & Running"
                  : "Upcoming"}
              </div>
            </div>

            {/* Leader APK Search Box */}
            <div
              style={{
                position: "relative",
                marginBottom: 12
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#94a3b8"
                }}
              >
                <Ic name="search" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events across all categories..."
                style={{
                  width: "100%",
                  height: 46,
                  background: "#ffffff",
                  borderRadius: 16,
                  border: `1.4px solid ${CARD_BORDER_LIGHT}`,
                  padding: "0 40px 0 42px",
                  fontSize: 14,
                  color: TEXT_PRIMARY_LIGHT,
                  outline: "none",
                  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.02)",
                  transition: "border-color 0.15s ease"
                }}
                onFocus={(e) => (e.target.style.borderColor = CORAL_PRIMARY)}
                onBlur={(e) => (e.target.style.borderColor = CARD_BORDER_LIGHT)}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setSearchQuery("");
                  }}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#f1f4f9",
                    border: "none",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: TEXT_MUTED_LIGHT,
                    cursor: "pointer"
                  }}
                >
                  <Ic name="x" size={12} />
                </button>
              )}
            </div>

            {/* CATEGORY FILTER PILLS ROW — Always Available on All Sub-Pages (Upcoming, All, Completed) */}
            <div
              className="no-scrollbar"
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                paddingBottom: 2
              }}
            >
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                const count = getCategoryCount(currentTabBaseList, cat);
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      triggerHaptic("light");
                      setSelectedCategory(cat);
                    }}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 999,
                      background: isSelected ? CORAL_PRIMARY : "#ffffff",
                      color: isSelected ? "#ffffff" : "#475569",
                      fontWeight: 700,
                      fontSize: 12,
                      border: isSelected ? `1px solid ${CORAL_PRIMARY}` : `1px solid ${CARD_BORDER_LIGHT}`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      boxShadow: isSelected
                        ? "0 2px 8px rgba(241, 77, 77, 0.25)"
                        : "0 1px 3px rgba(0, 0, 0, 0.03)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      style={{
                        background: isSelected ? "rgba(255, 255, 255, 0.25)" : "#f1f4f9",
                        color: isSelected ? "#ffffff" : TEXT_MUTED_LIGHT,
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "1px 6px",
                        borderRadius: 999
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ALL PROGRAMS */}
            {activeTab === "all" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredAllPrograms.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "36px 16px",
                      background: "#ffffff",
                      borderRadius: 18,
                      border: `1px solid ${CARD_BORDER_LIGHT}`,
                      color: TEXT_MUTED_LIGHT,
                      fontSize: 13
                    }}
                  >
                    No programs found matching filters in {selectedSession}
                  </div>
                ) : (
                  filteredAllPrograms.map((p) => {
                    const participants = getParticipantsForProgram(p.id);
                    const catColor = getCategoryColor(p.category);
                    const isRunning = (p.status || "").toLowerCase() === "running";
                    const isCompleted = (p.status || "").toLowerCase() === "completed" || (p.status || "").toLowerCase() === "published";
                    const isLive = isRunning;

                    return (
                      <div
                        key={p.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 18,
                          background: "#ffffff",
                          border: `1px solid ${isLive ? "rgba(241, 77, 77, 0.35)" : CARD_BORDER_LIGHT}`,
                          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: `${catColor}14`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: catColor,
                              flexShrink: 0
                            }}
                          >
                            <Ic
                              name={p.session === "Stage" ? "theater" : "palette"}
                              size={18}
                              color={catColor}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: TEXT_PRIMARY_LIGHT,
                                letterSpacing: "-0.2px"
                              }}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: TEXT_MUTED_LIGHT,
                                marginTop: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                              }}
                            >
                              <span style={{ color: catColor, fontWeight: 700 }}>{p.category}</span>
                              <span>•</span>
                              <span>{participants.length} Entries</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isRunning ? (
                            <span className="badge badge-emerald">Running</span>
                          ) : isCompleted ? (
                            <span className="badge badge-slate">Finished</span>
                          ) : (
                            <span className="badge badge-coral">Upcoming</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: UPCOMING PROGRAMS (Supports All Categories: Sub-Junior, Junior, Senior, General) */}
            {activeTab === "upcoming" && (
              <div>
                {filteredUpcomingPrograms.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "36px 16px",
                      background: "#ffffff",
                      borderRadius: 18,
                      border: `1px solid ${CARD_BORDER_LIGHT}`,
                      color: TEXT_MUTED_LIGHT,
                      fontSize: 13
                    }}
                  >
                    No upcoming programs found in {selectedCategory === "All" ? selectedSession : `${selectedCategory} (${selectedSession})`}
                  </div>
                ) : selectedCategory === "All" && !searchQuery.trim() ? (
                  // Grouped by Category when "All" is active so all categories are immediately visible
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {categoryOrder.map(cat => {
                      const catProgs = filteredUpcomingPrograms.filter(
                        p => (normalizeCategory(p.category) || "General") === cat
                      );
                      if (catProgs.length === 0) return null;
                      const catColor = getCategoryColor(cat);

                      return (
                        <div key={cat}>
                          {/* Category Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "4px 4px 8px 4px"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: catColor
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: TEXT_PRIMARY_LIGHT,
                                  letterSpacing: "-0.2px"
                                }}
                              >
                                {cat}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  color: catColor,
                                  background: `${catColor}14`,
                                  padding: "2px 7px",
                                  borderRadius: 999
                                }}
                              >
                                {catProgs.length} Upcoming
                              </span>
                            </div>
                          </div>

                          {/* Category Program Cards */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {catProgs.map(p => {
                              const participants = getParticipantsForProgram(p.id);
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => handleSelectUpcoming(p)}
                                  style={{
                                    padding: "14px 16px",
                                    borderRadius: 18,
                                    background: "#ffffff",
                                    border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                                    transition: "all 0.15s ease"
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div
                                      style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: `${catColor}14`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: catColor,
                                        flexShrink: 0
                                      }}
                                    >
                                      <Ic
                                        name={p.session === "Stage" ? "theater" : "palette"}
                                        size={18}
                                        color={catColor}
                                      />
                                    </div>
                                    <div>
                                      <div
                                        style={{
                                          fontSize: 15,
                                          fontWeight: 700,
                                          color: TEXT_PRIMARY_LIGHT,
                                          letterSpacing: "-0.2px"
                                        }}
                                      >
                                        {p.name}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: TEXT_MUTED_LIGHT,
                                          marginTop: 2,
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 6
                                        }}
                                      >
                                        <span style={{ color: catColor, fontWeight: 700 }}>{p.category}</span>
                                        <span>•</span>
                                        <span>{participants.length} Entries</span>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectUpcoming(p);
                                    }}
                                    style={{
                                      background: CORAL_PRIMARY,
                                      color: "#ffffff",
                                      fontWeight: 700,
                                      fontSize: 12,
                                      padding: "7px 15px",
                                      borderRadius: 999,
                                      border: "none",
                                      cursor: "pointer",
                                      boxShadow: "0 2px 8px rgba(241, 77, 77, 0.25)",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4
                                    }}
                                  >
                                    Call Up <Ic name="play" size={11} color="#ffffff" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Filtered by specific category or search query
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredUpcomingPrograms.map(p => {
                      const participants = getParticipantsForProgram(p.id);
                      const catColor = getCategoryColor(p.category);

                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelectUpcoming(p)}
                          style={{
                            padding: "14px 16px",
                            borderRadius: 18,
                            background: "#ffffff",
                            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: `${catColor}14`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: catColor,
                                flexShrink: 0
                              }}
                            >
                              <Ic
                                name={p.session === "Stage" ? "theater" : "palette"}
                                size={18}
                                color={catColor}
                              />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: TEXT_PRIMARY_LIGHT,
                                  letterSpacing: "-0.2px"
                                }}
                              >
                                {p.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: TEXT_MUTED_LIGHT,
                                  marginTop: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6
                                }}
                              >
                                <span style={{ color: catColor, fontWeight: 700 }}>{p.category}</span>
                                <span>•</span>
                                <span>{participants.length} Entries</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectUpcoming(p);
                            }}
                            style={{
                              background: CORAL_PRIMARY,
                              color: "#ffffff",
                              fontWeight: 700,
                              fontSize: 12,
                              padding: "7px 15px",
                              borderRadius: 999,
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 2px 8px rgba(241, 77, 77, 0.25)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            Call Up <Ic name="play" size={11} color="#ffffff" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: COMPLETED & RUNNING */}
            {activeTab === "completed" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredCompletedPrograms.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "36px 16px",
                      background: "#ffffff",
                      borderRadius: 18,
                      border: `1px solid ${CARD_BORDER_LIGHT}`,
                      color: TEXT_MUTED_LIGHT,
                      fontSize: 13
                    }}
                  >
                    No running or completed programs in {selectedCategory === "All" ? selectedSession : `${selectedCategory} (${selectedSession})`}
                  </div>
                ) : (
                  filteredCompletedPrograms.map(p => {
                    const participants = getParticipantsForProgram(p.id);
                    const catColor = getCategoryColor(p.category);
                    const isRunning = p.status === "Running";
                    const participatingCount = participants.filter(st => st.isPresent).length;

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleOpenDetails(p)}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 18,
                          background: "#ffffff",
                          border: `1.2px solid ${isRunning ? "rgba(16, 185, 129, 0.35)" : CARD_BORDER_LIGHT}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          opacity: isRunning ? 1 : 0.95
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: isRunning ? "rgba(16, 185, 129, 0.1)" : "#f1f4f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isRunning ? EMERALD_SUCCESS : TEXT_MUTED_LIGHT,
                              flexShrink: 0
                            }}
                          >
                            <Ic name={isRunning ? "play" : "check"} size={18} color={isRunning ? EMERALD_SUCCESS : TEXT_MUTED_LIGHT} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: TEXT_PRIMARY_LIGHT,
                                letterSpacing: "-0.2px"
                              }}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: isRunning ? EMERALD_SUCCESS : TEXT_MUTED_LIGHT,
                                fontWeight: isRunning ? 700 : 500,
                                marginTop: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                              }}
                            >
                              <span style={{ color: catColor, fontWeight: 700 }}>{p.category}</span>
                              <span style={{ color: "#94a3b8" }}>–</span>
                              {isRunning ? (
                                <span>Running ({participatingCount} participating)</span>
                              ) : (
                                <span>Completed ({participatingCount} participating)</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isRunning ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenConfirmEnd(p);
                              }}
                              style={{
                                background: "rgba(16, 185, 129, 0.1)",
                                color: "#065f46",
                                fontWeight: 800,
                                fontSize: 12,
                                padding: "7px 14px",
                                borderRadius: 10,
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              <Ic name="checkCircle" size={13} color="#065f46" /> End
                            </button>
                            <Ic name="chevronRight" size={16} color="#94a3b8" />
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="badge badge-slate">Finished</span>
                            <Ic name="chevronRight" size={16} color="#94a3b8" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )}

      {/* Stream Call Up Modal */}
      <StreamModal
        program={streamModalProg}
        participantsCount={streamModalProg ? getParticipantsForProgram(streamModalProg.id).length : 0}
        isOpen={!!streamModalProg}
        onClose={handleCloseStreamModal}
        onStream={() => {
          if (streamModalProg) {
            const prog = streamModalProg;
            setStreamModalProg(null);
            onStreamProgram(prog.id);
            if (prog.session === "Off-Stage") {
              if (onOpenAttendance) {
                onOpenAttendance(prog);
              } else if (onOpenCallList) {
                onOpenCallList(prog);
              }
            } else {
              if (onOpenCallList) {
                onOpenCallList(prog);
              } else if (onOpenAttendance) {
                onOpenAttendance(prog);
              }
            }
          }
        }}
      />

      {/* End Program Confirmation Popup Modal */}
      <EndProgramModal
        program={confirmEndProg}
        isOpen={!!confirmEndProg}
        onClose={handleCloseConfirmEnd}
        onConfirm={onMarkCompleted}
      />

      {/* Program Attendance & Code Letters Details Modal (Late Entry) */}
      <ProgramDetailsModal
        program={programs.find(p => p.id === selectedDetailsProg?.id) || selectedDetailsProg}
        isOpen={!!selectedDetailsProg}
        onClose={handleCloseDetails}
        participants={selectedDetailsProg ? getParticipantsForProgram(selectedDetailsProg.id) : []}
        onUpdateAttendance={updateAttendance}
        onAssignCodeLetter={assignCodeLetter}
        onSaveRoster={saveProgramRoster}
        onReopenProgram={reopenProgram}
      />
    </div>
  );
};

export default EventsPage;
