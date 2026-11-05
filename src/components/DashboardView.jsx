import React from "react";
import Ic from "./common/Ic";
import { useDesk } from "../context/DeskContext";
import { triggerHaptic } from "../utils/haptics";
import {
  CORAL_PRIMARY,
  SAPPHIRE_BLUE,
  EMERALD_SUCCESS,
  AMBER_WARNING,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT,
  getCategoryColor
} from "../styles/DesignTokens";

const DashboardView = ({ onNavigateToEvents, onOpenCallList }) => {
  const {
    programs = [],
    students = {},
    registrations = [],
    activeStreams = {},
    getParticipantsForProgram
  } = useDesk();

  // Calculations matching Leader APK Dashboard metrics
  const totalStudents = Array.isArray(students)
    ? students.length
    : Object.values(students).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  const totalRegistrations = registrations.reduce(
    (sum, r) => sum + (r.participantIds?.length || 0),
    0
  );

  const stagePrograms = programs.filter(p => p.session === "Stage");
  const offStagePrograms = programs.filter(p => p.session === "Off-Stage");

  const runningProgramsList = programs.filter(p => (p.status || "").toLowerCase() === "running");
  const runningStageProg = runningProgramsList.find(p => p.session === "Stage");
  const runningOffStageProg = runningProgramsList.find(p => p.session === "Off-Stage");
  const hasLiveProgram = runningProgramsList.length > 0;
  const activeProgram = runningStageProg || runningOffStageProg || runningProgramsList[0];

  const runningStageCount = stagePrograms.filter(p => (p.status || "").toLowerCase() === "running" || (p.status || "").toLowerCase() === "completed").length;
  const runningOffStageCount = offStagePrograms.filter(p => (p.status || "").toLowerCase() === "running" || (p.status || "").toLowerCase() === "completed").length;

  // Real running programs first, followed by upcoming
  const activeAndCallingPrograms = runningProgramsList.length > 0
    ? runningProgramsList
    : programs.filter(p => (p.status || "").toLowerCase() === "upcoming" || !p.status).slice(0, 5);

  return (
    <div
      className="anim-fade"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "16px 16px 140px"
      }}
    >
      {/* Eyebrow & Page Title (Leader APK Style) */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: CORAL_PRIMARY,
            letterSpacing: "1.2px",
            textTransform: "uppercase"
          }}
        >
          CONTROL DESK
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: TEXT_PRIMARY_LIGHT,
            letterSpacing: "-0.6px",
            marginTop: 2
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Notifications / Live Call Up Card (Leader APK _buildNotificationsCard) */}
      <div
        onClick={() => {
          triggerHaptic("medium");
          if (activeProgram && onOpenCallList) {
            onOpenCallList(activeProgram);
          } else {
            onNavigateToEvents();
          }
        }}
        style={{
          width: "100%",
          padding: 16,
          background: "#ffffff",
          borderRadius: 20,
          border: `1.2px solid ${hasLiveProgram ? "rgba(241, 77, 77, 0.45)" : CARD_BORDER_LIGHT}`,
          boxShadow: hasLiveProgram
            ? "0 4px 16px rgba(241, 77, 77, 0.1)"
            : "0 2px 10px rgba(15, 23, 42, 0.03)",
          cursor: "pointer",
          marginBottom: 20,
          transition: "transform 0.15s ease, box-shadow 0.15s ease"
        }}
      >
        {/* Top Header Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "rgba(241, 77, 77, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: CORAL_PRIMARY
              }}
            >
              <Ic name="notifications" size={17} color={CORAL_PRIMARY} />
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: TEXT_PRIMARY_LIGHT,
                letterSpacing: "-0.2px"
              }}
            >
              Live Call Desk
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {hasLiveProgram ? (
              <span
                style={{
                  background: CORAL_PRIMARY,
                  color: "#ffffff",
                  fontSize: 9,
                  fontWeight: 800,
                  borderRadius: 6,
                  padding: "2px 6px",
                  letterSpacing: "0.4px"
                }}
              >
                LIVE
              </span>
            ) : (
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  color: EMERALD_SUCCESS,
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  fontSize: 9,
                  fontWeight: 800,
                  borderRadius: 6,
                  padding: "2px 6px",
                  letterSpacing: "0.4px"
                }}
              >
                READY
              </span>
            )}
            <Ic name="chevronRight" size={16} color={TEXT_MUTED_LIGHT} />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(226, 232, 240, 0.8)",
            margin: "12px 0"
          }}
        />

        {/* Vertical Coral Crimson Accent Bar + Preview Text */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 3.5,
              height: 38,
              borderRadius: 2,
              background: CORAL_PRIMARY,
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.4,
                fontWeight: 600,
                color: TEXT_PRIMARY_LIGHT
              }}
            >
              {hasLiveProgram ? (
                <>
                  Live: <strong>{activeProgram.name}</strong> on {activeProgram.session}
                  {runningProgramsList.length > 1 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: CORAL_PRIMARY, marginLeft: 6 }}>
                      (+{runningProgramsList.length - 1} more)
                    </span>
                  )}
                </>
              ) : (
                "Desk ready. Select upcoming events to call up participants on Stage or Off-Stage."
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: TEXT_MUTED_LIGHT,
                marginTop: 2
              }}
            >
              {hasLiveProgram ? "Tap to open Call Sheet & Attendance Desk" : "Convex live synchronization connected"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section Header */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: TEXT_PRIMARY_LIGHT,
          letterSpacing: "-0.3px",
          marginBottom: 12
        }}
      >
        Quick Access
      </div>

      {/* 2x2 Metric Grid (Leader APK HomeTab Layout) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 24
        }}
      >
        {/* Top-Left: Registered Entries */}
        <div
          onClick={() => {
            triggerHaptic("light");
            onNavigateToEvents();
          }}
          style={{
            height: 114,
            padding: 16,
            background: "#ffffff",
            borderRadius: 18,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(37, 99, 235, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: SAPPHIRE_BLUE
              }}
            >
              <Ic name="people" size={20} color={SAPPHIRE_BLUE} />
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: TEXT_PRIMARY_LIGHT,
                letterSpacing: "-0.5px"
              }}
            >
              {totalRegistrations || totalStudents}
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: TEXT_PRIMARY_LIGHT,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Registered Entries
          </div>
        </div>

        {/* Top-Right: Total Programs */}
        <div
          onClick={() => {
            triggerHaptic("light");
            onNavigateToEvents();
          }}
          style={{
            height: 114,
            padding: 16,
            background: "#ffffff",
            borderRadius: 18,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(241, 77, 77, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: CORAL_PRIMARY
              }}
            >
              <Ic name="layers" size={20} color={CORAL_PRIMARY} />
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: TEXT_PRIMARY_LIGHT,
                letterSpacing: "-0.5px"
              }}
            >
              {programs.length}
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: TEXT_PRIMARY_LIGHT,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Total Programs
          </div>
        </div>

        {/* Bottom-Left: Stage Events */}
        <div
          onClick={() => {
            triggerHaptic("light");
            onNavigateToEvents();
          }}
          style={{
            height: 114,
            padding: 16,
            background: "#ffffff",
            borderRadius: 18,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: TEXT_PRIMARY_LIGHT,
                letterSpacing: "-0.5px"
              }}
            >
              {runningStageCount}/{stagePrograms.length}
            </div>
            <span
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: EMERALD_SUCCESS,
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 7px",
                borderRadius: 999
              }}
            >
              Open
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: TEXT_PRIMARY_LIGHT
            }}
          >
            Stage events
          </div>
        </div>

        {/* Bottom-Right: Non-Stage Events */}
        <div
          onClick={() => {
            triggerHaptic("light");
            onNavigateToEvents();
          }}
          style={{
            height: 114,
            padding: 16,
            background: "#ffffff",
            borderRadius: 18,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: TEXT_PRIMARY_LIGHT,
                letterSpacing: "-0.5px"
              }}
            >
              {runningOffStageCount}/{offStagePrograms.length}
            </div>
            <span
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: EMERALD_SUCCESS,
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 7px",
                borderRadius: 999
              }}
            >
              Open
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: TEXT_PRIMARY_LIGHT
            }}
          >
            Non-stage
          </div>
        </div>
      </div>

      {/* Entered / Active Programs Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: TEXT_PRIMARY_LIGHT,
              letterSpacing: "-0.3px"
            }}
          >
            Program Roster
          </span>
          <span
            style={{
              background: "rgba(241, 77, 77, 0.08)",
              color: CORAL_PRIMARY,
              padding: "2px 7px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800
            }}
          >
            {programs.length}
          </span>
        </div>

        <button
          onClick={() => {
            triggerHaptic("light");
            onNavigateToEvents();
          }}
          style={{
            background: "none",
            border: "none",
            color: CORAL_PRIMARY,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >
          View All →
        </button>
      </div>

      {/* Program Cards List (Leader APK _buildEnteredEventCard layout) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeAndCallingPrograms.length === 0 ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: "#ffffff",
              borderRadius: 16,
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              color: TEXT_MUTED_LIGHT,
              fontSize: 13
            }}
          >
            No programs found. Visit Events to manage.
          </div>
        ) : (
          activeAndCallingPrograms.map((prog) => {
            const participants = getParticipantsForProgram(prog.id);
            const catColor = getCategoryColor(prog.category);
            const isRunning = (prog.status || "").toLowerCase() === "running";
            const isStreaming = isRunning;

            return (
              <div
                key={prog.id}
                onClick={() => {
                  triggerHaptic("medium");
                  if (onOpenCallList) {
                    onOpenCallList(prog);
                  } else {
                    onNavigateToEvents();
                  }
                }}
                style={{
                  padding: "12px 14px",
                  background: "#ffffff",
                  borderRadius: 16,
                  border: `1px solid ${isStreaming ? "rgba(241, 77, 77, 0.35)" : CARD_BORDER_LIGHT}`,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Category Squircle Icon */}
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
                      name={prog.session === "Stage" ? "theater" : "palette"}
                      size={18}
                      color={catColor}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: TEXT_PRIMARY_LIGHT,
                        lineHeight: 1.2
                      }}
                    >
                      {prog.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: TEXT_MUTED_LIGHT,
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <span style={{ color: catColor, fontWeight: 700 }}>{prog.category}</span>
                      <span>•</span>
                      <span>{prog.session}</span>
                      <span>•</span>
                      <span>{participants.length} Entries</span>
                    </div>
                  </div>
                </div>

                {/* Trailing Status Pill */}
                {isStreaming ? (
                  <span
                    style={{
                      background: "rgba(241, 77, 77, 0.08)",
                      color: CORAL_PRIMARY,
                      border: "1px solid rgba(241, 77, 77, 0.25)",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 9px",
                      borderRadius: 999
                    }}
                  >
                    Calling Up
                  </span>
                ) : isRunning ? (
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      color: EMERALD_SUCCESS,
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 9px",
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <span className="blink-indicator" style={{ background: EMERALD_SUCCESS }} />
                    Running
                  </span>
                ) : (
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      color: EMERALD_SUCCESS,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 9px",
                      borderRadius: 999
                    }}
                  >
                    {participants.length} Entered
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardView;
