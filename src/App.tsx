import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';
import NotFoundPage from './pages/error-pages/not-found';
import { useEffect, useState } from 'react';
import { apiCLient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const PublicRoutes = () => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  const location = useLocation();
  return isAuthenticated && location.pathname === '/auth' ? <Navigate to="/profile" /> : <Outlet />;
};

const PrivateRoutes = () => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await apiCLient.get(GET_USER_INFO);
        if (data.user.id) {
          setUserInfo(data.user);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
    return () => setLoading(false);
  }, [userInfo, setUserInfo]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
