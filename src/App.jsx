import React, { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DeskProvider, useDesk } from "./context/DeskContext";
import GlobalStyles from "./styles/GlobalStyles";
import AestheticRedLines from "./components/common/AestheticRedLines";
import AppBar from "./components/common/AppBar";
import BottomNav from "./components/common/BottomNav";
import DashboardView from "./components/DashboardView";
import EventsPage from "./components/EventsPage";
import CallListPage from "./components/CallListPage";
import AttendancePage from "./components/AttendancePage";
import CodeLetterPage from "./components/CodeLetterPage";
import SettingsModal from "./components/SettingsModal";
import LoginPage from "./components/LoginPage";
import { triggerHaptic } from "./utils/haptics";

const MainContent = ({ onLogout }) => {
  const {
    programs,
    activeStreamId,
    activeStreams,
    streamProgram,
    updateAttendance,
    batchAttendance,
    assignCodeLetter,
    resetCodeLetters,
    finishCodeLetters,
    resetToTrialData,
    markProgramCompleted,
    saveProgramRoster,
    getParticipantsForProgram
  } = useDesk();

  // Primary top-level navigation: "events" (Dashboard disabled as requested)
  const [currentTab, setCurrentTab] = useState("events");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Selected session: defaults to "Off-Stage" as off-stage is active and stage is opening soon
  const [selectedSession, setSelectedSession] = useState("Off-Stage");

  const handleSelectSession = (sess) => {
    triggerHaptic("light");
    setSelectedSession(sess);
    try {
      localStorage.setItem("ff_selected_session", sess);
    } catch {}
  };
  
  // Sub-views for detail flows
  const [subView, setSubView] = useState(null); // "call-list" | "attendance" | "code-letter"
  const [activeProgram, setActiveProgram] = useState(null);

  // Synchronized refs for system back (popstate)
  const isSettingsOpenRef = useRef(isSettingsOpen);
  useEffect(() => {
    isSettingsOpenRef.current = isSettingsOpen;
  }, [isSettingsOpen]);

  const programsRef = useRef(programs);
  useEffect(() => {
    programsRef.current = programs;
  }, [programs]);

  // Ensure initial history entry is tagged as root
  useEffect(() => {
    if (!window.history.state || (!window.history.state.root && !window.history.state.subView)) {
      window.history.replaceState({ root: true, subView: null, progId: null }, "");
    }
  }, []);

  // System navigation listener (hardware back button, mobile edge swipe gesture, browser back)
  useEffect(() => {
    const handlePopState = (event) => {
      // 1. If settings modal was open, close it
      if (isSettingsOpenRef.current) {
        setIsSettingsOpen(false);
        return;
      }

      const state = event.state;

      // 2. If back to root or empty state
      if (!state || state.root || !state.subView) {
        setSubView(null);
        setActiveProgram(null);
      } else {
        // 3. Popped to a subview (call-list, attendance, or code-letter)
        setSubView(state.subView);
        if (state.progId) {
          const prog = programsRef.current.find((p) => p.id === state.progId);
          if (prog) {
            setActiveProgram(prog);
            if (prog.session) {
              setSelectedSession(prog.session);
            }
          }
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigate to Call List view
  const handleOpenCallList = (program) => {
    triggerHaptic("medium");
    setActiveProgram(program);
    if (program?.session) {
      handleSelectSession(program.session);
    }
    setSubView("call-list");
    try {
      window.history.pushState({ root: false, subView: "call-list", progId: program.id }, "");
    } catch {}
  };

  // Directly navigate to Attendance view (for Off-Stage or editing)
  const handleOpenAttendance = (program) => {
    triggerHaptic("medium");
    setActiveProgram(program);
    if (program?.session) {
      handleSelectSession(program.session);
    }
    setSubView("attendance");
    try {
      window.history.pushState({ root: false, subView: "attendance", progId: program.id }, "");
    } catch {}
  };

  // Directly navigate to Code Letter view (for editing code letters)
  const handleOpenCodeLetter = (program) => {
    triggerHaptic("medium");
    setActiveProgram(program);
    if (program?.session) {
      handleSelectSession(program.session);
    }
    setSubView("code-letter");
    try {
      window.history.pushState({ root: false, subView: "code-letter", progId: program.id }, "");
    } catch {}
  };

  const handleStartRegistration = () => {
    triggerHaptic("medium");
    setSubView("attendance");
    try {
      window.history.pushState({ root: false, subView: "attendance", progId: activeProgram?.id }, "");
    } catch {}
  };

  const handleProceedToCodeLetter = () => {
    triggerHaptic("medium");
    setSubView("code-letter");
    try {
      window.history.pushState({ root: false, subView: "code-letter", progId: activeProgram?.id }, "");
    } catch {}
  };

  const handleOpenSettings = () => {
    triggerHaptic("light");
    setIsSettingsOpen(true);
    try {
      window.history.pushState({ root: false, modal: "settings", subView, progId: activeProgram?.id }, "");
    } catch {}
  };

  const handleCloseSettings = () => {
    triggerHaptic("light");
    if (window.history.state?.modal === "settings") {
      window.history.back();
    } else {
      setIsSettingsOpen(false);
    }
  };

  const handleFinishCoding = () => {
    triggerHaptic("success");
    if (activeProgram) {
      // Only set status to Running if it was not already Completed
      if (activeProgram.status !== "Completed" && activeProgram.status !== "published") {
        finishCodeLetters(activeProgram.id);
      } else {
        // If it was already completed, re-seal and sync the updated roster without resetting status
        saveProgramRoster(activeProgram.id);
      }
      if (activeProgram.session) {
        handleSelectSession(activeProgram.session);
      }
    }
    setSubView(null);
    setActiveProgram(null);
    setCurrentTab("events");
    try {
      window.history.replaceState({ root: true, subView: null, progId: null }, "");
    } catch {}
  };

  // Unified navigation back (triggered by UI back button on desktop or programmatically)
  const handleNavigateBack = () => {
    triggerHaptic("light");
    if (window.history.state && !window.history.state.root) {
      window.history.back();
    } else {
      handleFallbackBack();
    }
  };

  const handleFallbackBack = () => {
    const isAlreadyFinishedOrRunning = activeProgram?.status === "Running" || activeProgram?.status === "Completed";
    if (subView === "code-letter") {
      if (isAlreadyFinishedOrRunning) {
        setSubView(null);
        setActiveProgram(null);
      } else {
        setSubView("attendance");
      }
    } else if (subView === "attendance") {
      if (activeProgram?.session === "Off-Stage" || isAlreadyFinishedOrRunning) {
        if (activeProgram?.session) {
          handleSelectSession(activeProgram.session);
        }
        setSubView(null);
        setActiveProgram(null);
      } else {
        setSubView("call-list");
      }
    } else if (subView === "call-list") {
      if (activeProgram?.session) {
        handleSelectSession(activeProgram.session);
      }
      setSubView(null);
      setActiveProgram(null);
    }
  };

  const participants = activeProgram ? getParticipantsForProgram(activeProgram.id) : [];

  // Count active programs for badge
  const pendingOrRunningCount = programs.filter(p => p.status === "Running" || p.status === "Upcoming" || !p.status).length;

  return (
    <>
      <GlobalStyles />
      <AestheticRedLines />
      
      {/* Mobile Top App Bar */}
      <AppBar
        currentTab={currentTab}
        selectedSession={selectedSession}
        subView={subView}
        onBack={handleNavigateBack}
        onOpenSettings={handleOpenSettings}
        onLockDesk={onLogout}
        activeStreams={activeStreams}
        programs={programs}
      />

      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        {/* Main View: Events Page (Dashboard disabled as requested) */}
        {!subView && (
          <EventsPage
            programs={programs}
            activeStreamId={activeStreamId}
            activeStreams={activeStreams}
            selectedSession={selectedSession}
            onSelectSession={handleSelectSession}
            getParticipantsForProgram={getParticipantsForProgram}
            onStreamProgram={(id) => {
              streamProgram(id);
              const prog = programs.find(p => p.id === id);
              setActiveProgram(prog);
              if (prog?.session) {
                handleSelectSession(prog.session);
              }
            }}
            onOpenCallList={handleOpenCallList}
            onOpenAttendance={handleOpenAttendance}
            onOpenCodeLetter={handleOpenCodeLetter}
            onMarkCompleted={markProgramCompleted}
          />
        )}

        {/* Sub-View: Call List */}
        {subView === "call-list" && activeProgram && (
          <CallListPage
            program={activeProgram}
            participants={participants}
            onBack={handleNavigateBack}
            onStartRegistration={handleStartRegistration}
          />
        )}

        {/* Sub-View: Attendance Desk */}
        {subView === "attendance" && activeProgram && (
          <AttendancePage
            program={activeProgram}
            participants={participants}
            onUpdateAttendance={updateAttendance}
            onBatchAttendance={batchAttendance}
            onBack={handleNavigateBack}
            onProceedToCodeLetter={handleProceedToCodeLetter}
          />
        )}

        {/* Sub-View: Code Letter Allocation */}
        {subView === "code-letter" && activeProgram && (
          <CodeLetterPage
            program={activeProgram}
            participants={participants}
            onAssignCode={(studentId, letter) => assignCodeLetter(activeProgram.id, studentId, letter)}
            onResetCodes={() => resetCodeLetters(activeProgram.id)}
            onFinish={handleFinishCoding}
            onBack={handleNavigateBack}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar: Stage Desk & Button to Off-Stage Pages */}
      {!subView && (
        <BottomNav
          selectedSession={selectedSession}
          onSelectSession={handleSelectSession}
          offStageBadgeCount={programs.filter(p => p.session === "Off-Stage" && (p.status || "").toLowerCase() === "running").length}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onLockDesk={onLogout}
      />
    </>
  );
};

const AppContent = () => {
  const { isAuthenticated, lock } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <LoginPage />
      </>
    );
  }

  return (
    <DeskProvider>
      <MainContent onLogout={lock} />
    </DeskProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
