import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import Rotas from './routes/routes.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Rotas/>


    <ToastContainer 
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Flip}
      theme="dark"
    />
  </StrictMode>,
)
