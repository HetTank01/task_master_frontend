import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import PrivateRoutesGuard from './PrivateRoutesGuard';
import NotFound from '../NotFound';
import InviteHandler from '../pages/InviteHandler';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/invite" element={<InviteHandler />} />

        <Route element={<PrivateRoutesGuard />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
