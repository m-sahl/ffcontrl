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

    /* Responsive UI Back Button rules:
       On mobile viewports (<= 768px), UI back buttons are hidden to maximize screen space
       and allow system navigation (hardware back button, edge swipe gestures).
       On desktop viewports (> 768px), UI back buttons remain visible for mouse interaction. */
    @media (max-width: 768px) {
      .ui-back-btn {
        display: none !important;
      }
      .desktop-hide-when-back {
        display: flex !important;
      }
    }

    @media (min-width: 769px) {
      .desktop-hide-when-back {
        display: none !important;
      }
    }
  `}</style>
);

export default GlobalStyles;
