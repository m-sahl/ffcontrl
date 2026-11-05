import React, { useState } from "react";
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
    getParticipantsForProgram
  } = useDesk();

  // Primary top-level navigation: "events" (Dashboard disabled as requested)
  const [currentTab, setCurrentTab] = useState("events");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Selected session: defaults to "Off-Stage" as off-stage is active and stage is opening soon
  const [selectedSession, setSelectedSession] = useState("Off-Stage");

  const handleSelectSession = (sess) => {
    setSelectedSession(sess);
    try {
      localStorage.setItem("ff_selected_session", sess);
    } catch {}
  };
  
  // Sub-views for detail flows
  const [subView, setSubView] = useState(null); // "call-list" | "attendance" | "code-letter"
  const [activeProgram, setActiveProgram] = useState(null);

  // Navigate to Call List view
  const handleOpenCallList = (program) => {
    setActiveProgram(program);
    if (program?.session) {
      handleSelectSession(program.session);
    }
    setSubView("call-list");
  };

  // Directly navigate to Attendance view (for Off-Stage or editing)
  const handleOpenAttendance = (program) => {
    setActiveProgram(program);
    if (program?.session) {
      handleSelectSession(program.session);
    }
    setSubView("attendance");
  };

  // Directly navigate to Code Letter view (for editing code letters)
  const handleOpenCodeLetter = (program) => {
    setActiveProgram(program);
    if (program?.session) {
      handleSelectSession(program.session);
    }
    setSubView("code-letter");
  };

  const handleStartRegistration = () => {
    setSubView("attendance");
  };

  const handleProceedToCodeLetter = () => {
    setSubView("code-letter");
  };

  const handleFinishCoding = () => {
    if (activeProgram) {
      // Only set status to Running if it was not already Completed
      if (activeProgram.status !== "Completed" && activeProgram.status !== "published") {
        finishCodeLetters(activeProgram.id);
      }
      if (activeProgram.session) {
        handleSelectSession(activeProgram.session);
      }
    }
    setSubView(null);
    setActiveProgram(null);
    setCurrentTab("events");
  };

  // Handle back navigation from AppBar
  const handleAppBarBack = () => {
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
        onBack={handleAppBarBack}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
            onBack={() => {
              if (activeProgram?.session) {
                handleSelectSession(activeProgram.session);
              }
              setSubView(null);
              setActiveProgram(null);
            }}
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
            onBack={() => {
              const isAlreadyFinishedOrRunning = activeProgram?.status === "Running" || activeProgram?.status === "Completed";
              if (activeProgram?.session === "Off-Stage" || isAlreadyFinishedOrRunning) {
                if (activeProgram?.session) {
                  handleSelectSession(activeProgram.session);
                }
                setSubView(null);
                setActiveProgram(null);
              } else {
                setSubView("call-list");
              }
            }}
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
            onBack={() => {
              const isAlreadyFinishedOrRunning = activeProgram?.status === "Running" || activeProgram?.status === "Completed";
              if (isAlreadyFinishedOrRunning) {
                if (activeProgram?.session) {
                  handleSelectSession(activeProgram.session);
                }
                setSubView(null);
                setActiveProgram(null);
              } else {
                setSubView("attendance");
              }
            }}
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
        onClose={() => setIsSettingsOpen(false)}
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
