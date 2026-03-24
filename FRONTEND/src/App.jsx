import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';


//Pages
import './App.css'

import Login from './pages/login/Login';

import CreateUser from './pages/admin/CreateUser';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import SingleLog from './pages/admin/SingleLog';

import InternDashboard from "./pages/intern/Dashboard";
import CreateLog from "./pages/intern/CreateLog";




// Blocks unauthenticated users from accessing any page

const ProtectedRoute = ({ children }) => {
  const { user, loading} = useAuth();

  if (loading) return <div> Loading...</div>;
  if (!user) return <Navigate to="/login" />
  

  return children;
}


// Blocks non-admin users from accessing admin pages

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== "ADMIN") return <Navigate to="/dashboard" />;

    return children;
};


const App = () => {
  return (
    <>
      <AuthProvider> 
        <Routes>
          <Route path='/login' element={<Login />} />

          {/* Admin routes */}
          <Route path='/admin/users/create' element={ <AdminRoute> <CreateUser /> </AdminRoute> }/>
          <Route path='/admin/dashboard' element={ <AdminRoute> <AdminDashboard /> </AdminRoute> }/>
          <Route path='/admin/users'  element={ <AdminRoute> <AdminUsers /> </AdminRoute> }/>
          <Route path='/admin/logs/:id'  element={ <AdminRoute> <SingleLog /> </AdminRoute> }/>

          {/* Intern routes */}
          <Route path="/dashboard" element={ <ProtectedRoute> <InternDashboard /> </ProtectedRoute> }/>
          <Route path="/logs/create" element={ <ProtectedRoute> <CreateLog /> </ProtectedRoute> }/>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
      </AuthProvider>
    </>
  )
}


export default App;
