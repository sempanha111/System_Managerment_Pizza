
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Dashboard from "./Dashboard";
import Login from "./Component/Main/login";
import UserManagement from "./Component/Main/UserManagement";
import ProtectedAuth from './Component/Main/ProtectedAuth';
import ProtectedRoute from './Component/Main/ProtectedRoute';

function App() {

  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={
            <ProtectedAuth>
              <Dashboard />
            </ProtectedAuth>
          }></Route>
          <Route
            path="/login"
            element={
              <ProtectedRoute
                element={<Login />}
                redirectTo="/"
              />
            }
          />
          <Route path="/user" element={<UserManagement />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
