import { Spin } from 'antd';


import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import { authStore } from '../shared/stores/auth';
import MainPage from '../pages/main/MainPage';

export const App = () => {
  const isAuth = authStore((state) => state.isAuth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Suspense fallback={<Spin />}>
        <Routes>
          {!isAuth && <Route path='/' element={<Login />} />}
          <Route path='/sign-in' element={< Login/>} />
          {isAuth && <Route path='/' element={< MainPage/>} />}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};
