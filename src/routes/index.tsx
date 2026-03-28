import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';

import HomePage from '../pages/HomePage';
import RealisationsPage from '../pages/RealisationsPage';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';

import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import AdminMessagesPage from '../pages/admin/AdminMessagesPage';
import AdminRealisationsPage from '../pages/admin/AdminRealisationsPage';
import AdminAvisPage from '../pages/admin/AdminAvisPage';
import AdminStatsPage from '../pages/admin/AdminStatsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'realisations', element: <RealisationsPage /> },
      { path: 'a-propos', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'messages', element: <AdminMessagesPage /> },
      { path: 'realisations', element: <AdminRealisationsPage /> },
      { path: 'avis', element: <AdminAvisPage /> },
      { path: 'stats', element: <AdminStatsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
