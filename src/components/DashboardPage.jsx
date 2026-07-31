import React, { useState } from "react";
import Ic from "./common/Ic";
import StreamModal from "./StreamModal";
import ExcelImportModal from "./ExcelImportModal";
import EndProgramModal from "./EndProgramModal";
import { CORAL_PRIMARY, EMERALD_SUCCESS, CATEGORIES, SESSIONS, SCHEDULE_DATES } from "../styles/DesignTokens";

const DashboardPage = ({
  programs,
  activeStreamId,
  activeStreams,
  initialTab = null,
  getParticipantsForProgram,
  onStreamProgram,
  onOpenCallList,
  onMarkCompleted,
  onImportSchedule,
  onResetTrialData,
  onOpenScheduleManager,
  onOpenResults
}) => {
  const [selectedSession, setSelectedSession] = useState("Stage");
  const [selectedDate, setSelectedDate] = useState("Day 1");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [streamModalProg, setStreamModalProg] = useState(null);
  const [confirmEndProg, setConfirmEndProg] = useState(null);
  const [isExcelOpen, setIsExcelOpen] = useState(false);

  const sessionPrograms = programs.filter(p => p.session === selectedSession);
  
  const categoryPrograms = sessionPrograms.filter(p =>
    selectedCategory === "All" ? true : p.category === selectedCategory
  );

  const upcomingPrograms = sessionPrograms.filter(p => p.status === "Upcoming" || !p.status);
  const runningPrograms = sessionPrograms.filter(p => p.status === "Running");
  const completedPrograms = sessionPrograms.filter(p => p.status === "Completed");

  const activeStreamIdForSession = activeStreams ? activeStreams[selectedSession] : activeStreamId;
  const activeStreamProg = programs.find(p => p.id === activeStreamIdForSession && p.session === selectedSession);

  const handleSelectUpcoming = (prog) => {
    setStreamModalProg(prog);
  };

  return (
    <div className="anim-fade" style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px 80px" }}>
      
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.2px", color: CORAL_PRIMARY }}>
          Digital Desk
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
          FestFlow Control
        </h1>
      </div>

      {/* Prominent Big Full-Width Stage / Off-Stage Toggle */}
      <div style={{
        display: "flex",
        background: "#ffffff",
        padding: 5,
        borderRadius: 16,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
        marginBottom: 20
      }}>
        {SESSIONS.map(sess => {
          const isActive = selectedSession === sess;
          return (
            <button
              key={sess}
              onClick={() => setSelectedSession(sess)}
              className={isActive ? "anim-pop" : ""}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 12,
                border: "none",
                background: isActive ? CORAL_PRIMARY : "transparent",
                color: isActive ? "#ffffff" : "#64748b",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 4px 14px rgba(241, 77, 77, 0.28)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isActive && <span className="blink-indicator" />}
              {sess}
            </button>
          );
        })}
      </div>

      {/* SESSION SWITCH ANIMATED PAGE CONTAINER */}
      <div key={selectedSession} className="anim-session-switch">
        {/* Active Call Up Banner */}
        {activeStreamProg && (
        <div
          onClick={() => onOpenCallList(activeStreamProg)}
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 16px rgba(241, 77, 77, 0.12)"
          }}
        >
          <div>
            <span className="badge badge-coral" style={{ marginBottom: 4 }}>
              CALLING UP ON {selectedSession.toUpperCase()}
            </span>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{activeStreamProg.name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {activeStreamProg.category} · Tap to view call sheet
            </div>
          </div>
          <Ic name="arrowRight" size={18} color={CORAL_PRIMARY} />
        </div>
      )}

      {/* MAIN HOME VIEW */}
      {!activeTab && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          
          {/* Button 1: Schedule */}
          <button className="mobile-nav-btn" onClick={() => setActiveTab("schedule")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#334155"
              }}>
                <Ic name="calendar" size={18} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Schedule</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 1 }}>{sessionPrograms.length} programs order</div>
              </div>
            </div>
            <Ic name="chevronRight" size={18} color="#94a3b8" />
          </button>

          {/* Button 2: All Programs */}
          <button className="mobile-nav-btn" onClick={() => setActiveTab("all")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#334155"
              }}>
                <Ic name="layers" size={18} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>All Programs</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 1 }}>Filter entries by category</div>
              </div>
            </div>
            <Ic name="chevronRight" size={18} color="#94a3b8" />
          </button>

          {/* Button 3: Upcoming Programs */}
          <button className="mobile-nav-btn" onClick={() => setActiveTab("upcoming")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: CORAL_PRIMARY
              }}>
                <Ic name="clock" size={18} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Upcoming Programs</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 1 }}>{upcomingPrograms.length} pending to call up</div>
              </div>
            </div>
            <span className="badge badge-coral" style={{ fontSize: 11 }}>{upcomingPrograms.length}</span>
          </button>

          {/* Button 4: Completed Programs */}
          <button className="mobile-nav-btn" onClick={() => setActiveTab("completed")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: EMERALD_SUCCESS
              }}>
                <Ic name="checkCircle" size={18} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Completed</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 1 }}>Running & finished programs</div>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: 11 }}>{runningPrograms.length + completedPrograms.length}</span>
          </button>

          {/* Result Session Button */}
          <button
            onClick={onOpenResults}
            style={{
              marginTop: 8,
              padding: 14,
              borderRadius: 14,
              border: "none",
              background: "#ffffff",
              color: "#334155",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <Ic name="trophy" size={16} color={CORAL_PRIMARY} /> Go to Result Session
          </button>
        </div>
      )}

      {/* SUB-PAGES HEADER (BACK BUTTON) */}
      {activeTab && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <button
              onClick={() => setActiveTab(null)}
              style={{
                background: "#ffffff",
                border: "none",
                color: "#0f172a",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
              }}
            >
              <Ic name="back" size={14} /> Back
            </button>
            
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", textTransform: "capitalize" }}>
              {activeTab === "all" ? "All Programs" : activeTab} ({selectedSession})
            </div>
          </div>

          {/* TAB 1: SCHEDULE */}
          {activeTab === "schedule" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              
              {/* Date Filter Bar (Only for Stage Session) */}
              {selectedSession === "Stage" && (
                <div style={{ display: "flex", gap: 6, margin: "2px 0 4px", overflowX: "auto", paddingBottom: 2 }}>
                  {SCHEDULE_DATES.map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: selectedDate === d ? CORAL_PRIMARY : "#ffffff",
                        color: selectedDate === d ? "#ffffff" : "#475569",
                        fontWeight: 800,
                        fontSize: 11,
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {/* PROGRAM TABLE LIST */}
              {sessionPrograms
                .filter(p => selectedSession === "Stage" ? (p.date || "Day 1") === selectedDate : true)
                .map((p, i) => (
                <div key={p.id} style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#64748b", width: 24 }}>#{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {p.category}
                      </div>
                    </div>
                  </div>
                  <span className={p.status === "Running" ? "badge badge-emerald" : p.status === "Completed" ? "badge badge-slate" : "badge badge-coral"}>
                    {p.status || "Upcoming"}
                  </span>
                </div>
              ))}

              {/* SLEEK MINIMAL DOWNSIDE ACTION CONTROLS */}
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {/* Schedule Manager Pill (Stage Only) */}
                {selectedSession === "Stage" && (
                  <button
                    onClick={onOpenScheduleManager}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: CORAL_PRIMARY,
                      border: "none",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      boxShadow: "0 2px 8px rgba(241, 77, 77, 0.2)"
                    }}
                  >
                    <Ic name="grid" size={14} color="#fff" /> Manage Order
                  </button>
                )}

                {/* Minimal Import Excel Button */}
                <button
                  onClick={() => setIsExcelOpen(true)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "#ffffff",
                    border: "none",
                    color: "#0f172a",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
                  }}
                >
                  <Ic name="upload" size={14} color={CORAL_PRIMARY} /> Import Excel
                </button>
              </div>

              {/* Subtle Reset Trial Link */}
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear current schedule and load fresh trial data?")) {
                      onResetTrialData();
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: "4px 8px"
                  }}
                >
                  Reset Trial Data
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ALL PROGRAMS */}
          {activeTab === "all" && (
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: selectedCategory === cat ? CORAL_PRIMARY : "#ffffff",
                      color: selectedCategory === cat ? "#ffffff" : "#475569",
                      fontWeight: 800,
                      fontSize: 11,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categoryPrograms.map((p, i) => (
                  <div key={p.id} style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#64748b", width: 24 }}>#{i + 1}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          {p.category} · {getParticipantsForProgram(p.id).length} Entries
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-slate">{p.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UPCOMING PROGRAMS */}
          {activeTab === "upcoming" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Date Filter Bar for Stage Session */}
              {selectedSession === "Stage" && (
                <div style={{ display: "flex", gap: 6, marginBottom: 4, overflowX: "auto", paddingBottom: 2 }}>
                  {SCHEDULE_DATES.map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 10,
                        background: selectedDate === d ? CORAL_PRIMARY : "#ffffff",
                        color: selectedDate === d ? "#ffffff" : "#475569",
                        fontWeight: 800,
                        fontSize: 11,
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {upcomingPrograms.filter(p => selectedSession === "Stage" ? (p.date || "Day 1") === selectedDate : true).length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b", fontSize: 13 }}>
                  No upcoming programs in {selectedSession} {selectedSession === "Stage" ? `for ${selectedDate}` : ""}
                </div>
              ) : (
                upcomingPrograms
                  .filter(p => selectedSession === "Stage" ? (p.date || "Day 1") === selectedDate : true)
                  .map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectUpcoming(p)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: "#ffffff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        {p.category} · {getParticipantsForProgram(p.id).length} Entries
                      </div>
                    </div>
                    <button style={{
                      background: CORAL_PRIMARY,
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "7px 14px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(241, 77, 77, 0.25)"
                    }}>
                      Call Up <Ic name="play" size={11} color="#fff" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: COMPLETED & RUNNING */}
          {activeTab === "completed" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {runningPrograms.map(p => (
                <div key={p.id} style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: EMERALD_SUCCESS, fontWeight: 700, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="blink-indicator" style={{ background: EMERALD_SUCCESS }} /> {p.category} · Running
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmEndProg(p)}
                    style={{
                      background: "#d1fae5",
                      color: "#065f46",
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <Ic name="checkCircle" size={13} color="#065f46" /> End
                  </button>
                </div>
              ))}

              {completedPrograms.map(p => (
                <div key={p.id} style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  opacity: 0.8
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{p.category}</div>
                  </div>
                  <span className="badge badge-slate">Finished</span>
                </div>
              ))}

              {runningPrograms.length === 0 && completedPrograms.length === 0 && (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b", fontSize: 13 }}>
                  No running or completed programs in {selectedSession}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Stream Call Up Modal */}
      <StreamModal
        program={streamModalProg}
        participantsCount={streamModalProg ? getParticipantsForProgram(streamModalProg.id).length : 0}
        isOpen={!!streamModalProg}
        onClose={() => setStreamModalProg(null)}
        onStream={() => {
          if (streamModalProg) {
            onStreamProgram(streamModalProg.id);
            onOpenCallList(streamModalProg);
            setStreamModalProg(null);
          }
        }}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isExcelOpen}
        targetDate={selectedDate}
        targetSession={selectedSession}
        onClose={() => setIsExcelOpen(false)}
        onImportSchedule={onImportSchedule}
      />

      {/* End Program Confirmation Popup Modal */}
      <EndProgramModal
        program={confirmEndProg}
        isOpen={!!confirmEndProg}
        onClose={() => setConfirmEndProg(null)}
        onConfirm={onMarkCompleted}
      />
    </div>
  );
};

export default DashboardPage;
