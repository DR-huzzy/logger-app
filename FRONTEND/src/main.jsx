import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

// Apply dark mode on load
const savedDarkMode = localStorage.getItem("darkMode");

if (savedDarkMode === "true") {
    document.documentElement.classList.add("dark");
} else if (savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // No saved preference, use system preference
    document.documentElement.classList.add("dark");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
