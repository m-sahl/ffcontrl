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

  // Initial navigation state restored from URL search params or localStorage
  const initialNav = useRef((() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlSession = params.get("session");
      const urlTab = params.get("tab");
      const urlCategory = params.get("cat");
      const urlView = params.get("view");
      const urlProgId = params.get("progId");

      const session = urlSession || localStorage.getItem("ff_selected_session") || "Stage";
      const activeTab = urlTab !== null ? urlTab : (localStorage.getItem("ff_active_tab") || null);
      const selectedCategory = urlCategory || localStorage.getItem("ff_selected_category") || "All";
      const subView = urlView || localStorage.getItem("ff_sub_view") || null;
      const activeProgId = urlProgId || localStorage.getItem("ff_active_prog_id") || null;

      let cachedProg = null;
      try {
        const raw = localStorage.getItem("ff_active_prog_data");
        if (raw) cachedProg = JSON.parse(raw);
      } catch {}

      return {
        session,
        activeTab: activeTab === "" ? null : activeTab,
        selectedCategory,
        subView: subView === "" ? null : subView,
        activeProgId: activeProgId === "" ? null : activeProgId,
        cachedProg
      };
    } catch {
      return {
        session: "Stage",
        activeTab: null,
        selectedCategory: "All",
        subView: null,
        activeProgId: null,
        cachedProg: null
      };
    }
  })()).current;

  // Selected session: defaults to saved selection or "Stage" as stage is now open
  const [selectedSession, setSelectedSession] = useState(initialNav.session);
  const [activeTab, setActiveTab] = useState(initialNav.activeTab);
  const [selectedCategory, setSelectedCategory] = useState(initialNav.selectedCategory);
  const [subView, setSubView] = useState(initialNav.subView); // "call-list" | "attendance" | "code-letter"
  const [activeProgramId, setActiveProgramId] = useState(initialNav.activeProgId);
  const [activeProgram, setActiveProgram] = useState(() => {
    if (initialNav.activeProgId && programs && programs.length > 0) {
      const found = programs.find((p) => p.id === initialNav.activeProgId);
      if (found) return found;
    }
    return initialNav.cachedProg;
  });

  // Keep activeProgram synchronized whenever programs array updates
  const programsRef = useRef(programs);
  useEffect(() => {
    programsRef.current = programs;
    if (activeProgramId && programs && programs.length > 0) {
      const match = programs.find((p) => p.id === activeProgramId);
      if (match) {
        setActiveProgram(match);
        try {
          localStorage.setItem("ff_active_prog_data", JSON.stringify(match));
        } catch {}
      }
    }
  }, [programs, activeProgramId]);

  // Synchronize state changes to URL search params and localStorage
  const syncNavToUrlAndStorage = (opts = {}) => {
    const sSession = opts.session !== undefined ? opts.session : selectedSession;
    const sTab = opts.tab !== undefined ? opts.tab : activeTab;
    const sCat = opts.category !== undefined ? opts.category : selectedCategory;
    const sView = opts.subView !== undefined ? opts.subView : subView;
    const sProgId = opts.progId !== undefined ? opts.progId : (opts.program?.id || activeProgramId);
    const sProgram = opts.program !== undefined ? opts.program : activeProgram;
    const push = opts.push === true;

    try {
      if (sSession) localStorage.setItem("ff_selected_session", sSession);
      if (sTab !== undefined) localStorage.setItem("ff_active_tab", sTab || "");
      if (sCat) localStorage.setItem("ff_selected_category", sCat || "All");
      localStorage.setItem("ff_sub_view", sView || "");
      localStorage.setItem("ff_active_prog_id", sProgId || "");
      if (sProgram) {
        localStorage.setItem("ff_active_prog_data", JSON.stringify(sProgram));
      } else if (!sView) {
        localStorage.removeItem("ff_active_prog_data");
      }

      const params = new URLSearchParams();
      if (sSession) params.set("session", sSession);
      if (sView) {
        params.set("view", sView);
        if (sProgId) params.set("progId", sProgId);
      } else {
        if (sTab) params.set("tab", sTab);
        if (sCat && sCat !== "All") params.set("cat", sCat);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      const targetState = {
        root: !sView && !sTab,
        subView: sView || null,
        progId: sProgId || null,
        tab: sTab || null,
        cat: sCat || "All",
        session: sSession
      };

      if (push) {
        window.history.pushState(targetState, "", newUrl);
      } else {
        window.history.replaceState(targetState, "", newUrl);
      }
    } catch {}
  };

  // Initial URL/storage alignment on mount
  useEffect(() => {
    syncNavToUrlAndStorage({ push: false });
  }, []);

  // Synchronized refs for system back (popstate)
  const isSettingsOpenRef = useRef(isSettingsOpen);
  useEffect(() => {
    isSettingsOpenRef.current = isSettingsOpen;
  }, [isSettingsOpen]);

  // System navigation listener (hardware back button, mobile edge swipe gesture, browser back)
  useEffect(() => {
    const handlePopState = (event) => {
      // 1. If settings modal was open, close it
      if (isSettingsOpenRef.current) {
        setIsSettingsOpen(false);
        return;
      }

      const state = event.state;
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get("view");
      const urlProgId = params.get("progId");
      const urlTab = params.get("tab");
      const urlCat = params.get("cat");
      const urlSession = params.get("session");

      const resolvedView = (state && state.subView !== undefined) ? state.subView : (urlView || null);
      const resolvedProgId = (state && state.progId !== undefined) ? state.progId : (urlProgId || null);
      const resolvedTab = (state && state.tab !== undefined) ? state.tab : (urlTab || null);
      const resolvedCat = (state && state.cat !== undefined) ? state.cat : (urlCat || "All");
      const resolvedSession = (state && state.session !== undefined) ? state.session : (urlSession || selectedSession);

      if (resolvedSession) {
        setSelectedSession(resolvedSession);
      }
      setActiveTab(resolvedTab);
      setSelectedCategory(resolvedCat);
      setSubView(resolvedView);
      setActiveProgramId(resolvedProgId);

      if (resolvedProgId) {
        const prog = programsRef.current.find((p) => p.id === resolvedProgId);
        if (prog) {
          setActiveProgram(prog);
        }
      } else {
        setActiveProgram(null);
      }

      try {
        if (resolvedSession) localStorage.setItem("ff_selected_session", resolvedSession);
        localStorage.setItem("ff_active_tab", resolvedTab || "");
        localStorage.setItem("ff_selected_category", resolvedCat || "All");
        localStorage.setItem("ff_sub_view", resolvedView || "");
        localStorage.setItem("ff_active_prog_id", resolvedProgId || "");
      } catch {}
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedSession]);

  const handleSelectSession = (sess) => {
    triggerHaptic("light");
    setSelectedSession(sess);
    syncNavToUrlAndStorage({ session: sess, push: false });
  };

  const handleSelectTab = (tab) => {
    triggerHaptic("light");
    setActiveTab(tab);
    syncNavToUrlAndStorage({ tab, push: !!tab });
  };

  const handleSelectCategory = (cat) => {
    triggerHaptic("light");
    setSelectedCategory(cat);
    syncNavToUrlAndStorage({ category: cat, push: false });
  };

  // Navigate to Call List view
  const handleOpenCallList = (program) => {
    triggerHaptic("medium");
    setActiveProgram(program);
    setActiveProgramId(program.id);
    const sess = program?.session || selectedSession;
    if (program?.session) {
      setSelectedSession(program.session);
    }
    setSubView("call-list");
    syncNavToUrlAndStorage({
      session: sess,
      subView: "call-list",
      progId: program.id,
      program,
      push: true
    });
  };

  // Directly navigate to Attendance view (for Off-Stage or editing)
  const handleOpenAttendance = (program) => {
    triggerHaptic("medium");
    setActiveProgram(program);
    setActiveProgramId(program.id);
    const sess = program?.session || selectedSession;
    if (program?.session) {
      setSelectedSession(program.session);
    }
    setSubView("attendance");
    syncNavToUrlAndStorage({
      session: sess,
      subView: "attendance",
      progId: program.id,
      program,
      push: true
    });
  };

  // Directly navigate to Code Letter view (for editing code letters)
  const handleOpenCodeLetter = (program) => {
    triggerHaptic("medium");
    setActiveProgram(program);
    setActiveProgramId(program.id);
    const sess = program?.session || selectedSession;
    if (program?.session) {
      setSelectedSession(program.session);
    }
    setSubView("code-letter");
    syncNavToUrlAndStorage({
      session: sess,
      subView: "code-letter",
      progId: program.id,
      program,
      push: true
    });
  };

  const handleStartRegistration = () => {
    triggerHaptic("medium");
    setSubView("attendance");
    syncNavToUrlAndStorage({
      subView: "attendance",
      progId: activeProgram?.id,
      program: activeProgram,
      push: true
    });
  };

  const handleProceedToCodeLetter = () => {
    triggerHaptic("medium");
    setSubView("code-letter");
    syncNavToUrlAndStorage({
      subView: "code-letter",
      progId: activeProgram?.id,
      program: activeProgram,
      push: true
    });
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
        setSelectedSession(activeProgram.session);
      }
    }
    setSubView(null);
    setActiveProgram(null);
    setActiveProgramId(null);
    syncNavToUrlAndStorage({
      subView: null,
      progId: null,
      program: null,
      push: false
    });
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
        setActiveProgramId(null);
        syncNavToUrlAndStorage({ subView: null, progId: null, program: null, push: false });
      } else {
        setSubView("attendance");
        syncNavToUrlAndStorage({ subView: "attendance", progId: activeProgram?.id, program: activeProgram, push: false });
      }
    } else if (subView === "attendance") {
      if (activeProgram?.session === "Off-Stage" || isAlreadyFinishedOrRunning) {
        if (activeProgram?.session) {
          setSelectedSession(activeProgram.session);
        }
        setSubView(null);
        setActiveProgram(null);
        setActiveProgramId(null);
        syncNavToUrlAndStorage({ subView: null, progId: null, program: null, push: false });
      } else {
        setSubView("call-list");
        syncNavToUrlAndStorage({ subView: "call-list", progId: activeProgram?.id, program: activeProgram, push: false });
      }
    } else if (subView === "call-list") {
      if (activeProgram?.session) {
        setSelectedSession(activeProgram.session);
      }
      setSubView(null);
      setActiveProgram(null);
      setActiveProgramId(null);
      syncNavToUrlAndStorage({ subView: null, progId: null, program: null, push: false });
    } else if (activeTab) {
      setActiveTab(null);
      syncNavToUrlAndStorage({ tab: null, push: false });
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
        activeTab={activeTab}
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
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            getParticipantsForProgram={getParticipantsForProgram}
            onStreamProgram={(id) => {
              streamProgram(id);
              const prog = programs.find(p => p.id === id);
              setActiveProgram(prog);
              setActiveProgramId(id);
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

        {/* Fallback if subView is active but program data is missing */}
        {subView && !activeProgram && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
              Program Desk
            </div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Retrieving program details...
            </p>
            <button
              onClick={() => {
                setSubView(null);
                setActiveProgramId(null);
                setActiveProgram(null);
                syncNavToUrlAndStorage({ subView: null, progId: null, program: null, push: false });
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: "#f14d4d",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              Back to Events
            </button>
          </div>
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

      {/* Mobile Bottom Navigation Bar: Stage Desk & Off-Stage Desk */}
      {!subView && (
        <BottomNav
          selectedSession={selectedSession}
          onSelectSession={handleSelectSession}
          stageBadgeCount={programs.filter(p => p.session === "Stage" && (p.status || "").toLowerCase() === "running").length}
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
