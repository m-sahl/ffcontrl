import React from "react";

const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    
    body {
      background-color: #f8f9fa;
      background-image: linear-gradient(180deg, #ffffff 0%, #f8f9fa 140px);
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
      min-height: 100vh;
      letter-spacing: -0.1px;
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: -0.3px;
    }

    button, input, select, textarea {
      font-family: inherit;
    }

    /* Soft Animations */
    .anim-fade { 
      animation: fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .blink-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #10b981;
      display: inline-block;
      margin-right: 6px;
      animation: blinkPulse 1.4s infinite ease-in-out;
    }
    @keyframes blinkPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.85); }
    }

    .anim-pop {
      animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes popIn {
      0% { transform: scale(0.96); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    .anim-session-switch {
      animation: sessionSwitch 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes sessionSwitch {
      0% {
        opacity: 0.2;
        transform: translateY(8px) scale(0.99);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Leader APK Card System */
    .leader-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .leader-card:hover {
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
    }

    /* Leader APK 3D Mystery Flip Card */
    .flip-card {
      background-color: transparent;
      width: 66px;
      height: 88px;
      perspective: 1000px;
      cursor: pointer;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-style: preserve-3d;
    }
    .flip-card.flipped .flip-card-inner {
      transform: rotateY(180deg);
    }
    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    .flip-card-front {
      background: #ffffff;
      color: #f14d4d;
      font-weight: 800;
      font-size: 24px;
      border: 1.5px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .flip-card-front:hover {
      background: #fffafa;
      border-color: #f14d4d;
      transform: translateY(-2px);
    }
    .flip-card-back {
      background: #f14d4d;
      color: #ffffff;
      font-weight: 800;
      font-size: 32px;
      transform: rotateY(180deg);
      border: none;
      box-shadow: 0 6px 20px rgba(241, 77, 77, 0.35);
    }

    /* Mystery Cards Shuffle Animation */
    @keyframes cardShuffleLeft {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      }
      22% {
        transform: translate3d(-14px, -10px, 0) rotate(-7deg) scale(1.05);
      }
      48% {
        transform: translate3d(10px, 5px, 0) rotate(5deg) scale(0.97);
      }
      74% {
        transform: translate3d(-4px, -3px, 0) rotate(-3deg) scale(1.02);
      }
      100% {
        transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      }
    }

    @keyframes cardShuffleRight {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      }
      22% {
        transform: translate3d(14px, -10px, 0) rotate(7deg) scale(1.05);
      }
      48% {
        transform: translate3d(-10px, 5px, 0) rotate(-5deg) scale(0.97);
      }
      74% {
        transform: translate3d(4px, -3px, 0) rotate(3deg) scale(1.02);
      }
      100% {
        transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      }
    }

    @keyframes spinShuffle {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes questionShimmer {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.22);
        opacity: 0.85;
      }
    }

    .flip-card.shuffling-left {
      animation: cardShuffleLeft 0.55s cubic-bezier(0.25, 1, 0.5, 1) both;
      z-index: 2;
    }

    .flip-card.shuffling-right {
      animation: cardShuffleRight 0.55s cubic-bezier(0.25, 1, 0.5, 1) both;
      z-index: 3;
    }

    .flip-card.shuffling-left .flip-card-front,
    .flip-card.shuffling-right .flip-card-front {
      border-color: rgba(241, 77, 77, 0.4);
      box-shadow: 0 8px 24px rgba(241, 77, 77, 0.16);
    }

    .flip-card.shuffling-left .mystery-question-mark,
    .flip-card.shuffling-right .mystery-question-mark {
      display: inline-block;
      animation: questionShimmer 0.55s ease-in-out;
    }

    /* Modal Big Shuffle Button */
    .btn-modal-shuffle:hover:not(:disabled) {
      background: rgba(241, 77, 77, 0.12) !important;
      border-color: rgba(241, 77, 77, 0.45) !important;
      transform: translateY(-1px);
    }
    .btn-modal-shuffle:active:not(:disabled) {
      transform: scale(0.97) !important;
    }

    /* Leader APK Navigation Button Cards */
    .mobile-nav-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 18px;
      border-radius: 18px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
    }
    .mobile-nav-btn:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    }
    .mobile-nav-btn:active {
      transform: scale(0.985);
      background: #f8fafc;
    }

    /* Leader APK Status Badges & Pills */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2px;
      line-height: 1;
      white-space: nowrap;
    }
    .badge-coral { 
      background: rgba(241, 77, 77, 0.08); 
      color: #f14d4d; 
      border: 1px solid rgba(241, 77, 77, 0.2);
    }
    .badge-emerald { 
      background: rgba(16, 185, 129, 0.08); 
      color: #10b981; 
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .badge-sapphire { 
      background: rgba(37, 99, 235, 0.08); 
      color: #2563eb; 
      border: 1px solid rgba(37, 99, 235, 0.2);
    }
    .badge-amber { 
      background: rgba(245, 158, 11, 0.08); 
      color: #d97706; 
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    .badge-slate { 
      background: #f1f4f9; 
      color: #475569; 
      border: 1px solid #e2e8f0;
    }
    .badge-red { 
      background: rgba(239, 68, 68, 0.08); 
      color: #ef4444; 
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    /* Sticky Bottom Mobile Bar */
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 14px 16px max(18px, env(safe-area-inset-bottom));
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid #e2e8f0;
      box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.04);
      z-index: 90;
    }
    .btn-mobile-primary {
      width: 100%;
      height: 48px;
      border-radius: 14px;
      background: #f14d4d;
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: -0.1px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(241, 77, 77, 0.25);
      transition: all 0.15s ease;
    }
    .btn-mobile-primary:hover {
      background: #e13b3b;
      box-shadow: 0 6px 18px rgba(241, 77, 77, 0.32);
    }
    .btn-mobile-primary:active {
      transform: scale(0.985);
      background: #d63333;
    }

    /* PIN Lock animations */
    @keyframes shakePin {
      0%, 100% { transform: translateX(0); }
      15%, 45%, 75% { transform: translateX(-8px); }
      30%, 60%, 90% { transform: translateX(8px); }
    }
    .anim-shake {
      animation: shakePin 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    .pin-btn {
      transition: transform 0.12s ease, background-color 0.12s ease, box-shadow 0.12s ease;
      user-select: none;
      -webkit-user-select: none;
    }
    .pin-btn:hover {
      background-color: #f1f5f9;
      transform: translateY(-1px);
    }
    .pin-btn:active {
      transform: scale(0.94) translateY(1px);
      background-color: #e2e8f0;
    }

    /* Banner Carousel Smooth Glide & Crossfade */
    .banner-carousel-slide {
      animation: bannerSlideSmooth 0.52s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      will-change: transform, opacity;
    }
    @keyframes bannerSlideSmooth {
      0% {
        opacity: 0;
        transform: translateY(8px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Hide scrollbar utility */
    .no-scrollbar::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    .no-scrollbar {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    /* ========================================================
       RESPONSIVE DESIGN SYSTEM (Mobile, Tab screens, Desktop)
       Tab screens: 640px - 1024px (iPad, Android Tabs, etc.)
       ======================================================== */

    /* UI Back Button: Always accessible across mobile and tab screens */
    .ui-back-btn {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .ui-back-btn:hover {
      background-color: #f1f5f9 !important;
      border-color: #cbd5e1 !important;
    }
    .ui-back-btn:active {
      transform: scale(0.96);
    }

    /* Page container: fluid and comfortably scaled on tab screens */
    .responsive-page {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      padding: 16px 16px 140px;
      box-sizing: border-box;
      transition: max-width 0.2s ease, padding 0.2s ease;
    }
    @media (min-width: 640px) {
      .responsive-page {
        max-width: 768px;
        padding: 20px 24px 140px;
      }
    }
    @media (min-width: 840px) {
      .responsive-page {
        max-width: 880px;
        padding: 24px 28px 140px;
      }
    }
    @media (min-width: 1024px) {
      .responsive-page {
        max-width: 980px;
        padding: 28px 32px 140px;
      }
    }

    /* Header container inside sticky AppBar */
    .app-header-container {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 56px;
      box-sizing: border-box;
      transition: max-width 0.2s ease, padding 0.2s ease;
    }
    @media (min-width: 640px) {
      .app-header-container {
        max-width: 768px;
        padding: 12px 24px;
        min-height: 60px;
      }
    }
    @media (min-width: 840px) {
      .app-header-container {
        max-width: 880px;
        padding: 12px 28px;
      }
    }
    @media (min-width: 1024px) {
      .app-header-container {
        max-width: 980px;
        padding: 14px 32px;
      }
    }

    /* Responsive bottom action button container inside sticky bottom-bar */
    .responsive-bottom-action {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      transition: max-width 0.2s ease;
    }
    @media (min-width: 640px) {
      .responsive-bottom-action {
        max-width: 768px;
      }
    }
    @media (min-width: 840px) {
      .responsive-bottom-action {
        max-width: 880px;
      }
    }
    @media (min-width: 1024px) {
      .responsive-bottom-action {
        max-width: 980px;
      }
    }

    /* Floating bottom navigation pill */
    .responsive-bottom-nav {
      width: 100%;
      max-width: 440px;
      transition: max-width 0.2s ease;
    }
    @media (min-width: 640px) {
      .responsive-bottom-nav {
        max-width: 540px;
      }
    }
    @media (min-width: 840px) {
      .responsive-bottom-nav {
        max-width: 580px;
      }
    }

    /* Events Hub Cards Grid (All Programs, Upcoming, Completed & Running) */
    .hub-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    @media (min-width: 640px) {
      .hub-cards-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
    }

    /* Hub Card Button */
    .hub-card-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 18px;
      border-radius: 18px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
    }
    .hub-card-btn:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
      transform: translateY(-1px);
    }
    .hub-card-btn:active {
      transform: scale(0.985);
      background: #f8fafc;
    }
    @media (min-width: 640px) {
      .hub-card-btn {
        flex-direction: column;
        align-items: flex-start;
        justifyContent: space-between;
        min-height: 144px;
        padding: 18px 20px;
        gap: 14px;
      }
    }

    /* Program cards responsive 2-column grid on tab screens */
    .responsive-program-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    @media (min-width: 640px) {
      .responsive-program-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }

    /* Candidate / Roster list responsive 2-column grid on tab screens */
    .responsive-roster-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    @media (min-width: 640px) {
      .responsive-roster-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
    }

    /* Category filter chips row */
    .category-chips-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      margin-bottom: 16px;
    }
    @media (min-width: 640px) {
      .category-chips-row {
        flex-wrap: wrap;
        gap: 10px;
        overflow-x: visible;
      }
    }

    /* Modal Backdrop & Card on Tab Screens */
    .responsive-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 150;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      transition: all 0.2s ease;
    }
    @media (min-width: 640px) {
      .responsive-modal-overlay {
        align-items: center;
        padding: 24px;
      }
    }

    .responsive-modal-card {
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      background: #ffffff;
      border-top-left-radius: 26px;
      border-top-right-radius: 26px;
      border-top: 1.2px solid #e2e8f0;
      box-shadow: 0 -12px 36px rgba(15, 23, 42, 0.14);
      display: flex;
      flex-direction: column;
      position: relative;
      box-sizing: border-box;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @media (min-width: 640px) {
      .responsive-modal-card {
        max-width: 580px;
        border-radius: 24px !important;
        border: 1.2px solid #e2e8f0 !important;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(0, 0, 0, 0.05) !important;
        max-height: 85vh;
      }
      .responsive-modal-handle {
        display: none !important;
      }
    }

    .responsive-modal-card-wide {
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      background: #ffffff;
      border-top-left-radius: 26px;
      border-top-right-radius: 26px;
      border-top: 1.2px solid #e2e8f0;
      box-shadow: 0 -12px 36px rgba(15, 23, 42, 0.14);
      display: flex;
      flex-direction: column;
      position: relative;
      box-sizing: border-box;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @media (min-width: 640px) {
      .responsive-modal-card-wide {
        max-width: 720px;
        border-radius: 24px !important;
        border: 1.2px solid #e2e8f0 !important;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(0, 0, 0, 0.05) !important;
        max-height: 85vh;
      }
    }
    @media (min-width: 840px) {
      .responsive-modal-card-wide {
        max-width: 800px;
      }
    }

    /* Responsive login card on tab screens */
    .responsive-login-card {
      width: 100%;
      max-width: 380px;
      transition: max-width 0.2s ease, padding 0.2s ease;
    }
    @media (min-width: 640px) {
      .responsive-login-card {
        max-width: 440px;
        padding: 44px 36px 38px !important;
      }
    }
  `}</style>
);

export default GlobalStyles;
