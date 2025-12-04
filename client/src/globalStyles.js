// src/globalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Open Sans', sans-serif;
    line-height: 1.5;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.colors.text.primary};

    /* ✅ OCEAN BACKGROUND FROM PUBLIC FOLDER */
    background-image: url('/ocean-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;

    /* ✅ fallback color */
    background-color: #020617;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    position: relative;
  }

  /* ✅ DARK OVERLAY FOR READABILITY */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at top left, rgba(15,23,42,0.45), transparent 55%),
      linear-gradient(180deg, rgba(15,23,42,0.65), rgba(15,23,42,0.35));
    z-index: -1;
  }

  #root {
    position: relative;
    z-index: 1;
    isolation: isolate;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.15;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  /* ✅ SCROLLBAR */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.02);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.14);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.20);
  }

  /* ✅✅✅ FIX INPUT & DROPDOWN VISIBILITY ✅✅✅ */
  input,
  textarea,
  select {
    color: #000 !important;
    background: #ffffff !important;
  }

  input::placeholder,
  textarea::placeholder {
    color: #555 !important;
  }

  option {
    color: #000 !important;
    background: #ffffff !important;
  }

  /* ✅ Extra safety for History filters */
  .history select,
  .history option {
    color: #000 !important;
    background: #ffffff !important;
  }

  /* 🚫🚫🚫 REMOVE **ALL HOVER EFFECTS EVERYWHERE** 🚫🚫🚫 */
  *:hover {
    filter: none !important;
    transform: none !important;
    box-shadow: none !important;
    color: inherit !important;
  }

  /* ✅✅✅ FORCE INPUTS TO NEVER GO TRANSPARENT ✅✅✅ */
  input:hover,
  input:focus,
  textarea:hover,
  textarea:focus,
  select:hover,
  select:focus {
    background: #ffffff !important;
    color: #000 !important;
    box-shadow: none !important;
    outline: none !important;
  }

`;
