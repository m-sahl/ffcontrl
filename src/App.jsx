import React, { useState } from "react";
import { DeskProvider, useDesk } from "./context/DeskContext";
import GlobalStyles from "./styles/GlobalStyles";
import AestheticRedLines from "./components/common/AestheticRedLines";
import DashboardPage from "./components/DashboardPage";
import CallListPage from "./components/CallListPage";
import AttendancePage from "./components/AttendancePage";
import CodeLetterPage from "./components/CodeLetterPage";
import ScheduleManagerPage from "./components/ScheduleManagerPage";
import ResultsPlaceholderPage from "./components/ResultsPlaceholderPage";

const MainContent = () => {
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
    importSchedule,
    resetToTrialData,
    markProgramCompleted,
    getParticipantsForProgram
  } = useDesk();

  const [currentView, setCurrentView] = useState("dashboard");
  const [dashboardTab, setDashboardTab] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);

  // Navigate to Call List view
  const handleOpenCallList = (program) => {
    setActiveProgram(program);
    setCurrentView("call-list");
  };

  const handleStartRegistration = () => {
    setCurrentView("attendance");
  };

  const handleProceedToCodeLetter = () => {
    setCurrentView("code-letter");
  };

  const handleFinishCoding = () => {
    if (activeProgram) {
      finishCodeLetters(activeProgram.id);
    }
    setCurrentView("dashboard");
    setActiveProgram(null);
  };

  const participants = activeProgram ? getParticipantsForProgram(activeProgram.id) : [];

  return (
    <>
      <GlobalStyles />
      <AestheticRedLines />
      
      {currentView === "dashboard" && (
        <DashboardPage
          programs={programs}
          activeStreamId={activeStreamId}
          activeStreams={activeStreams}
          initialTab={dashboardTab}
          getParticipantsForProgram={getParticipantsForProgram}
          onStreamProgram={(id) => {
            streamProgram(id);
            const prog = programs.find(p => p.id === id);
            setActiveProgram(prog);
          }}
          onOpenCallList={handleOpenCallList}
          onMarkCompleted={markProgramCompleted}
          onImportSchedule={importSchedule}
          onResetTrialData={resetToTrialData}
          onOpenScheduleManager={() => {
            setDashboardTab("schedule");
            setCurrentView("schedule-manager");
          }}
          onOpenResults={() => setCurrentView("results")}
        />
      )}

      {currentView === "schedule-manager" && (
        <ScheduleManagerPage
          programs={programs}
          onBack={() => {
            setDashboardTab("schedule");
            setCurrentView("dashboard");
          }}
          onSaveSchedule={(updatedStagePrograms) => {
            const offStageProgs = programs.filter(p => p.session !== "Stage");
            importSchedule([...updatedStagePrograms, ...offStageProgs]);
          }}
        />
      )}

      {currentView === "call-list" && activeProgram && (
        <CallListPage
          program={activeProgram}
          participants={participants}
          onBack={() => setCurrentView("dashboard")}
          onStartRegistration={handleStartRegistration}
        />
      )}

      {currentView === "attendance" && activeProgram && (
        <AttendancePage
          program={activeProgram}
          participants={participants}
          onUpdateAttendance={updateAttendance}
          onBatchAttendance={batchAttendance}
          onBack={() => setCurrentView("call-list")}
          onProceedToCodeLetter={handleProceedToCodeLetter}
        />
      )}

      {currentView === "code-letter" && activeProgram && (
        <CodeLetterPage
          program={activeProgram}
          participants={participants}
          onAssignCode={(studentId, letter) => assignCodeLetter(activeProgram.id, studentId, letter)}
          onResetCodes={() => resetCodeLetters(activeProgram.id)}
          onFinish={handleFinishCoding}
          onBack={() => setCurrentView("attendance")}
        />
      )}

      {currentView === "results" && (
        <ResultsPlaceholderPage onBack={() => setCurrentView("dashboard")} />
      )}
    </>
  );
};

const App = () => (
  <DeskProvider>
    <MainContent />
  </DeskProvider>
);

export default App;
