import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountantDashboard from './pages/AccountantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import axios_api from './axios/axios';

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState("none");
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    axios_api.get("/logout").then(response => {
      setIsAuthorized(false);
    });
  }

  useEffect(() => {
    axios_api.get("/isAuthorized").then(response => {
      setIsAuthorized(response.data.isAuthorized);

      axios_api.get("/get_user_role").then(response => {
        setUserRole(response.data.roleName ? response.data.roleName : "none");

        setIsLoading(false);
      });
    });
  }, [isAuthorized, userRole, isLoading]);

  if (isLoading) return <></>;

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthorized && <Route path="*" element={<AuthPage onLogin={() => setIsAuthorized(true)} />} />}
        {isAuthorized && userRole === "user" && <Route path="*" element={<UserDashboard onLogout={logout} />} />}
        {isAuthorized && userRole === "accountant" && <Route path="*" element={<AccountantDashboard onLogout={logout} />} />}
        {isAuthorized && userRole === "admin" && <Route path="*" element={<AdminDashboard onLogout={logout} />} />}
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);