import React from "react";

const GlobalStyles = () => (
  <style>{`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    
    body {
      background-color: #fdfaf9;
      background-image: 
        radial-gradient(rgba(241, 77, 77, 0.12) 1.2px, transparent 1.2px),
        radial-gradient(circle at 50% 0%, rgba(241, 77, 77, 0.05), transparent 70%);
      background-size: 18px 18px, 100% 100%;
      background-attachment: fixed;
      color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100vh;
    }

    h1, h2, h3, h4, .font-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    button, input, select {
      font-family: inherit;
    }

    .anim-fade { animation: fadeIn 0.2s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .blink-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #ffffff;
      display: inline-block;
      margin-right: 6px;
      animation: blinkPulse 1.2s infinite ease-in-out;
    }
    @keyframes blinkPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.85); }
    }

    .anim-pop {
      animation: popIn 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes popIn {
      0% { transform: scale(0.96); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    .anim-session-switch {
      animation: sessionSwitch 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes sessionSwitch {
      0% {
        opacity: 0.15;
        transform: translateY(10px) scale(0.985);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* 3D Flip Card Container (Border-Free Solid) */
    .flip-card {
      background-color: transparent;
      width: 64px;
      height: 84px;
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
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      border: none;
    }
    .flip-card-front {
      background: #ffffff;
      color: #f14d4d;
      font-weight: 800;
      font-size: 22px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .flip-card-front:hover {
      background: #fff5f5;
      transform: translateY(-2px);
    }
    .flip-card-back {
      background: #f14d4d;
      color: #ffffff;
      font-weight: 800;
      font-size: 32px;
      transform: rotateY(180deg);
      box-shadow: 0 6px 18px rgba(241, 77, 77, 0.3);
    }

    /* Borderless Minimal Mobile Navigation Buttons */
    .mobile-nav-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 18px;
      border-radius: 16px;
      background: #ffffff;
      border: none;
      color: #0f172a;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.15s ease;
      text-align: left;
    }
    .mobile-nav-btn:active {
      transform: scale(0.98);
      background: #f8fafc;
    }

    /* Borderless Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 9px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      border: none;
      letter-spacing: 0.3px;
    }
    .badge-coral { background: #fee2e2; color: #f14d4d; }
    .badge-emerald { background: #d1fae5; color: #059669; }
    .badge-red { background: #fee2e2; color: #dc2626; }
    .badge-slate { background: #e2e8f0; color: #475569; }

    /* Borderless Sticky Bottom Mobile Bar */
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 14px 16px 20px;
      background: #ffffff;
      border-top: none;
      box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.06);
      z-index: 90;
    }
    .btn-mobile-primary {
      width: 100%;
      height: 48px;
      border-radius: 14px;
      background: #f14d4d;
      color: #ffffff;
      font-weight: 800;
      font-size: 15px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(241, 77, 77, 0.3);
    }
    .btn-mobile-primary:active {
      transform: scale(0.98);
      background: #e11d48;
    }
  `}</style>
);

export default GlobalStyles;
