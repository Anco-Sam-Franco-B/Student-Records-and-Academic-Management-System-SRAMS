import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});


createRoot(document.getElementById('root')).render(
  <AuthProvider>
        <BrowserRouter>
          <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                    duration: 1000,
                }}
            />
          <App />
        </BrowserRouter>
  </AuthProvider>

)
