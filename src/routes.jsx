import {Routes, Route, Navigate} from 'react-router-dom';
import Landing from './pages/LandingPage/Landing.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import { useAuth} from '/context/AuthContext';


function ProtectedRouter({ children}){
    const {token} = useAuth();
    return token ? children : <Navigate to="/" />
}




export default Function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route
                path='/dashboard'
                element={
                    <ProtectedRouter>
                        <Dashboard />
                    </ProtectedRouter>
                }
            />
        </Routes>
    );
}